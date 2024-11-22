
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class CustomUser(AbstractUser):

    FARMER = 'farmer'
    CUSTOMER = 'customer'
    ROLE_CHOICES = [
        (FARMER, 'Farmer'),
        (CUSTOMER, 'Customer'),
    ]
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=FARMER,  # Default role is Farmer
    )
    phone_number_validator = RegexValidator(
        regex=r'^\+?\d{10,15}$',  # Allow numbers with or without a leading "+"
        message="Phone number must be 10-15 digits, optionally prefixed with '+'."
    )

    phone_number = models.CharField(
        max_length=15,
        validators=[phone_number_validator],
        help_text="Enter phone number with or without country code. Defaults to +234 if none provided."
    )

    def save(self, *args, **kwargs):
        # Automatically add the Nigerian country code if no country code is provided
        if not self.phone_number.startswith('+'):
            self.phone_number = f'+234{self.phone_number.lstrip("0")}'  # Remove leading 0 if present
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
