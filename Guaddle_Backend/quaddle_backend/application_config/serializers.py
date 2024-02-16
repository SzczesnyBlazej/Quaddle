from rest_framework import serializers

from .models import ApplicationConfig


class ApplicationConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationConfig
        fields = '__all__'
