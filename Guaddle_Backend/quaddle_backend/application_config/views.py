from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ApplicationConfig
from .serializers import ApplicationConfigSerializer


# Create your views here.
class ApplicationConfigViewSet(viewsets.ModelViewSet):
    queryset = ApplicationConfig.objects.all()
    serializer_class = ApplicationConfigSerializer

@api_view(['GET'])
def get_application_config(request, identifier):
    try:
        config_id = int(identifier)
        application_config = ApplicationConfig.objects.get(pk=config_id)
    except ValueError:
        application_config = ApplicationConfig.objects.filter(title=identifier).first()

    if application_config:
        serializer = ApplicationConfigSerializer(application_config)
        return Response(serializer.data)
    else:
        return Response({"error": "ApplicationConfig not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_application_config_by_id(request, id):
    try:
        application_config = ApplicationConfig.objects.get(pk=id)
    except ApplicationConfig.DoesNotExist:
        return ApplicationConfig({"error": "ApplicationConfig not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ApplicationConfig(application_config, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)