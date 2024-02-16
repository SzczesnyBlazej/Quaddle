from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskOptionsViewSet, get_task_options_by_title, update_task_options_by_id, \
    delete_task_options_by_id, create_task_option

router = DefaultRouter()

router.register(r'taskOptions', TaskOptionsViewSet)

urlpatterns = [
    path('taskOptions/update/<int:id>/', update_task_options_by_id, name='update-taskoptions-by-id'),
    path('taskOptions/delete/<int:id>/', delete_task_options_by_id, name='delete-taskoptions-by-id'),
    path('taskOptions/<str:title>/', get_task_options_by_title, name='taskoptions-by-title'),
    path('taskOptions/create', create_task_option, name='create-taskoption'),
]

urlpatterns += router.urls
