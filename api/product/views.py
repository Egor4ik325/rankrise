from rest_framework import viewsets, mixins, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product, ProductImage
from .permissions import CommunityPermission
from .serializers import ProductSerializer, ProductImageSerializer


class NonUpdatableViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    pass


class ProductViewSet(NonUpdatableViewSet):
    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [CommunityPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["name", "@description"]
    filterset_fields = ["price"]


class ProductImageViewSet(NonUpdatableViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [CommunityPermission]
