from rest_framework.permissions import BasePermission
from .models import Role

class IsAuthenticatedVerifiedActive(BasePermission):
    """
    Allows access only to authenticated, verified, and active users.
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.is_verified and
            request.user.is_active
        )

class IsAdmin(IsAuthenticatedVerifiedActive):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == Role.ADMIN

class IsOrganizer(IsAuthenticatedVerifiedActive):
    """
    Allows access only to organizer users.
    """

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == Role.ORGANIZER

class IsRegularUser(IsAuthenticatedVerifiedActive):
    """
    Allows access only to regular users.
    """

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == Role.USER