from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ApplicationConfigViewSet, update_application_config_by_id, get_application_config

router = DefaultRouter()

router.register(r'applicationConfig', ApplicationConfigViewSet)

urlpatterns = [
    path('application_config/update/<int:id>/', update_application_config_by_id, name='update_application_config_by_id'),
    path('application_config/<str:identifier>/', get_application_config, name='get_application_config'),

]

urlpatterns += router.urls
