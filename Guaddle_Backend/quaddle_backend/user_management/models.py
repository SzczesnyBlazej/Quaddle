import random

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractUser

from task_options.models import TaskOptions
from tasks.models import RecentlyViewedTasks



class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)
    is_solver = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    initials = models.CharField(max_length=2, null=True, blank=True)
    logo_color = models.CharField(max_length=7, null=True, blank=True)
    id = models.AutoField(primary_key=True)
    email = models.EmailField()
    unit = models.ForeignKey(TaskOptions, on_delete=models.SET_NULL, null=True, blank=True,
                             limit_choices_to={'title': 'Unit'})
    phone = models.CharField(max_length=15, null=True, blank=True)
    date_of_last_changed_password = models.DateTimeField(blank=True, null=True)
    date_of_last_incorrect_login = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.id} {self.username}"

    def save(self, *args, **kwargs):
        if not self.logo_color:
            self.logo_color = self.generate_logo_color()

        if not self.initials:
            first_letter_first_name = self.first_name[0].upper()
            first_letter_last_name = self.last_name[0].upper()
            self.initials = first_letter_first_name + first_letter_last_name

        if not self.is_active:
            self.is_active = True
        if self.password:
            self.password=make_password(self.password)

        super().save(*args, **kwargs)

    def generate_logo_color(self):
        color = '#{:06x}'.format(random.randint(0, 0xFFFFFF))
        return color

    #
    # def recently_viewed_tasks(self):
    #     recently_viewed_tasks, created = RecentlyViewedTasks.objects.get_or_create(user_id=self)
    #     return recently_viewed_tasks.recently_viewed_tasks_id.all() if recently_viewed_tasks else []



