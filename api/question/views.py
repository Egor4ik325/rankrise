from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from rest_framework import filters, viewsets

from .models import Question
from .pagination import QuestionPagination
from .permissions import QuestionPermission
from .serializers import QuestionSerializer
from .throttles import BurstCommunityRateThrottle, SustainedCommunityRateThrottle


class QuestionFilter(FilterSet):
    class Meta:
        model = Question
        fields = {
            "category": ["exact", "in"],
        }


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.order_by("-ask_time")
    serializer_class = QuestionSerializer
    permission_classes = [QuestionPermission]
    throttle_classes = [BurstCommunityRateThrottle, SustainedCommunityRateThrottle]
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    search_fields = ["title"]
    ordering_fields = ["ask_time"]
    pagination_class = QuestionPagination
    filterset_class = QuestionFilter
