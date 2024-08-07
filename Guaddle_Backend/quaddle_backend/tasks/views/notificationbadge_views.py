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
from django.shortcuts import get_object_or_404


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications_for_user(request):
    user_id = request.GET.get('user_id')
    if user_id:
        notifications = NotificationsBadge.objects.filter(owner=user_id).filter(is_read=False).order_by('-create_date')
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
        )
        notificationBadge.save()
        return JsonResponse({'id': notificationBadge.id}, status=201)

    except Exception as e:
        # Obsługa błędu
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_as_read(request):
    notification_id = request.data.get('notification_id')
    owner_id = request.data.get('owner_id')

    if not notification_id or not owner_id:
        return Response({"error": "notification_id and owner_id parameters are required"}, status=400)

    try:
        notifications = NotificationsBadge.objects.filter(
            notification=notification_id,
            owner=owner_id
        )
        notifications.update(is_read=True)

        return Response({"status": "success"}, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=400)


def mark_notifications_as_read_if_closed(task_id):
    try:
        notifications = NotificationsBadge.objects.filter(notification_id=task_id)
        if notifications.exists():
            notifications.update(is_read=True)
            return True
        else:
            return False
    except Exception as e:
        return False

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_as_read(request):
    user = request.user
    try:
        notifications = NotificationsBadge.objects.filter(owner=user, is_read=False)
        notifications.update(is_read=True)

        return Response({"status": "success"}, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=400)
