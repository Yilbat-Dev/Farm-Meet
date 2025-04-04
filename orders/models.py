from django.db import models
from customer.models import CustomerProfile
from farmer.models import FarmProduce, FarmerProfile
from django.core.exceptions import ValidationError
from django.utils.timezone import now  # Import now
from datetime import timedelta  # Import timedelta for date manipulation
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.core.validators import MinValueValidator


def default_due_date():
    return now().date() + timedelta(days=7)


class Order(models.Model):

    PAYMENT_PENDING = 'pending'
    PAYMENT_SUCCESSFUL = 'successful'
    PAYMENT_FAILED = 'failed'
    PAYMENT_VERIFIED = 'verified'

    PAYMENT_STATUS = [
        (PAYMENT_PENDING, 'pending'),
        (PAYMENT_SUCCESSFUL, 'successful'),
        (PAYMENT_FAILED, 'failed'),
        (PAYMENT_VERIFIED, 'verified'),
    ]

    DELIVERY_OPTIONS = [('pickup', 'Pickup'),
                        ('door_to_door', 'Door to Door Delivery')]

    customer = models.ForeignKey(
        CustomerProfile, on_delete=models.CASCADE, related_name="orders")
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal(
        '0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal(
        '0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal(
        '0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal(
        '0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    delivery_option = models.CharField(
        max_length=20, choices=DELIVERY_OPTIONS, default='pickup')
    delivery_address = models.TextField(blank=True, null=True)
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS, default=PAYMENT_PENDING)
    transaction_reference = models.CharField(
        max_length=100, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def delivery_address(self):
        return self.customer.address if self.customer else None

    def delete(self, *args, **kwargs):
        raise ValidationError("Deleting orders is not allowed.")

    def calculate_grand_total(self):
        self.grand_total = self.total_amount + self.delivery_fee + self.service_fee
        self.save()

    def validate_payment(self):
        if not self.grand_total:
            raise ValueError("Order grand_total is not set.")
        if self.payment_status == 'successful':
            raise ValueError("Payment has already been processed.")


class OrderItem(models.Model):
    PENDING = 'pending'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

    ORDER_STATUS = [
        (PENDING, 'pending'),
        (COMPLETED, 'completed'),
        (CANCELLED, 'cancelled'),
    ]
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="items")
    produce = models.ForeignKey(
        FarmProduce, on_delete=models.CASCADE, related_name="produce_order")
    farmer = models.ForeignKey(
        FarmerProfile, on_delete=models.CASCADE, related_name='farmer_order')
    delivery_status = models.CharField(
        max_length=20, choices=ORDER_STATUS, default=PENDING)
    quantity = models.PositiveIntegerField()
    delivery_date = models.DateField(default=default_due_date)

    class Meta:
        ordering = ['delivery_date']

    @property
    def price(self):
        return self.produce.price

    @property
    def created_at(self):
        return self.order.created_at

    @property
    def total(self):
        return self.price * self.quantity

    @property
    def payment_status(self):
        return self.order.payment_status

   
    def __str__(self):
        return f"Order {self.id} for {self.produce.name}"


class Notification(models.Model):
    related_order = models.ForeignKey(
        OrderItem, on_delete=models.CASCADE, null=True, related_name="order_item_notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    # e.g., 'order_due', 'order_overdue'
    type = models.CharField(max_length=50)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
