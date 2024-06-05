import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quaddle_backend.settings")
import django
django.setup()

from rest_framework import status
from rest_framework.test import APITestCase
from ..models import Favorites, Task
from user_management.models import User
from django.test import Client, TestCase
from django.urls import reverse
import json


class FavoritesViewSetTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    def setUp(self):
        self.user = User.objects.create(username='test_user',email='wp1111@wp.pl',password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs=',first_name='Bob',last_name='EEE')
        self.task1 = Task.objects.create(title='Test Task 1',create_date='2024-01-22',create_hour='19:40:27',last_modification='2024-01-22',last_modification_hour='19:40:27')
        self.task2 = Task.objects.create(title='Test Task 2',create_date='2024-01-22',create_hour='19:40:27',last_modification='2024-01-22',last_modification_hour='19:40:27')
        self.favorite = Favorites.objects.create(user_id=self.user)
        self.favorite.favorites_tasks_id.add(self.task1)

    def test_list_favorites(self):
        self.client.login(username='testuser', password='password')
        response = self.client.get('/api/favorites/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_favorite(self):
        self.client.login(username='testuser', password='password')
        response = self.client.post('/api/favorites/', {'user': self.user.id, 'favorites_tasks_id': [self.task2.id]})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Favorites.objects.count(), 2)


class ToggleFavoriteViewTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='test_user',email='wp1111@wp.pl',password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs=',first_name='Bob',last_name='EEE')
        self.task = Task.objects.create(title='Test Task 1',create_date='2024-01-22',create_hour='19:40:27',last_modification='2024-01-22',last_modification_hour='19:40:27')
        self.favorite = Favorites.objects.create(user_id=self.user)
        self.favorite.favorites_tasks_id.add(self.task)
        self.toggle_url = reverse('toggle_favorite')
        self.check_url = reverse('check_favorite')

    def test_toggle_favorite_add(self):
        self.client.login(username='test_user', password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs')
        new_task = Task.objects.create(title='Test Task 2',create_date='2024-01-22',create_hour='19:40:27',last_modification='2024-01-22',last_modification_hour='19:40:27')

        data = {'user_id': self.user.id, 'task_id': new_task.id}
        response = self.client.post(self.toggle_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.task, self.favorite.favorites_tasks_id.all())

    def test_toggle_favorite_remove(self):
        self.client.login(username='test_user', password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs')
        data = {'user_id': self.user.id, 'task_id': self.task.id}
        response = self.client.post(self.toggle_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(self.task, self.favorite.favorites_tasks_id.all())

    def test_check_favorite_true(self):
        self.client.login(username='test_user', password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs')
        response = self.client.get(self.check_url, {'user_id': self.user.id, 'task_id': self.task.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {'is_favorite': True})

    def test_check_favorite_false(self):
        self.client.login(username='test_user', password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs')
        new_task = Task.objects.create(title='Test Task 3',create_date='2024-01-22',create_hour='19:40:27',last_modification='2024-01-22',last_modification_hour='19:40:27')
        response = self.client.get(self.check_url, {'user_id': self.user.id, 'task_id': new_task.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {'is_favorite': False})

    def test_check_favorite_list(self):
        self.client.login(username='test_user', password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs')
        response = self.client.get(self.check_url, {'user_id': self.user.id, 'favorite_list': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {'favorite_list': [self.task.id]})