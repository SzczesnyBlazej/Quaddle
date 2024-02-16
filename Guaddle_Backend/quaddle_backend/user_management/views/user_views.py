from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import  AccessToken
from django.db.models import Q
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import User
from ..serializers import UserSerializer
from task_options.models import TaskOptions

@api_view(['GET'])
def get_user_data(request):
    csrftoken = get_token(request)
    return JsonResponse({'csrftoken': csrftoken})


@api_view(['GET'])
@csrf_exempt
def get_user_data_by_token(request):
    authorization_header = request.headers.get('Authorization')
    if authorization_header:
        try:
            user, _ = JWTAuthentication().authenticate(request)
            if user:
                serializer = UserSerializer(user)
                user_data = serializer.data
                return Response(user_data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid token or user not authenticated'},
                                status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({'error': 'Invalid token or user not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Authorization header not provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@csrf_exempt
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@csrf_exempt
def get_solvers_list(request):
    solvers_and_admins = User.objects.filter(Q(is_solver=True) | Q(is_admin=True))
    serializer = UserSerializer(solvers_and_admins, many=True)
    return Response(serializer.data)


@api_view(['POST', 'GET'])
@csrf_exempt
def get_user_from_access_token(request):
    token = request.data.get('token')
    if not token:
        return JsonResponse({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        user = User.objects.get(id=user_id)
        user_data = {
            "isAuthenticated": True,
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "is_solver": user.is_solver,
            "initials": user.initials,
            "logo_color": user.logo_color,
            "email": user.email,
            "phone": user.phone,
            "date_of_last_changed_password": user.date_of_last_changed_password,
            "unit": user.unit_id,
            "last_login": user.last_login,
        }
        return JsonResponse(user_data)
    except ObjectDoesNotExist:
        return JsonResponse({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@csrf_exempt
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    user_data = request.data

    new_password = user_data.pop('password', None)
    if new_password:
        hashed_password = make_password(new_password)
        user_data['password'] = hashed_password
        user_data['date_of_last_changed_password'] = timezone.now()

    unit_id = user_data.get('unit')

    if unit_id:
        try:
            unit = TaskOptions.objects.get(id=unit_id)
            user_data['unit'] = unit
        except TaskOptions.DoesNotExist:
            return Response({'error': 'Unit not found'}, status=status.HTTP_400_BAD_REQUEST)
    active = user_data.get('is_active')
    if active:
        user_data['is_active'] = True
    else:
        user_data['is_active'] = False

    for key, value in user_data.items():
        setattr(user, key, value)

    user.save()

    return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)
