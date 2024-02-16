import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Notification, Task
from ..serializers import  NotificationSerializer
from user_management.models import User

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

@api_view(['GET'])
def get_notifications(request):
    client_id = request.GET.get('client_id')
    if client_id:
        notifications = Notification.objects.filter(task_id__client_id=client_id) \
                            .order_by('-notification_date', '-notification_time')[:25]
    else:
        notifications = Notification.objects.all().order_by('-notification_date', '-notification_time')[:25]

    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@require_POST
@csrf_exempt
def create_notification(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        notificationText = data.get('notificationText')
        taskId = data.get('taskId')
        notificationDate = data.get('notificationDate')
        notificationTime = data.get('notificationTime')
        createdBy = data.get('createdBy')

        created_by_option = User.objects.get(pk=createdBy)
        taskId_option = Task.objects.get(pk=taskId)

        notification = Notification.objects.create(
            notification_text=notificationText,
            task_id=taskId_option,
            notification_date=notificationDate,
            notification_time=notificationTime,
            created_by=created_by_option
        )
        notification.save()
        # Zwracanie odpowiedzi z ID utworzonego zadania
        return JsonResponse({'id': notification.id}, status=201)

    except Exception as e:
        # Obsługa błędu
        return JsonResponse({'error': str(e)}, status=400)