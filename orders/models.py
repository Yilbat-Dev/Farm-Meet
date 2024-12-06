from django.db import models
from customer.models import CustomerProfile
from farmer.models import FarmProduce
from django.core.exceptions import ValidationError

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
    items = models.ManyToManyField(FarmProduce, through='OrderItem')
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

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    produce = models.ForeignKey(FarmProduce, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
