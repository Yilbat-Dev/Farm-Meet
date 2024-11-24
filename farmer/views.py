from django.shortcuts import render

# Create your views here.
from rest_framework import generics,viewsets, permissions,status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import TokenAuthentication
from .models import FarmProduce, FarmerProfile, ProduceImage
from .serializers import FarmerProfileSerializer, ProduceSerializer
from .permissions import IsFarmerOrReadOnly
from rest_framework.parsers import MultiPartParser

class FarmerProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Farmer Profiles:
    - List and retrieve are available for all authenticated users.
    - Update and delete are restricted to profile owners.
    """
    queryset = FarmerProfile.objects.all()
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmerOrReadOnly]
    parser_classes = [MultiPartParser]

    
  
class ProduceViewSet(viewsets.ModelViewSet):
    queryset = FarmProduce.objects.all()
    serializer_class = ProduceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

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
    def create(self, request, *args, **kwargs):
        """
        Handle creation of Produce with associated images.
        """
        data = request.data
        images = request.FILES.getlist('images')  # Get multiple images
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            # Save the Produce object with `perform_create`
            self.perform_create(serializer)
            produce = serializer.instance

            # Save associated images
            for image in images:
                ProduceImage.objects.create(produce=produce, image=image)
            
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=201, headers=headers)
        
        return Response(serializer.errors, status=400)
    
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