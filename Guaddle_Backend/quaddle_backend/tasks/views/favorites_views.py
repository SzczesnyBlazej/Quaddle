import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from ..models import Favorites, Task
from ..serializers import FavoritesSerializer
from user_management.models import User


class FavoritesViewSet(viewsets.ModelViewSet):
    queryset = Favorites.objects.all()
    serializer_class = FavoritesSerializer

@require_POST
@csrf_exempt
def toggle_favorite(request):
    data = json.loads(request.body.decode('utf-8'))
    user_id = data.get('user_id')
    task_id = data.get('task_id')
    user = User.objects.get(pk=user_id)
    task = Task.objects.get(pk=task_id)
    try:
        favorites_entry = Favorites.objects.get(user_id=user_id)
        if task in favorites_entry.favorites_tasks_id.all():
            favorites_entry.favorites_tasks_id.remove(task)
            response_data = {'message': 'Task removed from favorites', 'user_id': user_id, 'task_id': task_id}
            return JsonResponse(response_data, status=status.HTTP_200_OK)
        else:
            favorites_entry.favorites_tasks_id.add(task)
            response_data = {'message': 'Task added to favorites', 'user_id': user_id, 'task_id': task_id}
            return JsonResponse(response_data, status=status.HTTP_200_OK)
    except Favorites.DoesNotExist:
        favorites_entry = Favorites.objects.create(user_id=user)
        favorites_entry.favorites_tasks_id.add(task)
        response_data = {'message': 'Task added to favorites', 'user_id': user_id, 'task_id': task_id}
        return JsonResponse(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@csrf_exempt
def check_favorite(request):
    user = request.GET.get('user_id')
    task = request.GET.get('task_id')
    favorite_list=request.GET.get('favorite_list')
    try:
        favorites_entry = Favorites.objects.get(user_id=user)

        favorite_task_ids = favorites_entry.favorites_tasks_id.values_list('id', flat=True)
        if favorite_list:
            response_data = {'favorite_list': list(favorite_task_ids)}
            return JsonResponse(response_data, status=200)
        else:
            is_favorite = int(task) in favorite_task_ids
            response_data = {'is_favorite': is_favorite}
            return JsonResponse(response_data, status=200)
    except Favorites.DoesNotExist:
        response_data = {'is_favorite': False}
        return JsonResponse(response_data, status=200)