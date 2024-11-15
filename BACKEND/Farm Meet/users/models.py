
from django.contrib.auth.models import AbstractUser
from django.db import models

# class User(AbstractUser):
#     ROLE_CHOICES = [
#         ('farmer', 'Farmer'),
#         ('customer', 'Customer'),
#     ]
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES)
#     # phone_number = models.CharField(max_length=20)

#     # groups = models.ManyToManyField(
#     #     'auth.Group',
#     #     related_name='custom_user_set',  # Use a unique related_name
#     #     blank=True,
#     #     help_text='The groups this user belongs to.',
#     #     verbose_name='groups',
#     # )

#     # user_permissions = models.ManyToManyField(
#     #     'auth.Permission',
#     #     related_name='custom_user_permissions_set',  # Use a unique related_name
#     #     blank=True,
#     #     help_text='Specific permissions for this user.',
#     #     verbose_name='user permissions',
#     # )

# models.py


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return self.username
