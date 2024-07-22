import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Notification, Task, NotificationsBadge
from ..serializers import NotificationSerializer, NotificationsBadgeSerializer
from user_management.models import User


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications_for_user(request):
    user_id = request.GET.get('user_id')
    if user_id:
        notifications = NotificationsBadge.objects.filter(owner=user_id).order_by('-create_date')[:10]
        serializer = NotificationsBadgeSerializer(notifications, many=True)
        return Response(serializer.data)
    else:
        return Response({"error": "user_id parameter is required"}, status=400)


@require_POST
@permission_classes([IsAuthenticated])
def create_notification_badge(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        notification = data.get('notification_id')
        owner = data.get('client_id')

        owner = User.objects.get(pk=owner)
        notification = Notification.objects.get(pk=notification)

        notificationBadge = NotificationsBadge.objects.create(
            notification=notification,
            owner=owner,
            message="xd"
        )
        notificationBadge.save()
        return JsonResponse({'id': notificationBadge.id}, status=201)

    except Exception as e:
        # Obsługa błędu
        return JsonResponse({'error': str(e)}, status=400)
