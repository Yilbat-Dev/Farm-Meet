from django.db import models
from farmer.models import FarmerProfile
from orders.models import OrderItem
from django.db.models import Sum
from django.core.validators import MinValueValidator
from decimal import Decimal


class Wallet(models.Model):
    farmer = models.OneToOneField(FarmerProfile, on_delete=models.CASCADE, related_name="farmer_wallet")
    pending_balance = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal(
        '0.00'), validators=[MinValueValidator(Decimal('0.00'))]) 
    usable_balance = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal(
        '0.00'), validators=[MinValueValidator(Decimal('0.00'))])

    def transfer_to_usable(self):
        """
        Transfers funds from pending_balance to usable_balance.
        """
        self.usable_balance += self.pending_balance
        self.pending_balance = 0.00
        self.save()
        
        
class Withdrawal(models.Model):
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=100)  # You can track the status of the withdrawal (e.g., 'success', 'failed', etc.)
    paystack_reference = models.CharField(max_length=255, blank=True, null=True)
    reason = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Withdrawal of {self.amount} by {self.farmer} on {self.date}"
