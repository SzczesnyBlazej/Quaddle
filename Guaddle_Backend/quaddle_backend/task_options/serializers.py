from rest_framework import serializers
from .models import TaskOptions


class TaskOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskOptions
        fields = '__all__'



