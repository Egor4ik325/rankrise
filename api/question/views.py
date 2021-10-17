from rest_framework import viewsets

from .models import Question
from .permissions import QuestionPermission
from .serializers import QuestionSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [QuestionPermission]
