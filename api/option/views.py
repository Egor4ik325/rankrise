from decimal import Decimal

from django.db import connection
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from option.models import Option
from option.serializers import OptionSerializer
from product.permissions import CommunityPermission
from question.models import Question
from question.throttles import (
    BurstCommunityRateThrottle,
    SustainedCommunityRateThrottle,
)
from rest_framework import pagination, status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response


class OptionPagination(pagination.PageNumberPagination):
    page_size = 10


@method_decorator(cache_page(1), name="list")
class QuestionOptionViewSet(viewsets.ModelViewSet):
    serializer_class = OptionSerializer
    permission_classes = [CommunityPermission]
    pagination_class = OptionPagination
    throttle_classes = [BurstCommunityRateThrottle, SustainedCommunityRateThrottle]

    def get_question(self):
        return get_object_or_404(Question, pk=self.kwargs["question_pk"])

    def get_queryset(self):
        """
        Filter options based on URL-encoded question id.

        Order options based on calculated rating.
        """
        # 1. Order options based on rating (SQL)
        options = Option.objects.raw(
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

        # 2. Calculate max option rating (SQL)
        with connection.cursor() as cursor:
            cursor.execute(
                """
            SELECT MAX(rating) AS rating_max
            FROM (
                SELECT upvotes - (downvotes * 0.75) AS rating
                FROM (
                    SELECT
                        option_option.id AS id,
                        SUM(CASE WHEN vote_vote.up = true THEN 1 END) AS upvotes,
                        SUM(CASE WHEN vote_vote.up = false THEN 1 END) AS downvotes
                    FROM option_option INNER JOIN vote_vote ON option_option.id = vote_vote.option_id
                    GROUP BY option_option.id
                ) AS t
            ) AS t;
            """
            )
            rating_max = cursor.fetchone()[0]

        # No rating for option at all
        if not rating_max:
            for o in options:
                o.rank = 0
            return options

        # 3. Calculate rating per rank point (Python)
        point = rating_max / 100

        # 4. Annotate options with rank (Python/ORM)
        for o in options:
            upvotes, downvotes = o.upvotes, o.downvotes
            rating = upvotes - (downvotes * 0.75)
            rank = Decimal(rating) / point
            if upvotes == 0:
                rank -= Decimal(downvotes * 10)
            else:
                rank -= Decimal((downvotes * 10) / upvotes)

            o.rank = int(rank)

        return options

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
