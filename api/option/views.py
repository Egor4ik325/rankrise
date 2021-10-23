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
        return Option.objects.filter(question=self.get_question())

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
