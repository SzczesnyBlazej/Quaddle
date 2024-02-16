import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Task, Message
from ..serializers import MessageSerializer
from user_management.models import User


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

@api_view(['GET'])
@csrf_exempt
def get_messages(request):
    task_id = request.GET.get('task_id')
    messages = Message.objects.filter(task_id=task_id)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@csrf_exempt
def delete_message(request, message_id):
    try:
        message = Message.objects.get(pk=message_id)
    except Message.DoesNotExist:
        return Response({"message": "Message not found"}, status=status.HTTP_404_NOT_FOUND)

    message.delete()
    return Response({"message": "Message deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@require_http_methods(["PATCH"])
@csrf_exempt
def update_message(request, message_id):
    try:
        if request.method == 'PATCH':
            message = Message.objects.get(pk=message_id)

            data = json.loads(request.body.decode('utf-8'))
            serializer = MessageSerializer(message, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)

    except Message.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_POST
@csrf_exempt
def create_message(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        message = data.get('message')
        client_id = data.get('clientID')
        task_id = data.get('taskID')
        message_sender = data.get('messageSender')
        create_date = data.get('createDate')
        create_hour = data.get('createHour')
        is_lock = data.get('isLock')

        client_option = User.objects.get(pk=client_id)
        sender_option = User.objects.get(pk=message_sender)
        task_option = Task.objects.get(pk=task_id)

        message = Message.objects.create(
            message=message,
            client_id=client_option,
            create_date=create_date,
            create_hour=create_hour,
            task_id=task_option,
            message_sender=sender_option,
            is_lock=is_lock,
        )
        message.save()
        # Zwracanie odpowiedzi z ID utworzonego zadania
        return JsonResponse({'id': message.id}, status=201)

    except Exception as e:
        # Obsługa błędu
        return JsonResponse({'error': str(e)}, status=400)