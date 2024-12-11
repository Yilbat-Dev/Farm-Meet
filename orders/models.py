from django.db import models
from customer.models import CustomerProfile
from farmer.models import FarmProduce, FarmerProfile
from django.core.exceptions import ValidationError
from django.utils.timezone import now  # Import now
from datetime import timedelta  # Import timedelta for date manipulation
from decimal import Decimal

class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    DELIVERY_OPTIONS = [
        ('pickup', 'Pickup'),
        ('door_to_door', 'Door to Door Delivery'),
    ]
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name="orders")
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name="orders")
    produce = models.ManyToManyField(FarmProduce, through='OrderItem')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_option = models.CharField(max_length=20, choices=DELIVERY_OPTIONS)
    delivery_address = models.TextField()
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('successful', 'Successful'), ('failed', 'Failed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(default=now().date() + timedelta(days=7))  # Default due in 7 days
    
    def delete(self, *args, **kwargs):
        raise ValidationError("Deleting orders is not allowed.")

    def process_payment(self):
        """Add payment to farmer's wallet when order is placed."""
        farmer_wallet = self.farmer.wallet
        farmer_wallet.add_payment(self.delivery_amount, self.payment_reference)

    def mark_as_delivered(self):
        """Transfer payment to usable wallet upon delivery confirmation."""
        if not self.is_delivered:
            self.is_delivered = True
            self.save()
            farmer_wallet = self.farmer.wallet
            farmer_wallet.transfer_to_usable()

    def calculate_subtotal(self):
        self.subtotal = sum(item.total_price for item in self.items.all())
        self.save()

    def calculate_total(self):
        self.total_amount = self.subtotal + self.delivery_amount + self.service_fee
        self.save()

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    produce = models.ForeignKey(FarmProduce, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)


class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    transaction_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[('successful', 'Successful'), ('failed', 'Failed')])

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.status}"
