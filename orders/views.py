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
    Handles order placement and delivery confirmation, including handling OrderItems.
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

    def perform_create(self, serializer):
        """
        Create an order and its associated order items.
        """
        user = self.request.user
        customer_profile = user.customer_profile

        # Extract order item data from request
        order_items_data = self.request.data.get('order_items', [])
        if not order_items_data:
            raise serializers.ValidationError("Order items are required.")

        # Save the order
        with transaction.atomic():
            order = serializer.save(customer=customer_profile)

            # Validate and save each order item
            for item_data in order_items_data:
                produce_id = item_data.get('produce_id')
                quantity = item_data.get('quantity')

                if not produce_id or not quantity:
                    raise serializers.ValidationError("Each order item must include 'produce_id' and 'quantity'.")

                produce = get_object_or_404(FarmProduce, id=produce_id)

                OrderItem.objects.create(
                    order=order,
                    produce=produce,
                    quantity=quantity,
                    price=produce.price * quantity
                )

            # Update order total
            total_amount = order.items.aggregate(total=Sum('price'))['total'] or 0
            order.total_amount = total_amount
            order.save()

    @action(detail=True, methods=['post'], url_path='confirm-delivery')
    def confirm_delivery(self, request, pk=None):
        """
        Mark an order as delivered and transfer funds to the farmer's usable wallet.
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
            {"message": "Order marked as delivered, funds transferred to the farmer's usable wallet."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], url_path='process-payment')
    def process_payment(self, request, pk=None):
        """
        Process payment for an order.
        """
        order = get_object_or_404(Order, pk=pk)

        # Ensure the order's total amount is valid
        if not order.total_amount:
            return Response(
                {"error": "Order total is not set. Please ensure the order is valid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent reprocessing of already successful payments
        if order.payment_status == 'successful':
            return Response(
                {"error": "Payment has already been processed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure payment reference is provided
        payment_reference = request.data.get("payment_reference")
        if not payment_reference:
            return Response(
                {"error": "Payment reference is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Update payment status and add payment reference
                order.payment_reference = payment_reference
                order.payment_status = "successful"
                order.save()

                # Call order's payment processing logic
                order.process_payment()
                return Response(
                    {"message": "Payment processed successfully."},
                    status=status.HTTP_200_OK
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
