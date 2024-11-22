# from django.db import models
# from django.conf import settings

# class CustomerProfile(models.Model):
#     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     address = models.TextField()
#     profile_picture = models.ImageField(upload_to='customers/profiles/', blank=True, null=True)

#     def __str__(self):
#         return self.user.username


# class Order(models.Model):
#     customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
#     produce = models.ForeignKey('farmer.Produce', on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField()
#     delivery_option = models.CharField(max_length=255)  # Delivery options
#     paid = models.BooleanField(default=False)
#     order_date = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Order {self.id} - {self.produce.name} by {self.customer.user.username}"