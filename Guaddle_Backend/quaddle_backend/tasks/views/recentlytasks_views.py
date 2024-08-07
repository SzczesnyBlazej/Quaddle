from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated

from user_management.serializers import UserSerializer
from ..models import RecentlyViewedTasks, Task
from ..serializers import RecentlyViewedTasksSerializer, TaskSerializer  # Założenie, że masz taki serializer
import json
from user_management.models import User

class RecentlyViewedTasksViewSet(viewsets.ModelViewSet):
    queryset = RecentlyViewedTasks.objects.all()
    serializer_class = RecentlyViewedTasksSerializer  # Użyj odpowiedniego serializera

@api_view(['GET'])
def get_recently_viewed_tasks(request):
    client_id = request.GET.get('client_id')
    if client_id:
        recently_viewed_tasks = RecentlyViewedTasks.objects.filter(user_id=client_id)
        serializer = RecentlyViewedTasksSerializer(recently_viewed_tasks, many=True)
        tasks_id=serializer.data[0]['recently_viewed_tasks_id']
        tasks = Task.objects.filter(id__in=tasks_id)
        serializer = TaskSerializer(tasks, many=True)
        return JsonResponse({'tasks': serializer.data}, status=200)
    return JsonResponse({'error': 'client_id parameter is required'}, status=400)

@require_POST
@csrf_exempt
def delete_recently_viewed_tasks(request):
    data = json.loads(request.body.decode('utf-8'))
    client_id = data.get('client_id')
    task_id = data.get('task_id')
    task = Task.objects.get(pk=task_id)
    try:
        recently_viewed_tasks = RecentlyViewedTasks.objects.get(user_id=client_id)
        if task in recently_viewed_tasks.recently_viewed_tasks_id.all():
            recently_viewed_tasks.recently_viewed_tasks_id.remove(task)
            response_data = {'message': 'Task removed from last views', 'task_id': task_id}
            return JsonResponse(response_data, status=status.HTTP_200_OK)

    except RecentlyViewedTasks.DoesNotExist:
        response_data = {'message': 'Task can not be removed from last views'}
        return JsonResponse(response_data, status=status.HTTP_200_OK)

@require_POST
@csrf_exempt
def add_recently_viewed_tasks(request):
    data = json.loads(request.body.decode('utf-8'))
    client_id = data.get('client_id')
    task_id = data.get('task_id')
    task = Task.objects.get(pk=task_id)
    try:
        recently_viewed_tasks = RecentlyViewedTasks.objects.get(user_id=client_id)
        if task not in recently_viewed_tasks.recently_viewed_tasks_id.all():
            recently_viewed_tasks.recently_viewed_tasks_id.add(task)
            response_data = {'message': 'Task removed from last views', 'task_id': task_id}
            return JsonResponse(response_data, status=status.HTTP_200_OK)
        else:
            response_data = {'message': 'Task already exists in last views', 'task_id': task_id}
            return JsonResponse(response_data, status=status.HTTP_200_OK)

    except RecentlyViewedTasks.DoesNotExist:
            response_data = {'message': 'Task added to favorites', 'user_id': client_id, 'task_id': task_id}
            return JsonResponse(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_by_task(request, task_id):
    try:
        recently_viewed_tasks = RecentlyViewedTasks.objects.filter(recently_viewed_tasks_id__id=task_id)
        if not recently_viewed_tasks.exists():
            raise NotFound(detail="No tasks found with the given ID")

        users = [rv_task.user_id for rv_task in recently_viewed_tasks]
        if not users:
            raise NotFound(detail="No users found for the given task ID")

        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    except NotFound as e:
        return JsonResponse({'error': str(e)}, status=404)
    except ValidationError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Something went wrong'}, status=500)