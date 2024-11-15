from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions,status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import TokenAuthentication
from .models import FarmProduce
from .serializers import FarmProduceSerializer, ProduceListSerializer
from .permissions import IsFarmerOrReadOnly

# class FarmProduceViewSet(viewsets.ModelViewSet):
#     serializer_class = FarmProduceSerializer
#     permission_classes = [permissions.AllowAny]

#     def get_queryset(self):
#         if self.request.user.role == 'farmer':
#             return FarmProduce.objects.filter(farmer=self.request.user)
#         return FarmProduce.objects.none()

#     def perform_create(self, serializer):
#         serializer.save(farmer=self.request.user)

class FarmProduceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for farmers to create, update, and delete their own produce.
    Only users with the 'farmer' role can create, update, or delete produce items.
    """
    queryset = FarmProduce.objects.all()
    serializer_class = FarmProduceSerializer 
    permission_classes = [permissions.IsAuthenticated, IsFarmerOrReadOnly]

    def get_queryset(self):
        # All authenticated users can view produce, but farmers can only manage their own produce.
        if self.action in ['update', 'partial_update', 'destroy']:
            return FarmProduce.objects.filter(farmer=self.request.user)
        return FarmProduce.objects.all()

    def perform_create(self, serializer):
        # Ensure only farmers can create produce items.
        if self.request.user.role != 'farmer':
            raise PermissionDenied("Only farmers are allowed to create produce items.")
        # Automatically set the farmer field to the current authenticated user.
        serializer.save(farmer=self.request.user)


class ProduceListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet for authenticated users to list all produce items with basic details.
    """
    queryset = FarmProduce.objects.all()
    serializer_class = ProduceListSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]