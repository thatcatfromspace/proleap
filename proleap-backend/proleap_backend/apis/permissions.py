from rest_framework import permissions


class OrganizerOnlyAllPermission(permissions.BasePermission):
    message = "This operation is allowed for only Organizers"

    def has_permission(self, request, view):
        print("I AM CALLLED 1")
        return request.user.is_authenticated and request.user.role in [
            "ADMIN",
            "ORGANIZER",
        ]
    
class UserOnlyAllPermission(permissions.BasePermission):
    message = "This operation is allowed for only Users."

    def has_permission(self, request, view):
        print("I AM CALLLED 2")
        return request.user.is_authenticated and request.user.role in [
            "ADMIN",
            "USER",
        ]