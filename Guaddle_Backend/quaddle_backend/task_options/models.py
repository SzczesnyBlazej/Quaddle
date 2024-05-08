
from django.db import models


class TaskOptions(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    name = models.CharField(max_length=50, default='', null=True, blank=True)
    advice = models.CharField(max_length=250, default='No information available', null=True, blank=True)
    active = models.BooleanField()

    def __str__(self):
        return f"{self.title} - {self.value}"
