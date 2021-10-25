from rest_framework import permissions


class IsOwnerOrIsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Permission for list and create.
        """
        if request.user.is_staff:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Permisson for read, update, partial update and delete.
        """
        if request.user.is_staff:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user
