
from rest_framework import permissions

class IsFarmerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow farmers (owners) of a produce item to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request, so allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the farmer (owner) of the produce.
        return obj.user == request.user
