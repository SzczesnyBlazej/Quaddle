import json

from django.db.models import Q, Count
from django.http import HttpRequest

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .favorites_views import check_favorite
from ..models import Task

from user_management.models import User
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
def get_task_counts_dashboard(request):
    user_id = request.GET.get('userID')
    try:
        today = timezone.now().date()
        this_week_start = today - timedelta(days=7)

        closed_today_count = Task.objects.filter(close_date=today).count()

        closed_this_week_count = Task.objects.filter(close_date__range=[this_week_start, today]).count()

        my_pending_count = Task.objects.filter(solver=user_id, status__value__in=['Open', 'In Pendend']).count()

        all_pending_count = Task.objects.filter(close_date=None).count()

        results = {
            'closed_today_count': closed_today_count,
            'closed_this_week_count': closed_this_week_count,
            'my_pending_count': my_pending_count,
            'all_pending_count': all_pending_count
        }

        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def count_all_tasks_to_menu(request):
    user_id = request.GET.get('userID')

    check_favorite_request = HttpRequest()
    check_favorite_request.method = 'GET'
    check_favorite_request.GET = {'user_id': user_id, 'favorite_list': True}
    response = check_favorite(check_favorite_request)
    response_data = json.loads(response.content)
    favorite_list = response_data.get('favorite_list', [])

    try:
        results = {
            'MyTasks': Task.objects.filter(client_id=user_id, status__value__in=['Open', 'In Pendend']).count(),
            'myAssignedTasks': Task.objects.filter(solver=user_id, status__value__in=['Open', 'In Pendend']).count(),
            'allOpenedTask': Task.objects.filter(status__value='Open').count(),
            'myClosedTasks': Task.objects.filter(client_id=user_id, status__value='Close').count(),
            'allUnallocated': Task.objects.filter(solver=None, status__value__in=['Open', 'In Pendend']).count(),
            'AllInPendendTask': Task.objects.filter(status__value='In Pendend').count(),
            'allClosedTask': Task.objects.filter(status__value='Close').count(),
            'favorites': len(favorite_list),
        }
        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_priority_counts_dashboard(request):
    user_id = request.GET.get('userID')
    try:
        client_option = User.objects.get(pk=user_id)

        if client_option.is_admin:
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(client_id=user_id)

        priority_counts = tasks.values('priority__value').annotate(count=Count('id'))

        results = {
            'taskCountsByPriority': [{'priority': item['priority__value'], 'count': item['count']} for item in
                                     priority_counts],
        }
        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_difficulty_counts_dashboard(request):
    user_id = request.GET.get('userID')
    try:
        client_option = User.objects.get(pk=user_id)

        if client_option.is_admin:
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(client_id=user_id)
        difficulty_counts = tasks.values('difficulty__value').annotate(count=Count('id'))

        results = {
            'taskCountsByDifficulty': [{'difficulty': item['difficulty__value'], 'count': item['count']} for item in
                                       difficulty_counts],
        }
        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_units_counts_dashboard(request):
    user_id = request.GET.get('userID')
    try:
        client_option = User.objects.get(pk=user_id)

        if client_option.is_admin:
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(client_id=user_id)
        units_counts = tasks.values('unit__value').annotate(count=Count('id'))
        results = {
            'taskCountsByUnits': [{'units': item['unit__value'], 'count': item['count']} for item in units_counts],
        }
        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_last_thirty_days_task_counts(request):
    user_id = request.GET.get('userID')
    only_by_id = request.GET.get('only_by_id', False)
    client_option = User.objects.get(pk=user_id) if user_id else None

    try:
        today = timezone.now().date()
        last_thirty_days = today - timedelta(days=30)

        tasks_created = {}
        tasks_closed = {}

        # Pobranie dat w ciągu ostatnich 30 dni
        for i in range(30):
            date = last_thirty_days + timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            tasks_created[date_str] = 0
            tasks_closed[date_str] = 0

        # Sprawdzenie czy użytkownik jest administratorem lub czy jest przekazane user_id
        if only_by_id and user_id:
            # Jeśli only_by_id jest ustawione na True i przekazano user_id, zwróć zadania tylko dla tego użytkownika
            tasks_created_query = Task.objects.filter(create_date__gte=last_thirty_days, client_id=user_id)
            tasks_closed_query = Task.objects.filter(close_date__gte=last_thirty_days, client_id=user_id)
        elif client_option and client_option.is_admin:
            # Jeśli użytkownik jest administratorem, zwróć wszystkie zadania
            tasks_created_query = Task.objects.filter(create_date__gte=last_thirty_days)
            tasks_closed_query = Task.objects.filter(close_date__gte=last_thirty_days)
        elif client_option:
            # Jeśli użytkownik nie jest administratorem, ale przekazano user_id, zwróć zadania tylko dla tego użytkownika
            tasks_created_query = Task.objects.filter(create_date__gte=last_thirty_days, client_id=user_id)
            tasks_closed_query = Task.objects.filter(close_date__gte=last_thirty_days, client_id=user_id)
        else:
            # W przeciwnym razie, zwróć puste wyniki
            tasks_created_query = Task.objects.none()
            tasks_closed_query = Task.objects.none()

        # Liczenie liczby zadań utworzonych w każdym dniu
        for task in tasks_created_query:
            date_str = task.create_date.strftime('%Y-%m-%d')
            tasks_created[date_str] += 1

        # Liczenie liczby zadań zamkniętych w każdym dniu
        for task in tasks_closed_query:
            date_str = task.close_date.strftime('%Y-%m-%d')
            tasks_closed[date_str] += 1

        results = {
            'tasks_created': tasks_created,
            'tasks_closed': tasks_closed
        }

        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=500)