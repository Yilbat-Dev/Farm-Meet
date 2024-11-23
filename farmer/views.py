from django.shortcuts import render

# Create your views here.
from rest_framework import generics,viewsets, permissions,status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import TokenAuthentication
from .models import FarmProduce, FarmerProfile
from .serializers import FarmerProfileSerializer, ProduceSerializer
from .permissions import IsFarmerOrReadOnly

class FarmerProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Farmer Profiles:
    - List and retrieve are available for all authenticated users.
    - Update and delete are restricted to profile owners.
    """
    queryset = FarmerProfile.objects.all()
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmerOrReadOnly]

    
  
class ProduceViewSet(viewsets.ModelViewSet):
    queryset = FarmProduce.objects.all()
    serializer_class = ProduceSerializer
    ermission_classes = [permissions.IsAuthenticated, IsFarmerOrReadOnly]
    
    def get_queryset(self):
        """
        Authenticated users can view all produce.
        """
        return FarmProduce.objects.all()

    def perform_create(self, serializer):
        """
        Only users with the 'farmer' role can create produce.
        """
        user = self.request.user
        if user.role != 'farmer':
            raise PermissionDenied("Only farmers can create produce.")
        # Ensure the farmer has a profile
        farmer_profile, created = FarmerProfile.objects.get_or_create(user=user)
        serializer.save(farmer_profile=farmer_profile)

    def perform_update(self, serializer):
        """
        Ensure only the owner of the produce (farmer) can update it.
        """
        user = self.request.user
        if self.get_object().farmer_profile.user != user:
            raise PermissionDenied("You do not have permission to edit this produce.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Ensure only the owner of the produce (farmer) can delete it.
        """
        user = self.request.user
        if instance.farmer_profile.user != user:
            raise PermissionDenied("You do not have permission to delete this produce.")
        instance.delete()