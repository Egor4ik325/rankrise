from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet

from .models import Report


class ReportPermission(BasePermission):
    """
    Authorization for report.
    """

    def has_permission(self, request: Request, view: ViewSet) -> bool:
        """Request-level authorization: create, list."""
        if not request.user.is_authenticated:
            return False

        if view.action == "create":
            return True

        if view.action == "list":
            return request.user.is_superuser

        return False

    def has_object_permission(
        self, request: Request, view: ViewSet, obj: Report
    ) -> bool:
        """Object-level authorization: retrieve, destroy."""
        return request.user.is_superuser
