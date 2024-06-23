from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Task, Message, File, TaskHistory
from user_management.models import User

import json

from ..serializers import TaskHistorySerializer


@require_POST
@csrf_exempt
def create_task_history(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        message = data.get('message')
        created_by = data.get('createdBy')
        task_id = data.get('task_id')
        create_date = data.get('createDate')
        create_hour = data.get('createHour')

        created_by_user = User.objects.get(id=created_by)
        task = Task.objects.get(id=task_id)
        new_task_history = TaskHistory.objects.create(
            task_id=task,
            message=message,
            created_by=created_by_user,
            create_date=create_date,
            create_hour=create_hour,
        )
        new_task_history.save()
        return JsonResponse({'id': new_task_history.id}, status=201)

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
@csrf_exempt
def get_task_history(request):
    task_id = request.GET.get('task_id')
    messages = TaskHistory.objects.filter(task_id=task_id)
    serializer = TaskHistorySerializer(messages, many=True)
    return Response(serializer.data)