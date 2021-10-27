from rest_framework import viewsets, pagination
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from question.models import Question
from option.models import Option
from option.serializers import OptionSerializer
from product.permissions import CommunityPermission


class OptionPagination(pagination.PageNumberPagination):
    page_size = 10


class QuestionOptionViewSet(viewsets.ModelViewSet):
    serializer_class = OptionSerializer
    permission_classes = [CommunityPermission]
    pagination_class = OptionPagination

    def get_question(self):
        return get_object_or_404(Question, pk=self.kwargs["question_pk"])

    def get_queryset(self):
        """
        Filter options based on URL-encoded question id.

        Order options based on calculated rating.
        """

        return Option.objects.raw(
            """
        -- Order options based on calculated rating for each one
        SELECT * FROM option_option
        WHERE option_option.question_id = %s
        ORDER BY
        (
            SELECT upvotes - (downvotes * 0.75) AS rating
            FROM (
                SELECT
                    SUM(CASE WHEN vote_vote.up = true THEN 1 ELSE 0 END) AS upvotes,
                    SUM(CASE WHEN vote_vote.up = false THEN 1 ELSE 0 END) AS downvotes
                FROM vote_vote WHERE vote_vote.option_id = option_option.id
            ) as t
        ) DESC;
        """,
            [self.get_question().pk],
        )

    def get_object(self):
        self.get_question()
        return get_object_or_404(Option, pk=self.kwargs["pk"])

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["question"] = self.get_question().pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


# TODO: ProductOptionViewSet
