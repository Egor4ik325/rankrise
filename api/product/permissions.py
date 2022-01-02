from rest_framework import permissions


class CommunityPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ["retrieve", "list"]:
            return True
        if view.action in ["create"]:
            return request.user.is_authenticated
        if view.action in ["destroy"]:
            return request.user.is_staff

        return False
