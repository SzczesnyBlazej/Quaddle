from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.dashboard_views import count_all_tasks_to_menu, get_task_counts_dashboard, get_priority_counts_dashboard, \
    get_difficulty_counts_dashboard, get_units_counts_dashboard, get_last_thirty_days_task_counts
from .views.favorites_views import FavoritesViewSet, toggle_favorite, check_favorite
from .views.message_views import MessageViewSet, get_messages, delete_message, update_message, create_message, \
    download_file
from .views.notification_views import NotificationViewSet, get_notifications, create_notification
from .views.recentlytasks_views import get_recently_viewed_tasks, delete_recently_viewed_tasks, \
    add_recently_viewed_tasks, get_users_by_task
from .views.recentvisitors_views import create_recently_visitors, get_recently_visitors
from .views.task_views import TaskViewSet, get_tasks, get_tasks_by_id, create_task, update_task
from django.urls import path
from .views.phrases_views import PhraseViewSet, create_phrases, get_phrases, edit_pharse, delete_phrase

from .views.taskhistory_views import create_task_history, get_task_history

router = DefaultRouter()

router.register(r'task', TaskViewSet)
router.register(r'notification', NotificationViewSet)
router.register(r'message', MessageViewSet)
router.register(r'favorites', FavoritesViewSet)
router.register(r'phrases', PhraseViewSet)

urlpatterns = [

#Phrases

    path('create_phrases', create_phrases, name='create_phrases'),
    path('get_phrases/', get_phrases, name='get_phrases'),
    path('edit_pharse/<int:pharse_id>', edit_pharse, name='edit_pharse'),
    path('delete_phrase/<int:pharse_id>/', delete_phrase, name='delete_phrase'),

    # Task related views
    path('task/', get_tasks, name='get_tasks'),
    path('get_tasks_by_id/', get_tasks_by_id, name='get_tasks_by_id'),
    path('create_task', create_task, name='create_task'),
    path('update_task/<int:task_id>', update_task, name='update_task'),

    # Task History related views
    path('create_task_history', create_task_history, name='create_task_history'),
    path('get_task_history', get_task_history, name='get_task_history'),

    # Notification related views
    path('notification/', get_notifications, name='get_notifications'),
    path('create_notification', create_notification, name='create_notification'),

    # Message related views
    path('get_messages', get_messages, name='get_messages'),
    path('delete_message/<int:message_id>/', delete_message, name='delete_message'),
    path('update_message/<int:message_id>', update_message, name='update_message'),
    path('create_message', create_message, name='create_message'),
    path('download/<str:file_name>/', download_file, name='download_file'),

    # Favorites related views
    path('toggle_favorite', toggle_favorite, name='toggle_favorite'),
    path('check_favorite', check_favorite, name='check_favorite'),

    # Recently Viewed Tasks related views
    path('get_recently_viewed_tasks', get_recently_viewed_tasks, name='get_recently_viewed_tasks'),
    path('delete_recently_viewed_tasks', delete_recently_viewed_tasks, name='delete_recently_viewed_tasks'),
    path('add_recently_viewed_tasks', add_recently_viewed_tasks, name='add_recently_viewed_tasks'),
    path('get_users_by_tasks/<int:task_id>/', get_users_by_task, name='get_users_by_task'),

    # Recently Visitors related views
    path('create_recently_visitors', create_recently_visitors, name='create_recently_visitors'),
    path('get_recently_visitors', get_recently_visitors, name='get_recently_visitors'),

    # Dashboard related views
    path('count_all_tasks_to_menu/', count_all_tasks_to_menu, name='count_all_tasks_to_menu'),
    path('get_task_counts_dashboard/', get_task_counts_dashboard, name='get_task_counts_dashboard'),
    path('get_priority_counts_dashboard/', get_priority_counts_dashboard, name='get_priority_counts_dashboard'),
    path('get_difficulty_counts_dashboard/', get_difficulty_counts_dashboard, name='get_difficulty_counts_dashboard'),
    path('get_units_counts_dashboard/', get_units_counts_dashboard, name='get_units_counts_dashboard'),
    path('get_last_thirty_days_task_counts/', get_last_thirty_days_task_counts, name='get_last_thirty_days_task_counts'),

]
urlpatterns += router.urls
