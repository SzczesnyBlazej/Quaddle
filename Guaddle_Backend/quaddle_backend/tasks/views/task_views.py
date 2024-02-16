import json

from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Task
from ..serializers import TaskSerializer
from task_options.models import TaskOptions
from user_management.models import User

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@api_view(['GET'])
def get_tasks(request):
    status_list = request.GET.getlist('status[]')
    clientID = request.GET.get('client_id')
    solver = request.GET.get('solver')
    query = request.GET.get('q')
    tasks = Task.objects.all()
    if status_list:
        tasks = tasks.filter(status__value__in=status_list)
    if query:
        tasks = tasks.filter(Q(title__icontains=query) | Q(description__icontains=query))
    if clientID:
        tasks = tasks.filter(client_id=clientID)
    if solver is not None:
        if solver == '0':
            tasks = tasks.filter(Q(solver=None) | Q(solver_id=None))
        else:
            tasks = tasks.filter(solver_id=solver)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@require_POST
@csrf_exempt
def create_task(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        title = data.get('title')
        description = data.get('description')
        unit = data.get('unit')
        client_id = data.get('clientID')
        create_date = data.get('createDate')
        create_hour = data.get('createHour')
        last_modification = data.get('lastModification')
        last_modification_hour = data.get('lastModificationHour')
        priority = data.get('priority')
        status = data.get('status')

        client_option = User.objects.get(pk=client_id)
        priority_option = TaskOptions.objects.get(pk=priority)
        unit_option = TaskOptions.objects.get(pk=unit)
        status_option = TaskOptions.objects.get(pk=status)

        solver = data.get('solver')
        difficulty = data.get('difficulty')

        if solver:
            solver_option = User.objects.get(pk=solver)
        else:
            solver_option = None

        if difficulty:
            difficulty_option = TaskOptions.objects.get(pk=difficulty)
        else:
            difficulty_option = None

        task = Task.objects.create(
            title=title,
            description=description,
            create_date=create_date,
            unit=unit_option,
            client_id=client_option,
            priority=priority_option,
            difficulty=difficulty_option,
            create_hour=create_hour,
            solver=solver_option,
            status=status_option,
            last_modification=last_modification,
            last_modification_hour=last_modification_hour,
        )
        task.save()
        # Zwracanie odpowiedzi z ID utworzonego zadania
        return JsonResponse({'id': task.id}, status=201)

    except Exception as e:
        # Obsługa błędu
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
def get_tasks_by_id(request):
    id_list = request.GET.getlist('id_list[]')
    if id_list:
        task = Task.objects.filter(pk__in=id_list)
        serializer = TaskSerializer(task, many=True)
        return Response(serializer.data)
    else:
        return JsonResponse({'error': 'Task not found'}, status=404)


@csrf_exempt
def update_task(request, task_id):
    try:
        if request.method == 'PUT':
            task = Task.objects.get(pk=task_id)
            data = json.loads(request.body.decode('utf-8'))
            serializer = TaskSerializer(task, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)

    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)