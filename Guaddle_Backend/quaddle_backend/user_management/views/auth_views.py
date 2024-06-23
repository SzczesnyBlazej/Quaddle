from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.exceptions import AuthenticationFailed

from ..models import User
from ..serializers import UserSerializer, CreateUserSerializer
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request._request, username=username, password=password)
        if user:
            auth_login(request._request, user)
            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            user_data = serializer.data
            data = {
                'access_token': str(access_token),
                'refresh_token': str(refresh_token),
                'user': user_data,
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Method Not Allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    user_data = request.data
    if user_data['password'] != user_data['confirmPassword']:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    user_data.pop('confirmPassword')

    serializer = CreateUserSerializer(data=user_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout(request):
    refresh_token = request.data.get('refresh_token')
    request.session.flush()

    try:
        RefreshToken(refresh_token).blacklist()
        return Response({'detail': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def validate_token(request):
    try:
        authentication = JWTAuthentication()
        user, _ = authentication.authenticate(request)
        if user:
            return Response({'message': 'Valid token'}, status=status.HTTP_200_OK)
        else:
            raise AuthenticationFailed('Invalid token')
    except AuthenticationFailed as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)