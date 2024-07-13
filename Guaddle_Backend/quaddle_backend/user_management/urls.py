from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.auth_views import UserViewSet, login, register, logout, validate_token, token_refresh
from .views.user_views import get_user_data,get_user_data_by_token, get_users, get_solvers_list, get_user_from_access_token, update_user

router = DefaultRouter()

router.register(r'user', UserViewSet)

urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('logout/', logout, name='logout'),
    path('get_user_data/', get_user_data, name='get_user_data'),
    path('get_users/', get_users, name='get_users'),
    path('get_solvers_list/', get_solvers_list, name='get_solvers_list'),
    path('update_user/<int:user_id>', update_user, name='update_user'),
    path('get_user_data_by_token/', get_user_data_by_token, name='get_user_data_by_token'),
    path('get_user_from_access_token/', get_user_from_access_token, name='get_user_from_access_token'),
    path('validate_token/', validate_token, name='validate_token'),
    path('token/refresh/', token_refresh, name='token_refresh'),

]

urlpatterns += router.urls
