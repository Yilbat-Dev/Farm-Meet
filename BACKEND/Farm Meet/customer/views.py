from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
import random

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'customer':
            return Order.objects.filter(customer=self.request.user)
        return Order.objects.none()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        order = self.get_object()
        payment_success = random.choice([True, False])  # Simulate payment

        if payment_success:
            order.is_paid = True
            order.save()
            return Response({'status': 'Payment successful'}, status=status.HTTP_200_OK)
        return Response({'status': 'Payment failed'}, status=status.HTTP_402_PAYMENT_REQUIRED)
