from django.db import models
from farmer.models import FarmerProfile

class Wallet(models.Model):
    farmer = models.OneToOneField(FarmerProfile, on_delete=models.CASCADE, related_name="wallet")
    pending_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) 
    usable_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def transfer_to_usable(self):
        self.usable_balance += self.pending_balance
        self.pending_balance = 0.00
        self.save()
