from django.conf import settings
from django.db import models

from task_options.models import TaskOptions


class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    client_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tasks_as_client', on_delete=models.SET_NULL, blank=True, null=True)
    create_date = models.DateField()
    create_hour = models.TimeField()
    last_modification = models.DateField()
    last_modification_hour = models.TimeField()
    close_date = models.DateField(null=True, blank=True)
    close_hour = models.TimeField(null=True, blank=True)
    priority = models.ForeignKey(TaskOptions, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'title': 'Priority'},related_name='priority_tasks')
    difficulty = models.ForeignKey(TaskOptions, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'title': 'Difficulty'}, related_name='difficulty_tasks')
    status = models.ForeignKey(TaskOptions, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'title': 'Status'}, related_name='status_tasks')
    unit = models.ForeignKey(TaskOptions, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'title': 'Unit'}, related_name='units_tasks')
    solver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tasks_as_solver', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.id}"

class Notification(models.Model):
    notification_text = models.CharField(max_length=255)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)

    notification_date = models.DateField()
    notification_time = models.TimeField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self.notification_text} - {self.id}"

class Message(models.Model):
    message = models.CharField(max_length=255)
    client_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='messages_as_client', on_delete=models.SET_NULL, null=True)
    task_id = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True)
    message_sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='messages_as_sender', on_delete=models.SET_NULL, null=True)
    create_date = models.DateField()
    create_hour = models.TimeField()
    is_lock = models.BooleanField()
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self.message} - {self.id}"

class Favorites(models.Model):
    id = models.AutoField(primary_key=True)
    favorites_tasks_id = models.ManyToManyField(Task, related_name='favorited_by')
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Favorites for User {self.user_id.username} - {self.id}"


