import json

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import viewsets
from rest_framework.response import Response

from user_management.models import User
from ..models import Phrase
from ..serializers import PhrasesSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view

class PhraseViewSet(viewsets.ModelViewSet):
    queryset = Phrase.objects.all()
    serializer_class = PhrasesSerializer

@api_view(['GET'])
def get_phrases(request):
    phrases = Phrase.objects.all()
    serializer = PhrasesSerializer(phrases, many=True)
    return Response(serializer.data)


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
