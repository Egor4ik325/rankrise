from django.db import IntegrityError
from option.models import Option
from question.models import Question
from rest_framework import status, viewsets
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from vote.models import Vote
from vote.serializers import VoteSerializer


class UniqueConstrainedFailedError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "You already voted for this option"
    default_code = "unique_failed"


class VoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]

    def get_question(self):
        return get_object_or_404(Question, pk=self.kwargs["question_pk"])

    def get_option(self):
        return get_object_or_404(Option, pk=self.kwargs["option_pk"])

    def get_queryset(self):
        # Check that question exists
        self.get_question()

        # Filter votes down by options and requested user
        return Vote.objects.filter(option=self.get_option(), user=self.request.user)

    def perform_create(self, serializer):
        # NOTE: may raise field required validation error or any other filed-wide errors
        try:
            return serializer.save(option=self.get_option(), user=self.request.user)
        except IntegrityError:
            raise UniqueConstrainedFailedError
