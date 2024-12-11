from django.shortcuts import render
from rest_framework import generics, permissions, viewsets
from .models import Order
from farmer.models import FarmerProfile, FarmProduce
from .serializers import OrderSerializer
from .permissions import IsOrderOwnerOrReadOnly
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404


# Create your views here.


class OrderViewSet(viewsets.ModelViewSet):
    """
    Handles order placement and delivery confirmation.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Ensure only the user who created the order can view it.
        """
        user = self.request.user
        if hasattr(user, 'customer_profile'):  # Customer
            return Order.objects.filter(customer=user.customer_profile)
        return Order.objects.none()

    def destroy(self, request, *args, **kwargs):
        """
        Disable deletion of orders.
        """
        return Response({"error": "Order deletion is not allowed."}, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
         """
        Disable update of orders.
        """
         return Response({"error": "Order update is not allowed."}, status=status.HTTP_403_FORBIDDEN)

    # @action(detail=False, methods=['post'], url_path='place-order')
    # def place_order(self, request):
    #     """
    #     Place an order for produce and handle payment.
    #     """
    #     customer = request.user.customer_profile
    #     farmer_profile = get_object_or_404(
    #         FarmerProfile, id=request.data.get('farmer_id'))
    #     produce = get_object_or_404(
    #         FarmProduce, id=request.data.get('produce_id'))
    #     amount = request.data.get('amount')

    #     # Create the order
    #     order = Order.objects.create(
    #         customer=customer,
    #         farmer_profile=farmer_profile,
    #         produce=produce,
    #         amount=amount
    #     )
    #     # Process payment
    #     order.process_payment()

    #     return Response(
    #         {"message": "Order placed successfully, payment added to farmer's wallet."},
    #         status=status.HTTP_201_CREATED
    #     )

    def perform_create(self, serializer):
        """Set the order's total amount and initialize payment status on creation."""
        order = serializer.save()
        order.total_amount = order.subtotal + order.delivery_amount + order.service_fee
        order.payment_status = "pending"  # Ensure initial payment status is pending
        order.save()

    @action(detail=True, methods=["POST"])
    def process_payment(self, request, pk=None):
        """Process payment for an order."""
        order = get_object_or_404(Order, pk=pk)
        
        # Ensure the order's total amount is valid
        if not order.total_amount:
            return Response({"error": "Order total is not set. Please ensure the order is valid."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Prevent reprocessing of already successful payments
        if order.payment_status == 'successful':
            return Response({"error": "Payment has already been processed."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Ensure payment reference is provided
        payment_reference = request.data.get("payment_reference")
        if not payment_reference:
            return Response({"error": "Payment reference is required."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Update payment status and add payment reference
                order.payment_reference = payment_reference
                order.payment_status = "successful"
                order.save()

                # Call order's payment processing logic
                order.process_payment()
                return Response({"message": "Payment processed successfully."}, 
                                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    @action(detail=True, methods=['post'], url_path='confirm-delivery')
    def confirm_delivery(self, request, pk=None):
        """
        Mark an order as delivered and transfer funds to farmer's usable wallet.
        """
        order = get_object_or_404(Order, pk=pk)

        if order.customer != request.user.customer_profile:
            return Response(
                {"error": "You do not have permission to confirm this delivery."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Mark order as delivered
        order.mark_as_delivered()

        return Response(
            {"message": "Order marked as delivered, funds transferred to farmer's usable wallet."},
            status=status.HTTP_200_OK
        )
