from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import TaskOptions
from .serializers import TaskOptionsSerializer


class TaskOptionsViewSet(viewsets.ModelViewSet):
    queryset = TaskOptions.objects.all()
    serializer_class = TaskOptionsSerializer


@api_view(['GET'])
def get_task_options_by_title(request, title):
    task_options = TaskOptions.objects.filter(title=title)
    serializer = TaskOptionsSerializer(task_options, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_task_options_by_id(request, id):
    try:
        task_options = TaskOptions.objects.get(pk=id)
    except TaskOptions.DoesNotExist:
        return Response({"error": "TaskOptions not found"}, status=status.HTTP_404_NOT_FOUND)

    task_options.delete()
    return Response({"message": "TaskOptions deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_task_options_by_id(request, id):
    try:
        task_options = TaskOptions.objects.get(pk=id)
    except TaskOptions.DoesNotExist:
        return Response({"error": "TaskOptions not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskOptionsSerializer(task_options, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_task_option(request):
    serializer = TaskOptionsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)