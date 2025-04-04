from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, viewsets
from rest_framework import serializers
from .models import Order, OrderItem, Notification
from farmer.models import FarmerProfile, FarmProduce
from wallet.models import Wallet
from .serializers import OrderSerializer, OrderItemSerializer, NotificationSerializer
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import transaction
from django.db.models import Sum
from rest_framework import status
from django.urls import reverse
from functools import wraps
from django.conf import settings
import requests
import logging
logger = logging.getLogger(__name__)
from datetime import timedelta
from django.utils.timezone import now
from rest_framework.permissions import IsAuthenticated
from django.db.models import F, Sum


# Create your views here.


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
            """Return order items for the logged-in farmer within a specific time range."""
            user = self.request.user  # Get the authenticated user

            if not hasattr(user, 'farmer_profile'):
                return OrderItem.objects.none()  # Return an empty queryset

            farmer = user.farmer_profile  # Use related_name instead of farmer__user

            # Get time ranges
            past_7_days = now().date() - timedelta(days=7)
            past_30_days = now().date() - timedelta(days=30)
            past_6_months = now().date() - timedelta(days=180)

            # Check for query parameters to filter by time range
            time_filter = self.request.query_params.get('time_range', None)

            # Filter by order created_at date
            if time_filter == '7_days':
                return OrderItem.objects.filter(
                    farmer=farmer,
                    order__created_at__gte=past_7_days,
                    order__payment_status='verified',
                ).exclude(
            delivery_status=OrderItem.COMPLETED
        )

                
            elif time_filter == '30_days':
                return OrderItem.objects.filter(
                    farmer=farmer,
                     order__payment_status='verified',
                    order__created_at__gte=past_30_days
                ).exclude(
            delivery_status=OrderItem.COMPLETED
        )

                
            elif time_filter == '6_months':
                return OrderItem.objects.filter(
                    farmer=farmer,
                    order__payment_status='verified',
                    order__created_at__gte=past_6_months
                ).exclude(
            delivery_status=OrderItem.COMPLETED
        )

                
            else:
                return OrderItem.objects.filter(farmer=farmer).exclude(
            delivery_status=OrderItem.COMPLETED
        )


    def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()

            if not queryset.exists():
                return Response(
                    {"message": "No due orders in the specified time range."},
                    status=status.HTTP_200_OK
                )

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

    def calculate_percentage_change(self, farmer, start_date, end_date):
        """Helper function to calculate percentage change based on order count."""
        current_count = OrderItem.objects.filter(
            farmer=farmer,
            order__payment_status='verified',
            order__created_at__gte=start_date
        ).count()

        orders_last_7_days = OrderItem.objects.filter(
            farmer=farmer,
            order__payment_status='verified',
            order__created_at__gte=start_date
        )

    

        previous_count = OrderItem.objects.filter(
            farmer=farmer,
            order__created_at__lt=start_date,
            order__created_at__gte=end_date
        ).count()

        if previous_count > 0:
            percentage_change = ((current_count - previous_count) / previous_count) * 100
        else:
            percentage_change = 100 if current_count > 0 else 0

        # Determine change indicator
        if percentage_change > 0:
            change_indicator = "increase"
        elif percentage_change == 0:
            change_indicator = "No change"
        else:
            change_indicator = "decrease"

        return {
            "Total Number of Orders": current_count,
            "percentage_change": f"{percentage_change:.2f}%",
            "change_indicator": change_indicator,
        }
    @action(detail=False, methods=['get'], url_path='percentage-change-1-day')
    def percentage_change_1_day(self, request, *args, **kwargs):
        """Return the percentage change in order items count over the last 24 hours."""
        user = request.user

        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)

        farmer = user.farmer_profile
        now_time = now()
        past_24_hours = now_time - timedelta(days=1)
        past_48_hours = now_time - timedelta(days=2)

        data = self.calculate_percentage_change(farmer, past_24_hours, past_48_hours)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='percentage-change-7-days')
    def percentage_change_7_days(self, request, *args, **kwargs):
        """Return the percentage change in order items count over the last 7 days."""
        user = request.user

        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)

        farmer = user.farmer_profile
        today = now().date()
        past_7_days = today - timedelta(days=7)
        past_14_days = today - timedelta(days=14)

        data = self.calculate_percentage_change(farmer, past_7_days, past_14_days)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='percentage-change-30-days')
    def percentage_change_30_days(self, request, *args, **kwargs):
        """Return the percentage change in order items count over the last 30 days."""
        user = request.user

        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)

        farmer = user.farmer_profile
        today = now().date()
        past_30_days = today - timedelta(days=30)
        past_60_days = today - timedelta(days=60)

        data = self.calculate_percentage_change(farmer, past_30_days, past_60_days)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='percentage-change-6-months')
    def percentage_change_6_months(self, request, *args, **kwargs):
        """Return the percentage change in order items count over the last 6 months."""
        user = request.user

        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)

        farmer = user.farmer_profile
        today = now().date()
        past_6_months = today - timedelta(days=180)
        past_12_months = today - timedelta(days=365)

        data = self.calculate_percentage_change(farmer, past_6_months, past_12_months)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='completed-deliveries')
    def completed_deliveries(self, request, *args, **kwargs):
            """Return order items where delivery status is completed."""
            user = self.request.user  # Get the logged-in user
            if hasattr(user, 'farmer_profile'):
                farmer_profile = user.farmer_profile
            else:
                return Response(
                    {"message": "User has no Farmer Profile."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            farmer_profile = user.farmer_profile  # Get the associated farmer profile

            # Filter order items where delivery_status is 'completed'
            completed_items = OrderItem.objects.filter(
                farmer=farmer_profile,
                delivery_status=OrderItem.COMPLETED
            )

            # Serialize and return the completed items
            serializer = self.get_serializer(completed_items, many=True)
            return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='due-today')
    def due_today(self, request, *args, **kwargs):
        """Return order items due for delivery today, excluding completed orders."""
        user = self.request.user  # Get the logged-in user
        if hasattr(user, 'farmer_profile'):
            farmer_profile = user.farmer_profile
        else:
            return Response(
                {"message": "User has no Farmer Profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
        farmer_profile = user.farmer_profile  # Get the associated farmer profile

        # Get today's date
        today = now().date()

        # Filter order items where:
        # - delivery_date is today
        # - delivery_status is not 'completed'
        due_today_items = OrderItem.objects.filter(
            farmer=farmer_profile, 
            order__payment_status='verified',
            delivery_date=today
        ).exclude(
            delivery_status=OrderItem.COMPLETED
        )

        # Check if there are no due items today
        if not due_today_items.exists():
            # If no orders are due today, return a custom message
            return Response(
                {"message": "No due orders today."},
                status=status.HTTP_200_OK
            )

        # If there are due items, return them as usual
        serializer = self.get_serializer(due_today_items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='confirm-delivery')
    def confirm_delivery(self, request, pk=None):
        """
        Mark an order item as delivered and transfer funds to the farmer's usable wallet.
        """
        order_item = self.get_object()

        # Check if the user is the customer who placed the order
        if order_item.order.customer != request.user.customer_profile:
            return Response(
                {"error": "You do not have permission to confirm this delivery."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if the order payment is verified'
        if order_item.payment_status != 'verified':
            return Response(
                {"error": "Cannot confirm delivery for unpaid order."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the order item is already completed
        if order_item.delivery_status == OrderItem.COMPLETED:
            return Response(
                {"error": "This delivery has already been confirmed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Update the delivery status
            with transaction.atomic():
                order_item.delivery_status = OrderItem.COMPLETED
                order_item.save()
                logger.info(f"Delivery confirmed for order item {order_item.id}")

                return Response(
                    {
                        "message": "Delivery confirmed verified'ly.",
                        "order_item": {
                            "id": order_item.id,
                            "produce": order_item.produce.name,
                            "quantity": order_item.quantity,
                            "total": float(order_item.total),
                            "delivery_status": order_item.delivery_status
                        }
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            logger.error(f"Failed to confirm delivery for order item {order_item.id}: {str(e)}")
        return Response(
            {"error": f"Failed to confirm delivery: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    def calculate_percentage_change_amount(self, farmer, start_date, end_date):
        """Helper function to calculate percentage change based on total sales amount."""


        current_total = OrderItem.objects.filter(
            farmer=farmer,
            order__payment_status='verified',
            order__created_at__gte=start_date
        ).aggregate(total=Sum(F('produce__price') * F('quantity')))['total'] or 0

        previous_total = OrderItem.objects.filter(
            farmer=farmer,
            order__payment_status='verified',
            order__created_at__lt=start_date,
            order__created_at__gte=end_date
        ).aggregate(total=Sum(F('produce__price') * F('quantity')))['total'] or 0

        if previous_total > 0:
            percentage_change = ((current_total - previous_total) / previous_total) * 100
        else:
            percentage_change = 100 if current_total > 0 else 0

        # Determine change indicator
        if percentage_change > 0:
            change_indicator = "increase"
        elif percentage_change == 0:
            change_indicator = "No change"
        else:
            change_indicator = "decrease"

        return {
            "total_amount": current_total,
            "percentage_change": f"{percentage_change:.2f}%",
            "change_indicator": change_indicator,
        }

    @action(detail=False, methods=['get'], url_path='percentage-change-amount-24-hours')
    def percentage_change_amount_24_hours(self, request, *args, **kwargs):
        """Return the percentage change in total amount over the last 24 hours."""
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        now_time = now()
        past_24_hours = now_time - timedelta(hours=24)
        past_48_hours = now_time - timedelta(hours=48)

        data = self.calculate_percentage_change_amount(farmer, past_24_hours, past_48_hours)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='percentage-change-amount-7-days')
    def percentage_change_amount_7_days(self, request, *args, **kwargs):
        """Return the percentage change in total amount over the last 7 days."""
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        today = now().date()
        past_7_days = today - timedelta(days=7)
        past_14_days = today - timedelta(days=14)

        data = self.calculate_percentage_change_amount(farmer, past_7_days, past_14_days)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='percentage-change-amount-30-days')
    def percentage_change_amount_30_days(self, request, *args, **kwargs):
        """Return the percentage change in total amount over the last 30 days."""
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        today = now().date()
        past_30_days = today - timedelta(days=30)
        past_60_days = today - timedelta(days=60)

        data = self.calculate_percentage_change_amount(farmer, past_30_days, past_60_days)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='percentage-change-amount-6-months')
    def percentage_change_amount_6_months(self, request, *args, **kwargs):
        """Return the percentage change in total amount over the last 6 months."""
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        today = now().date()
        past_6_months = today - timedelta(days=180)
        past_12_months = today - timedelta(days=365)

        data = self.calculate_percentage_change_amount(farmer, past_6_months, past_12_months)
        return Response(data)



class OrderViewSet(viewsets.ModelViewSet):
    """
    Handles order placement and delivery confirmation, including handling OrderItems.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

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

    def get_object(self):
        return get_object_or_404(Order, id=self.kwargs.get('pk'))

    """
    paystack payment
    """
    @action(detail=True, methods=['post'], url_path='initiate-payment')
    def initiate_payment(self, request, pk=None):
        """
        Initiates payment using Paystack.
        """
        order = self.get_object()

        # Check if payment is already completed
        if order.payment_status == 'completed':
            return Response(
                {"error": "Payment already completed for this order."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate grand_total
        if order.grand_total <= 0:
            return Response(
                {"error": f"Invalid order total. Grand total must be greater than 0. it is {order.grand_total}"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare Paystack payload
        payload = {
            "email": "thankgodmudnoe@gmail.com",  # Use the user's email
            "amount": int(order.grand_total * 100),  # Convert to kobo
            # Unique reference for this payment
            "reference": f"order-{order.id}",
            "callback_url": request.build_absolute_uri('/order/verify-payment/'),
        }

        print(f"Payload sent to Paystack: {payload}")

        # Send request to Paystack
        url = "https://api.paystack.co/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(
                url, data=json.dumps(payload), headers=headers)
            response_data = response.json()

            if response.status_code == 200 and response_data.get('status') == True:
                payment_url = response_data['data']['authorization_url']
                return Response({"payment_url": payment_url}, status=status.HTTP_200_OK)

            # Log the error response from Paystack
            print(f"Paystack Error: {response_data}")
            return Response(
                {"error": response_data.get(
                    'message', 'Payment initialization failed.')},
                status=status.HTTP_400_BAD_REQUEST
            )

        except requests.RequestException as e:
            print(f"Request Exception: {e}")
            return Response({"error": "Failed to connect to Paystack."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request):
        """
        Verifies payment via Paystack.
        """
        reference = request.data.get('reference')
        if not reference:
            return Response({"error": "Payment reference is required."}, status=status.HTTP_400_BAD_REQUEST)

        url = f"https://api.paystack.co/transaction/verify/{reference}"
        headers = {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"}

        try:
            response = requests.get(url, headers=headers)
            response_data = response.json()

            if response.status_code == 200 and response_data.get('status') is True:
                data = response_data['data']
                # Extract order ID from reference
                try:
                    order_id = int(data['reference'].split('-')[-1])
                    order = get_object_or_404(Order, id=order_id)
                    if order.payment_status == 'verified':
                        return Response({"error": "Payment has already been verified for this order."}, status=status.HTTP_400_BAD_REQUEST)
                except ValueError:
                    return Response({"error": "Invalid order reference format."}, status=status.HTTP_400_BAD_REQUEST)

                if data['status'] == 'success':
                    with transaction.atomic():
                        order.payment_status = 'verified'
                        order.payment_reference = data['reference']
                        order.save()

                        order_items = order.items.all()
                        print(
                            f"Processing Order {order.id}, Items Count: {len(order_items)}")

                        for item_data in order_items:
                            farmer = item_data.farmer

                            # Ensure wallet exists
                            wallet, created = Wallet.objects.get_or_create(
                                farmer=farmer)

                            previous_pending = wallet.pending_balance
                            previous_usable = wallet.usable_balance

                            wallet.pending_balance += item_data.total
                            wallet.save(update_fields=['pending_balance'])
                            print(
                                f"Pending Balance Increased - New Pending: {wallet.pending_balance}")

                            print(
                                f"Updating wallet for Farmer {farmer.full_name} | Current Pending: {previous_pending}, Usable: {previous_usable}")

                            if item_data.delivery_status.lower() == "completed":
                                if item_data.total <= wallet.pending_balance:
                                    wallet.pending_balance -= item_data.total
                                    wallet.usable_balance += item_data.total
                                    wallet.save(update_fields=[
                                                'pending_balance', 'usable_balance'])
                                    print(
                                        f"Transfer Success - Previous Balance Previous Pending: {previous_pending}New Pending: {wallet.pending_balance}, Previous Usabale: {previous_usable} New Usable: {wallet.usable_balance}")
                                else:
                                    print(
                                        f"Insufficient Pending Balance for Transfer: Needed {item_data.total}, Available {wallet.pending_balance}")

                            wallet.refresh_from_db()
                            order.payment_status = 'verified'
                            order.save()

                    return Response({"message": "Payment verified successfully."}, status=status.HTTP_200_OK)

            return Response(
                {"error": response_data.get(
                    'message', 'Payment verification failed.')},
                status=status.HTTP_400_BAD_REQUEST
            )

        except requests.RequestException:
            return Response({"error": "Failed to connect to Paystack."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET', 'POST'], url_path='payment-callback')
    def payment_callback(self, request):
        """
        Handles payment callbacks from Paystack.
        """
        if request.method == 'POST':
            # Your existing POST handling code
            try:
                callback_data = json.loads(request.body)
                # ... rest of your POST handling code ...
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON data."}, status=400)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)

        elif request.method == 'GET':
            # Handle GET request
            reference = request.GET.get('reference')
            trxref = request.GET.get('trxref')

            if not reference:
                return Response({"error": "Payment reference is required."}, status=400)

            # Verify the payment
            url = f"https://api.paystack.co/transaction/verify/{reference}"
            headers = {
                "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            }

            try:
                response = requests.get(url, headers=headers)
                response_data = response.json()

                if response.status_code == 200 and response_data.get('status') == True:
                    data = response_data['data']
                    # Extract order ID from reference
                    order_id = int(reference.split('-')[-1])
                    order = get_object_or_404(Order, id=order_id)
                    if order.payment_status == 'verified':
                        return Response({"error": "Payment has already been verified for this order."}, status=400)

                    if data['status'] == 'success':
                        order.payment_status = 'verified'
                        order.payment_reference = reference
                        order.save()
                        order_items = order.items.all()
                        print(
                            f"Processing Order {order.id}, Items Count: {len(order_items)}")

                        for item_data in order_items:
                            farmer = item_data.farmer

                            # Ensure wallet exists
                            wallet, created = Wallet.objects.get_or_create(
                                farmer=farmer)

                            previous_pending = wallet.pending_balance
                            previous_usable = wallet.usable_balance

                            wallet.pending_balance += item_data.total
                            wallet.save(update_fields=['pending_balance'])
                            print(
                                f"Pending Balance Increased - New Pending: {wallet.pending_balance}")

                            print(
                                f"Updating wallet for Farmer {farmer.full_name} | Current Pending: {previous_pending}, Usable: {previous_usable}")

                            if item_data.delivery_status.lower() == "completed":
                                if item_data.total <= wallet.pending_balance:
                                    wallet.pending_balance -= item_data.total
                                    wallet.usable_balance += item_data.total
                                    wallet.save(update_fields=[
                                                'pending_balance', 'usable_balance'])
                                    print(
                                        f"Transfer Success - Previous Balance Previous Pending: {previous_pending}New Pending: {wallet.pending_balance}, Previous Usabale: {previous_usable} New Usable: {wallet.usable_balance}")
                                else:
                                    print(
                                        f"Insufficient Pending Balance for Transfer: Needed {item_data.total}, Available {wallet.pending_balance}")

                            wallet.refresh_from_db()
                            order.payment_status = 'verified'
                            order.save()
                        return Response({"message": "Payment verified successfully."}, status=200)

                return Response(
                    {"error": response_data.get(
                        'message', 'Payment verification failed.')},
                    status=400
                )

            except requests.RequestException as e:
                return Response({"error": "Failed to connect to Paystack."}, status=500)

        return Response({"error": "Invalid request method."}, status=400)

    # @action(detail=True, methods=['post'], url_path='confirm-delivery')
    # def confirm_delivery(self, request, pk=None):
    #     """
    #     Mark an order as delivered and transfer funds to the farmer's usable wallet.
    #     """
    #     order = get_object_or_404(Order, pk=pk)

    #     if order.customer != request.user.customer_profile:
    #         return Response(
    #             {"error": "You do not have permission to confirm this delivery."},
    #             status=status.HTTP_403_FORBIDDEN
    #         )

    #     # Mark order as delivered
    #     order.mark_as_delivered()

    #     return Response(
    #         {"message": "Order marked as delivered, funds transferred to the farmer's usable wallet."},
    #         status=status.HTTP_200_OK
    #     )


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        """Return notifications for the logged-in farmer"""
        user = self.request.user
        if hasattr(user, 'farmer_profile'):  # Ensure user has a farmer profile
            return Notification.objects.filter(related_order__farmer=user.farmer_profile)
        return Notification.objects.none()

    @action(detail=False, methods=['get'])
    def unread(self):
        """Get unread notifications"""
        notifications = self.get_queryset().filter(read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read for the current farmer"""
        user = self.request.user
        if hasattr(user, 'farmer_id'):
            Notification.objects.filter(
                farmer=user.farmer_id).update(read=True)
            return Response({'status': 'all notifications marked as read'})
        return Response({'error': 'User is not a farmer'}, status=status.HTTP_403_FORBIDDEN)
