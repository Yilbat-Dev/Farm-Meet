from django.shortcuts import render
from rest_framework import generics, permissions, viewsets
from .models import Order
from .serializers import OrderSerializer
from .permissions import IsOrderOwnerOrReadOnly


# Create your views here.


class OrderViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides CRUD actions for orders.
    - Only customers can create orders.
    - Only the customer who created an order can update it.
    - Deletion is not allowed.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrderOwnerOrReadOnly]

    def perform_create(self, serializer):
        # Automatically associate the logged-in customer profile with the new order
        serializer.save(customer=self.request.user.customer_profile)




    def perform_update(self, serializer):
        """
        Ensure only the owner of the produce (farmer) can update it.
        """
        user = self.request.user
        if self.get_object().farmer_profile.user != user:
            raise PermissionDenied("You do not have permission to edit this produce.")
        serializer.save()