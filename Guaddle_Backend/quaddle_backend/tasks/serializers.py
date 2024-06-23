from rest_framework import serializers

from .models import Task, Notification, Message, Favorites, File, RecentlyViewedTasks, TaskHistory
from user_management.serializers import UserSerializer

from task_options.serializers import TaskOptionsSerializer


class TaskSerializer(serializers.ModelSerializer):
    client_fk = UserSerializer(source='client_id')
    priority_fk = TaskOptionsSerializer(source='priority')
    difficulty_fk = TaskOptionsSerializer(source='difficulty')
    status_fk = TaskOptionsSerializer(source='status')
    unit_fk = TaskOptionsSerializer(source='unit')
    solver_fk = UserSerializer(source='solver')
    class Meta:
        model = Task
        fields = '__all__'
class NotificationSerializer(serializers.ModelSerializer):
    created_by_user = UserSerializer(source='created_by')
    task_detail = TaskSerializer(source='task_id')
    class Meta:
        model = Notification
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    task_detail = TaskSerializer(source='task_id')
    client_fk = UserSerializer(source='client_id')
    message_sender_fk = UserSerializer(source='message_sender')
    files = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_files(self, obj):
        files = File.objects.filter(message=obj)
        return FileSerializer(files, many=True).data

class TaskHistorySerializer(serializers.ModelSerializer):
    task_detail = TaskSerializer(source='task_id')
    client_fk = UserSerializer(source='created_by')

    class Meta:
        model = TaskHistory
        fields = '__all__'
class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'

class FavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorites
        fields = '__all__'

class RecentlyViewedTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentlyViewedTasks
        fields = '__all__'