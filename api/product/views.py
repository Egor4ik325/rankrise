from rest_framework import viewsets

from .models import Product, ProductImage
from .permissions import CommunityPermission
from .serializers import ProductSerializer, ProductImageSerializer


class NonUpdatableViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet,
):
    pass


class ProductViewSet(NonUpdatableViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [CommunityPermission]


class ProductImageViewSet(NonUpdatableViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [CommunityPermission]
