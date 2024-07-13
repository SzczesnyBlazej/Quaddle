import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from rest_framework import viewsets, status
from rest_framework.response import Response
from user_management.models import User
from ..models import Phrase
from ..serializers import PhrasesSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
class PhraseViewSet(viewsets.ModelViewSet):
    queryset = Phrase.objects.all()
    serializer_class = PhrasesSerializer

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_phrases(request):
    try:
        if IsAuthenticated:
            phrases = Phrase.objects.filter(owner=request.user)
            serializer = PhrasesSerializer(phrases, many=True)
            return Response(serializer.data)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_POST
@csrf_exempt
def create_phrases(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        phrase = data.get('phrase')
        owner = data.get('owner')

        created_by_user = User.objects.get(id=owner)
        new_phrase = Phrase.objects.create(
            phrase=phrase,
            owner=created_by_user,
        )
        new_phrase.save()
        return JsonResponse({'id': new_phrase.id}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
@csrf_exempt
@require_http_methods(["PATCH"])
@permission_classes([IsAuthenticated])
def edit_pharse(request, pharse_id):
    try:
        if request.method == 'PATCH':
            message = Phrase.objects.get(pk=pharse_id)

            data = json.loads(request.body.decode('utf-8'))
            serializer = PhrasesSerializer(message, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)

    except Phrase.DoesNotExist:
        return JsonResponse({'error': 'Pharse not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_phrase(request, pharse_id):
    print(pharse_id)
    try:
        phrase = Phrase.objects.get(id=pharse_id)
        if phrase.owner != request.user:
            return Response({'error': 'You do not have permission to delete this phrase'}, status=status.HTTP_403_FORBIDDEN)
        phrase.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Phrase.DoesNotExist:
        return Response({'error': 'Phrase not found'}, status=status.HTTP_404_NOT_FOUND)