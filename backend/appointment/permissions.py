from rest_framework import permissions


class IsSystemAdmin(permissions.BasePermission):
    """
    Custom permission to allow access only to staff users (is_staff=True).
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated and is a staff member
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsPatient(permissions.BasePermission):
    """
    Custom permission to allow access only to staff users (is_staff=True).
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated and is a staff member
        return request.user and request.user.is_authenticated and request.user.is_patient
