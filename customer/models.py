from django.db import models
from django.conf import settings

class State(models.Model):
    name = models.CharField(max_length=100, unique=True)
    capital = models.CharField(max_length=100)  # Add a field for the capital

    def __str__(self):
        return self.name

class LGA(models.Model):
    name = models.CharField(max_length=100)
    state = models.ForeignKey(State, related_name='lgas', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.state.name})"


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_profile'
    )
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
