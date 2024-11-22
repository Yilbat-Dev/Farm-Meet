
from django.db import models
from django.conf import settings
from multiselectfield import MultiSelectField


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
        ('produce', 'Produce'),
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

    def __str__(self):
        return f"{self.farm_name} ({self.user.get_full_name()})"

    @property
    def full_name(self):
        return self.user.get_full_name()

    @property
    def phone_number(self):
        return self.user.phone_number


class FarmProduce(models.Model):
    farmer_profile = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='media/produce/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name