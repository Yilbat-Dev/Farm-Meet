from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import TokenAuthentication
from .models import State, LGA, CustomerProfile
from .serializers import StateSerializer, CustomerProfileSerializer

class StateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = State.objects.prefetch_related('lgas').all()
    serializer_class = StateSerializer


class CustomerProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.AllowAny]
