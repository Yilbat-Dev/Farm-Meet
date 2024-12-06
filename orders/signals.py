from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
import africastalking
from django.conf import settings

# Initialize Africa's Talking
africastalking.initialize(settings.AFRICASTALKING_USERNAME, settings.AFRICASTALKING_API_KEY)
sms = africastalking.SMS

@receiver(post_save, sender=Order)
def notify_farmer_on_order(sender, instance, created, **kwargs):
    if created:
        farmers_notified = set()  # Avoid duplicate notifications for the same farmer

        for produce in instance.produce.all():
            farmer = produce.farmer_profile  # Adjusted to use `farmer_profile` as the ForeignKey
            farmer_phone = farmer.phone_number  # Assuming `FarmerProfile` has a `phone_number` field

            if farmer_phone and farmer_phone not in farmers_notified:
                # Prepare the SMS message
                message = (
                    f"Hello {farmer.user.username}, you have received a new order for your produce. "
                    f"Order ID: {instance.id}. Please check your dashboard for details."
                )
                try:
                    # Send SMS
                    response = sms.send(message, [farmer_phone])
                    print(f"SMS sent to {farmer_phone}: {response}")
                    farmers_notified.add(farmer_phone)
                except Exception as e:
                    print(f"Failed to send SMS to {farmer_phone}: {e}")
