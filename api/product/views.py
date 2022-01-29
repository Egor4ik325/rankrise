from django_filters.rest_framework import DjangoFilterBackend
from question.throttles import (
    BurstCommunityRateThrottle,
    SustainedCommunityRateThrottle,
)
from rest_framework import filters, mixins, viewsets

from .models import Product, ProductImage
from .pagination import ProductPagination
from .permissions import CommunityPermission
from .serializers import ProductImageSerializer, ProductSerializer


class NonUpdatableViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    pass


class ProductViewSet(NonUpdatableViewSet):
    lookup_field = "pk"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [CommunityPermission]
    throttle_classes = [BurstCommunityRateThrottle, SustainedCommunityRateThrottle]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["name", "@description"]
    filterset_fields = ["price", "category"]
    pagination_class = ProductPagination


class ProductImageViewSet(NonUpdatableViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [CommunityPermission]
    throttle_classes = [BurstCommunityRateThrottle, SustainedCommunityRateThrottle]
    pagination_class = ProductPagination
