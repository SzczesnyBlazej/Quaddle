import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from quaddle_backend.settings import BASE_DIR
from ..models import Task, Message, File
from ..serializers import MessageSerializer, FileSerializer
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
    for message in serializer.data:
        attachments = File.objects.filter(message_id=message['id'])
        attachment_serializer = FileSerializer(attachments, many=True)
        message['attachments'] = attachment_serializer.data
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
        message = request.POST.get('message')
        client_id = request.POST.get('clientID')
        task_id = request.POST.get('taskID')
        message_sender = request.POST.get('messageSender')
        create_date = request.POST.get('createDate')
        create_hour = request.POST.get('createHour')
        is_lock = request.POST.get('isLock') == 'true'
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
        for file_field in request.FILES:
            uploaded_file = request.FILES.get(file_field)
            file_instance = File.objects.create(
                message=message,
                file=uploaded_file,
            )
            file_instance.save()

        return JsonResponse({'id': message.id}, status=201)

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': str(e)}, status=400)
from django.http import HttpResponse
import os
@api_view(['GET'])
@csrf_exempt
def download_file(request, file_name):
    media_root = os.path.join(BASE_DIR, 'media/uploads')
    print(file_name)
    file_path = os.path.join(media_root, file_name)
    try:
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(file.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
                return response
        else:
            return HttpResponse("Plik nie istnieje", status=404)
    except Exception as e:
        return HttpResponse("Wystąpił błąd: " + str(e), status=500)

