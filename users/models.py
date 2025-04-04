
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import BaseUserManager

# class CustomUser(AbstractUser):

#     FARMER = 'farmer'
#     CUSTOMER = 'customer'
#     ROLE_CHOICES = [
#         (FARMER, 'Farmer'),
#         (CUSTOMER, 'Customer'),
#     ]
#     role = models.CharField(
#         max_length=10,
#         choices=ROLE_CHOICES,
#         default=FARMER,  # Default role is Farmer
#     )
#     full_name = models.CharField(max_length= 150, default= 'Tg', blank=True)
#     phone_number_validator = RegexValidator(
#         regex=r'^\+?\d{10,15}$',  # Allow numbers with or without a leading "+"
#         message="Phone number must be 10-15 digits, optionally prefixed with '+'."
#     )

#     phone_number = models.CharField(
#         max_length=15,
#         validators=[phone_number_validator],
#         help_text="Enter phone number with or without country code. Defaults to +234 if none provided."
#     )
    
#     is_active = models.BooleanField(default=False) 

#     def save(self, *args, **kwargs):
#         # Automatically add the Nigerian country code if no country code is provided
#         if not self.phone_number.startswith('+'):
#             self.phone_number = f'+234{self.phone_number.lstrip("0")}'  # Remove leading 0 if present
#         super().save(*args, **kwargs)

    
#     def __str__(self):
#         return self.full_name

class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("The Phone Number field must be set")
        extra_fields.setdefault('is_active', True)
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(phone_number, password, **extra_fields)

class CustomUser(AbstractUser):
    FARMER = 'farmer'
    CUSTOMER = 'customer'
    ROLE_CHOICES = [
        (FARMER, 'Farmer'),
        (CUSTOMER, 'Customer'),
    ]
    username = None  # Remove username field
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=FARMER)
    full_name = models.CharField(max_length=150, default='Tg', blank=True)
    phone_number_validator = RegexValidator(
        regex=r'^\+?\d{10,15}$',
        message="Phone number must be 10-15 digits, optionally prefixed with '+'."
    )
    phone_number = models.CharField(
        max_length=15,
        unique=True,  # Ensure phone numbers are unique
        validators=[phone_number_validator]
    )
    is_active = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'  # Set phone_number as the unique identifier
    REQUIRED_FIELDS = ['full_name', 'role']  # Fields required for superuser creation

    def __str__(self):
        return self.full_name
