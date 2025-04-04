from django.db import models
from django.conf import settings
from multiselectfield import MultiSelectField
from decimal import Decimal
from django.core.validators import MinValueValidator, MinLengthValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re
import uuid
from django.utils.timezone import now  # Import now
from datetime import timedelta  # Import timedelta for date manipulation
from django.shortcuts import get_object_or_404

class FarmerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='farmer_profile'
    )
    FARM_SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    ]

    FARM_CATEGORIES = [
        ('vegetable', 'Vegetable'),
        ('meat_and_seafood', 'Meat and Seafood'),
        ('root_and_tubers', 'Root and Tubers'),
        ('dairy_and_eggs', 'Dairy and Eggs'),
    ]

    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    farmer_image = models.ImageField(upload_to='media/', blank=True, null=True)
    farm_name = models.CharField(max_length=200, default="TG farms")
    description = models.TextField(blank= True, null= True)
    farm_category = MultiSelectField(max_length=50, choices=FARM_CATEGORIES, default=["vegetable"])
    farm_address = models.TextField(default="Unknown Location")
    email = models.EmailField(blank=True, null=True)  # Optional field
    farm_size = models.CharField(max_length=10, choices=FARM_SIZE_CHOICES, default="small")
    max_orders = models.PositiveIntegerField(default= 2)
    delivery_days = MultiSelectField(max_length=50, choices=DAYS_OF_WEEK,default=["monday"] )


    

    @property
    def full_name(self):
        return self.user.full_name

    @property
    def phone_number(self):
        return self.user.phone_number

    def __str__(self):
        return f"{self.farm_name} ({self.user.full_name})"


class FarmProduce(models.Model):
    PRODUCE_CATEGORIES = [
        ('vegetable', 'Vegetable'),
        ('meat_and_seafood', 'Meat and Seafood'),
        ('root_and_tubers', 'Root_and_Tubers'),
        ('dairy_and_eggs', 'Dairy and Eggs'),
    ]
    PRODUCE_STATUS = [
         ('available', 'Available'),
        ('out of stock', 'Out of Stock'),
        
     ]

    farmer_profile = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='farm_produce')
    name = models.CharField(max_length=255)
    description = models.TextField()
    produce_categories =models.CharField(max_length=50, choices=PRODUCE_CATEGORIES, default="vegetables")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal(
        '0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    pickup_location = models.TextField(blank=True, null=True)
    produce_status = models.CharField(max_length=50, choices=PRODUCE_STATUS, default="available")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class ProduceImage(models.Model):
    produce = models.ForeignKey(FarmProduce, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/produce/')



class BankAccount(models.Model):
    def validate_numeric(value):
        """Ensure the account number contains only digits."""
        if not re.fullmatch(r'^\d+$', value):  # Only allows digits (0-9)
            raise ValidationError(_('Input must contain only digits.'))

    farmer = models.ForeignKey("FarmerProfile", on_delete=models.CASCADE, related_name="bank_account")
    bank_name = models.CharField(max_length=255,  default="Zenith Test")
    account_name = models.CharField(max_length=150, default="thankgod")
    account_number = models.CharField(max_length=20, validators=[MinLengthValidator(10), validate_numeric], default="0000000000")
    bank_code = models.CharField(max_length=20, validators=[validate_numeric], default = "057")
    paystack_recipient_code = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bank_name} - {self.account_number}"



class WithdrawalRequest(models.Model):
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name="withdrawals")
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('1.00'))])
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("completed", "Completed"), ("failed", "Failed")],
        default="pending"
    )
    reference = models.CharField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def generate_reference(self):
        """Generates a unique Paystack transaction reference"""
        return f"WD-{uuid.uuid4().hex[:12].upper()}"

    def save(self, *args, **kwargs):
        """Ensure reference is generated before saving"""
        if not self.reference:
            self.reference = self.generate_reference()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.farmer.full_name} - {self.amount} - {self.status}"  # Paystack reference