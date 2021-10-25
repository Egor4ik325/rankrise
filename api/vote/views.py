from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from question.models import Question
from option.models import Option
from vote.models import Vote
from vote.serializers import VoteSerializer
from vote.permissions import IsOwnerOrIsAdminOrReadOnly


class VoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = [IsOwnerOrIsAdminOrReadOnly]

    def get_question(self):
        return get_object_or_404(Question, pk=self.kwargs["question_pk"])

    def get_option(self):
        return get_object_or_404(Option, pk=self.kwargs["option_pk"])

    def get_queryset(self):
        # Check that question exists
        self.get_question()
        return Vote.objects.filter(option=self.get_option())

    def perform_create(self, serializer):
        # * may raise field required validation error
        return serializer.save(option=self.get_option(), user=self.request.user)
