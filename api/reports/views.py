from dj_rest_auth.jwt_auth import JWTAuthentication
from rest_framework import status
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
)
from rest_framework.permissions import SAFE_METHODS
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet

from .models import Report
from .permissions import ReportPermission
from .serializers import ReportDeserializer, ReportSerializer


class ReportViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    """
    ViewSet for report.
    """

    # Queryset and serialization
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    # URLconf
    lookup_field = "uuid"
    lookup_url_kwarg = "pk"
    lookup_value_regex = r"^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$"  # UUID regex

    # Authentication and authorization
    authentication_classes = [JWTAuthentication]
    permission_classes = [ReportPermission]

    def get_serializer_class(self):
        """Serializer/deserializer depend on request action/method."""
        if self.request.method in SAFE_METHODS:
            return ReportSerializer

        return ReportDeserializer

    def get_queryset(self):
        return self.queryset

    def create(self, *args, **kwargs):
        return super().create(*args, **kwargs)
        # return Response({"detail": "Thanks for reporting!"}, status.HTTP_201_CREATED)
