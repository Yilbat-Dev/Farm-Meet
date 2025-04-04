from django.db import models
from django.conf import settings
from django.core.validators import MinLengthValidator

class State(models.Model):
    name = models.CharField(max_length=50, unique=True, validators=[MinLengthValidator(2)])
    capital = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class LGA(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='lgas')
    name = models.CharField(max_length=100, validators=[MinLengthValidator(2)])

    class Meta:
        unique_together = ('state', 'name')
        verbose_name = 'Local Government Area'
        verbose_name_plural = 'Local Government Areas'

    def __str__(self):
        return f"{self.name} - {self.state.name}"


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_profile'
    )

    email = models.EmailField(max_length=255, default="mudnoethankgod@gmail.com")
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, related_name="customer_profiles")
    lga = models.ForeignKey(LGA, on_delete=models.SET_NULL, null=True, related_name="customer_profiles")
    address = models.TextField()
    @property
    def full_name(self):
        return self.user.full_name

    @property
    def phone_number(self):
        return self.user.phone_number


    def __str__(self):
        return f"{self.user.phone_number}"
    
    