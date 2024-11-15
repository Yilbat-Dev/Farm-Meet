from django.db import models
from farmer.models import FarmProduce
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class Order(models.Model):
    DELIVERY_CHOICES = [
        ('pickup', 'Pick-Up'),
        ('doorstep', 'Door-Step'),
    ]
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    produce = models.ForeignKey(FarmProduce, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    delivery_type = models.CharField(max_length=10, choices=DELIVERY_CHOICES)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
