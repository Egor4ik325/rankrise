from rest_framework import viewsets, filters

from .models import Question
from .permissions import QuestionPermission
from .serializers import QuestionSerializer
from .pagination import QuestionPagination


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.order_by("-ask_time")
    serializer_class = QuestionSerializer
    permission_classes = [QuestionPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title"]
    ordering_fields = ["ask_time"]
    pagination_class = QuestionPagination
