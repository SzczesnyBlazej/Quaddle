import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quaddle_backend.settings")
import django
django.setup()

from django.test import TestCase
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status
import json

from tasks.models import Task, RecentlyViewedTasks
from user_management.models import User

class RecentlyViewedTasksAPITests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='test_user',email='wp1111@wp.pl',password='pbkdf2_sha256$720000$8PjP220bC0B1Z11iOxzJjo$GzQ2gbsKu8zHPT88UAnqZgi1isQe6zvii5oV9OnzVgs=',first_name='Bob',last_name='EEE')
        self.task = Task.objects.create(title='Test Task',create_date='2024-01-22',create_hour='19:40:27',last_modification='2024-01-22',last_modification_hour='19:40:27')
        self.recently_viewed_task = RecentlyViewedTasks.objects.create(user_id=self.user)
        self.recently_viewed_task.recently_viewed_tasks_id.add(self.task)

    def test_get_recently_viewed_tasks(self):
        response = self.client.get(reverse('get_recently_viewed_tasks'), {'client_id': self.user.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, self.task.title)

    def test_add_recently_viewed_tasks(self):
        data = {'client_id': self.user.id, 'task_id': self.task.id}
        response = self.client.post(reverse('add_recently_viewed_tasks'), data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(RecentlyViewedTasks.objects.filter(user_id=self.user.id, recently_viewed_tasks_id=self.task).exists())

    def test_delete_recently_viewed_tasks(self):
        data = {'client_id': self.user.id, 'task_id': self.task.id}
        response = self.client.post(reverse('delete_recently_viewed_tasks'), data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(RecentlyViewedTasks.objects.filter(user_id=self.user.id, recently_viewed_tasks_id=self.task).exists())
