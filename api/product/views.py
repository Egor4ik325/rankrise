from django_filters.rest_framework import DjangoFilterBackend, FilterSet
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


class ProductFilter(FilterSet):
    class Meta:
        model = Product
        fields = {
            "price": ["exact"],
            "category": ["exact", "in"],
        }


class ProductViewSet(NonUpdatableViewSet):
    lookup_field = "pk"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [CommunityPermission]
    throttle_classes = [BurstCommunityRateThrottle, SustainedCommunityRateThrottle]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "@description"]
    pagination_class = ProductPagination


class ProductImageViewSet(NonUpdatableViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [CommunityPermission]
    throttle_classes = [BurstCommunityRateThrottle, SustainedCommunityRateThrottle]
    pagination_class = ProductPagination
