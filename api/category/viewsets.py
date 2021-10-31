from rest_framework import viewsets, permissions, filters, pagination
from rest_framework.settings import api_settings
from django_filters.rest_framework import DjangoFilterBackend

from category.models import Category
from category.serializers import CategorySerializer


class CategoryPagination(pagination.PageNumberPagination):
    page_size = 20


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["parent"]
    search_fields = ["name"]
    pagination_class = CategoryPagination

    def get_queryset(self):
        """Default behaviour - list all root categories.
        Otherwise (detail, filter, search) - full queryset."""
        if self.kwargs.get("pk"):
            return Category.objects.all()

        search_param = api_settings.SEARCH_PARAM
        if self.request.query_params.get(search_param):
            return Category.objects.all()

        filterset_fields = getattr(CategoryViewSet, "filterset_fields", None)
        if filterset_fields:
            for filterset_field in filterset_fields:
                if self.request.query_params.get(filterset_field):
                    return Category.objects.all()

        return Category.objects.filter(parent=None)
