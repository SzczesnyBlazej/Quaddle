from django.db import models


# Create your models here.
class ApplicationConfig(models.Model):
    id = models.AutoField(primary_key=True)
    enable = models.BooleanField()
    value = models.CharField(max_length=10)
    description = models.TextField()
    title = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Enable Session Timeout - {self.id}"
