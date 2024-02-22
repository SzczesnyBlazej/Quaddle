from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.dashboard_views import count_all_tasks_to_menu, get_task_counts_dashboard, get_priority_counts_dashboard, \
    get_difficulty_counts_dashboard, get_units_counts_dashboard, get_last_thirty_days_task_counts
from .views.favorites_views import FavoritesViewSet, toggle_favorite, check_favorite
from .views.message_views import MessageViewSet, get_messages, delete_message, update_message, create_message, \
    download_file
from .views.notification_views import NotificationViewSet, get_notifications, create_notification
from .views.task_views import TaskViewSet, get_tasks, get_tasks_by_id, create_task, update_task
from django.urls import path

router = DefaultRouter()

router.register(r'task', TaskViewSet)
router.register(r'notification', NotificationViewSet)
router.register(r'message', MessageViewSet)
router.register(r'favorites', FavoritesViewSet)
urlpatterns = [
    path('notification/', get_notifications, name='get_notifications'),
    path('task/', get_tasks, name='get_tasks'),
    path('get_tasks_by_id/', get_tasks_by_id, name='get_tasks_by_id'),
    path('create_task', create_task, name='create_task'),
    path('toggle_favorite', toggle_favorite, name='toggle_favorite'),
    path('check_favorite', check_favorite, name='check_favorite'),
    path('update_task/<int:task_id>', update_task, name='update_task'),
    path('create_notification', create_notification, name='create_notification'),
    path('get_messages', get_messages, name='get_messages'),
    path('delete_message/<int:message_id>/', delete_message, name='delete_message'),
    path('update_message/<int:message_id>', update_message, name='update_message'),
    path('create_message', create_message, name='create_message'),
    path('count_all_tasks_to_menu/', count_all_tasks_to_menu, name='count_all_tasks_to_menu'),
    path('get_task_counts_dashboard/', get_task_counts_dashboard, name='get_task_counts_dashboard'),
    path('get_priority_counts_dashboard/', get_priority_counts_dashboard, name='get_priority_counts_dashboard'),
    path('get_difficulty_counts_dashboard/', get_difficulty_counts_dashboard, name='get_difficulty_counts_dashboard'),
    path('get_units_counts_dashboard/', get_units_counts_dashboard, name='get_units_counts_dashboard'),
    path('get_last_thirty_days_task_counts/', get_last_thirty_days_task_counts,
         name='get_last_thirty_days_task_counts'),
    path('download/<str:file_name>/', download_file, name='download_file'),

]
urlpatterns += router.urls
