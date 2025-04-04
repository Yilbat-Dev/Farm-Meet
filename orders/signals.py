from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OrderItem
from farmer.models import FarmerProfile
import africastalking
from django.conf import settings
from wallet.models import Wallet
from .models import OrderItem, Notification, Order
from .tasks import send_order_creation_notifications
from celery import shared_task

# Initialize Africa's Talking
africastalking.initialize(
    settings.AFRICASTALKING_USERNAME, settings.AFRICASTALKING_API_KEY)
sms = africastalking.SMS


@receiver(post_save, sender=FarmerProfile)
def create_wallet_for_farmer(sender, instance, created, **kwargs):
    """
    Automatically creates a wallet for the farmer when their profile is created.
    """
    if created:  # Only create the wallet if the farmer profile is newly created
        Wallet.objects.create(farmer=instance)
        print(f"Wallet created for Farmer {instance.full_name}.")

# Notify farmers when an order is created


@receiver(post_save, sender=OrderItem)
def notify_farmers_on_order(sender, instance, created, **kwargs):
    """
    Sends SMS notifications to farmers for each OrderItem created.
    """
    if created:
        produce = instance.produce  # Access the produce for the OrderItem
        farmer = instance.farmer  # Get the farmer associated with the produce
        farmer_phone = farmer.phone_number  # Farmer's phone number

        if farmer_phone:
            # Prepare the SMS message
            message = (
                f"Hello {farmer.full_name}, you have received a new order for your produce "
                f"({produce.name}). Order ID: {instance.id}. "
                f"Quantity: {instance.quantity}. Please check your dashboard for details."
            )
            try:
                # Send SMS
                response = sms.send(message, [farmer_phone])
                print(f"SMS sent to {farmer_phone}: {response}")
            except Exception as e:
                print(f"Failed to send SMS to {farmer_phone}: {e}")


# Update farmer wallet on payment
# @receiver(post_save, sender=OrderItem)
# def update_wallet_on_delivery(sender, instance, **kwargs):
#     """
#     Transfers funds from the pending balance to usable balance upon successful delivery.
#     """
#     farmer_profile = instance.farmer  # Get the farmer's profile
#     wallet = farmer_profile.farmer_wallet

#     try:
#         wallet = farmer_profile.farmer_wallet  # Access the farmer's wallet
#     except Wallet.DoesNotExist:
#         # If the wallet does not exist, create it (fallback mechanism)
#         wallet = Wallet.objects.create(farmer=farmer_profile)
#         print(f"Created missing wallet for Farmer {farmer_profile.full_name}.")

#     previous_pending = wallet.pending_balance
#     previous_usable = wallet.usable_balance

#     if instance.delivery_status == "completed" and instance.payment_status == 'successful':

#         # Perform the transfer

#         if instance.total <= wallet.pending_balance:
#             wallet.pending_balance -= instance.total
#             wallet.usable_balance += instance.total
#             wallet.save()

#         # Logging or notification for wallet update
#             print(
#                 f"Wallet updated: Farmer {instance.farmer.full_name}'s usable balance increased by {instance.total}. "
#                 f"Previous Usable Balance: {previous_usable}, New Usable Balance: {wallet.usable_balance}. "
#                 f"Previous Pending Balance: {previous_pending}, New Pending Balance: {wallet.pending_balance}."
#             )

#         # Optional: Send an SMS notification to the farmer
#             farmer_phone = instance.farmer.phone_number
#             if farmer_phone:
#                 message = (
#                     f"Hello {instance.farmer.full_name}, NGN {instance.total} has been transferred "
#                     f"from your pending balance to your usable balance for Order Item ID: {instance.id}. "
#                     f"Total Usable Balance: NGN {wallet.usable_balance}."
#                 )
#                 try:
#                     sms.send(message, [farmer_phone])
#                     print(f"SMS sent to {farmer_phone}: {message}")
#                 except Exception as e:
#                     print(f"Failed to send SMS to {farmer_phone}: {e}")
#             else:
#                 print(
#                     f"Insufficient funds in Farmer {farmer_profile.full_name}'s wallet for Order Item ID: {instance.id}.")

#     elif instance.payment_status == 'successful':
#         wallet.pending_balance += instance.total
#         wallet.save()

#         print(
#             f"Wallet updated: Farmer {instance.farmer.full_name}'s pending balance increased by {instance.total}. "
#             f"Previous Pending Balance: {previous_pending}, New Usable Balance: {wallet.pending_balance}. "

#         )

#         # Optional: Send an SMS notification to the farmer
#         farmer_phone = instance.farmer.phone_number
#         if farmer_phone:
#             message = (
#                 f"Hello {instance.farmer.full_name}, NGN {instance.total} has been transferred "
#                 f" to your pending balance for Order Item ID: {instance.id}. "
#                 f"Total Pending Balance: NGN {wallet.pending_balance}."
#             )
#             try:
#                 sms.send(message, [farmer_phone])
#                 print(f"SMS sent to {farmer_phone}: {message}")
#             except Exception as e:
#                 print(f"Failed to send SMS to {farmer_phone}: {e}")
#     else:
#         print(
#             f"Awating Payment to {farmer_profile.full_name}'s wallet for Order Item ID: {instance.id}.")


# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import OrderItem
# import africastalking
# from django.conf import settings

# # Initialize Africa's Talking
# africastalking.initialize(
#     settings.AFRICASTALKING_USERNAME, settings.AFRICASTALKING_API_KEY)
# sms = africastalking.SMS


# @receiver(post_save, sender=OrderItem)
# def notify_farmer_on_order(sender, instance, created, **kwargs):
#     if created:
#         farmers_notified = set()  # Avoid duplicate notifications for the same farmer

#         produce = instance.produce
#         # Adjusted to use `farmer_profile` as the ForeignKey
#         farmer = produce.farmer_profile
#         # Assuming `FarmerProfile` has a `phone_number` field
#         farmer_phone = farmer.phone_number

#         if farmer_phone and farmer_phone not in farmers_notified:
#             # Prepare the SMS message
#             message = (
#                 f"Hello {farmer.full_name}, you have received a new order for your produce. "
#                 f"Order ID: {instance.id}. Please check your dashboard for details."
#             )
#             try:
#                 # Send SMS
#                 response = sms.send(message, [farmer_phone])
#                 print(f"SMS sent to {farmer_phone}: {response}")
#                 farmers_notified.add(farmer_phone)
#             except Exception as e:
#                 print(f"Failed to send SMS to {farmer_phone}: {e}")


# #  Transfer funds to famrer wallet
# @receiver(post_save, sender=OrderItem)
# def update_wallet_on_payment(sender, instance, **kwargs):
#     if instance.payment_status == 'paid':
#         wallet = instance.farmer.wallet
#         wallet.pending_balance += instance.total
#         wallet.save()


# @receiver(post_save, sender=OrderItem)
# def update_wallet_on_delivery(sender, instance, **kwargs):
#     if instance.payment_status == 'delivered' and instance.payment_status == 'paid':
#         wallet = instance.farmer.wallet
#         wallet.transfer_to_usable()
#         wallet.save()




@receiver(post_save, sender=OrderItem)
def order_item_created(sender, instance, created, **kwargs):
    """
    Signal handler to send notifications when a new order item is created
    """
    if created:
        send_order_creation_notifications(instance.id)
        print("Notification sent to farmer")
    else:
        print(f"Notification not created and sent to farmer")

