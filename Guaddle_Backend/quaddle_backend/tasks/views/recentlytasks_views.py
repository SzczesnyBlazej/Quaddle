from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view
from ..models import RecentlyViewedTasks, Task
from ..serializers import RecentlyViewedTasksSerializer, TaskSerializer  # Założenie, że masz taki serializer

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
        print(serializer.data)
        return JsonResponse({'tasks': serializer.data}, status=200)
    return JsonResponse({'error': 'client_id parameter is required'}, status=400)
