from django.core.exceptions import ValidationError
from rest_framework import serializers

from task_options.serializers import TaskOptionsSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    unit_fk = TaskOptionsSerializer(source='unit')

    class Meta:
        model = User
        fields = ['id',
                  'first_name',
                  'last_name',
                  'is_active',
                  'username',
                  'is_admin',
                  'is_solver',
                  'initials',
                  'logo_color',
                  'email',
                  'phone',
                  'date_of_last_changed_password',
                  'date_of_last_incorrect_login',
                  'unit',
                  'last_login',
                  'date_joined',
                  'unit_fk']

def validate_unique_username(value):
    if User.objects.filter(username=value).exists():
        raise ValidationError('This username is already taken.')

def validate_unique_email(value):
    if User.objects.filter(email=value).exists():
        raise ValidationError('This email is already taken.')
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'is_active',
            'username',
            'is_admin',
            'initials',
            'logo_color',
            'email',
            'password'
        ]
        extra_kwargs = {
            'username': {
                'validators': [validate_unique_username]
            },
            'email': {
                'validators': [validate_unique_email]
            }
        }

