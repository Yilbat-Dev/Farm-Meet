from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import africastalking
from .models import OrderItem, Notification

# Initialize Africa's Talking
africastalking.initialize(
    settings.AFRICASTALKING_USERNAME,
    settings.AFRICASTALKING_API_KEY
)
sms = africastalking.SMS

@shared_task
def check_due_orders():
    """
    Check for orders due today and send notifications to farmers
    via dashboard message and SMS
    """
    today = timezone.now().date()
    due_items = OrderItem.objects.filter(
        delivery_date=today,
        delivery_status=OrderItem.PENDING
    ).select_related('farmer', 'produce', 'order')

    for item in due_items:
        # Prepare notification message
        message = (
            f"Hello {item.farmer.full_name},\n\n"
            f"Your order for {item.quantity} units of {item.produce.name} "
            f"is due today. Order #{item.order.id} needs to be delivered to "
            f"customer {item.order.customer.full_name}."
        )

        try:
            # Send SMS notification
            response = sms.send(
                message,
                [item.farmer.phone_number],  # Assuming farmer has a phone_number field
                callback=on_finish
            )
            print(f"SMS notification sent: {response}")

        except Exception as e:
            print(f"Failed to send SMS: {str(e)}")

        try:
            # Send email notification
            send_mail(
                subject=f"Reminder: Order #{item.order.id} Due Today",
                message=message,
                from_email='noreply@farmersapp.com',
                recipient_list=[item.farmer.email],
                fail_silently=False,
            )
            print(f"Email sent to {item.farmer.email}")

        except Exception as e:
            print(f"Failed to send email: {str(e)}")

        try:
            # Create dashboard notification
            # Assuming you have a Notification model
            if not Notification.objects.filter(related_order=item.order, type='order_due').exists():
                Notification.objects.create(
                    title=f"Order #{item.id} Due Today",
                    message=message,
                    type='order_due',
                    related_order=item.order
                )
                print(f"✅ Dashboard notification created for user {item.farmer.full_name}")
            else:
                print(f"⚠️ Notification already exists for Order #{item.order.id}")
            

        except Exception as e:
            print(f"Failed to create dashboard notification: {str(e)}")

def on_finish(error, response):
    """
    Callback function for SMS sending
    """
    if error is not None:
        print(f"SMS sending failed: {error}")
    else:
        print(f"SMS sent successfully: {response}")

# Add another task for checking overdue orders
@shared_task
def check_overdue_orders():
    """
    Check for overdue orders and send notifications
    """
    today = timezone.now().date()
    overdue_items = OrderItem.objects.filter(
        delivery_date__lt=today,
        delivery_status=OrderItem.PENDING
    ).select_related('farmer', 'produce', 'order')

    for item in overdue_items:
        days_overdue = (today - item.delivery_date).days
        message = (
            f"URGENT: Hello {item.farmer.full_name},\n\n"
            f"Your order #{item.id} for {item.quantity} units of "
            f"{item.produce.name} is {days_overdue} days overdue. "
            f"Please deliver immediately or contact support if you need assistance."
        )

        # Send notifications using the same methods as above
        try:
            response = sms.send(
                message,
                [item.farmer.phone_number],
                callback=on_finish
            )
            print(f"Overdue SMS notification sent: {response}")
        except Exception as e:
            print(f"Failed to send overdue SMS: {str(e)}")

        try:
            send_mail(
                subject=f"URGENT: Order #{item.order.id} is {days_overdue} Days Overdue",
                message=message,
                from_email='noreply@farmersapp.com',
                recipient_list=[item.farmer.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send overdue email: {str(e)}")

        try:
            Notification.objects.create(
                title=f"URGENT: Order #{item.id} Overdue",
                message=message,
                type='order_overdue',
                related_order=item.order
            )
        except Exception as e:
            print(f"Failed to create overdue dashboard notification: {str(e)}")



#send notification

@shared_task
def send_order_creation_notifications(order_item_id):
    """
    Send notifications to farmer when a new order item is created
    """
    try:
        item = OrderItem.objects.select_related(
            'farmer', 
            'produce', 
            'order',
            'order__customer' 
        ).get(id=order_item_id)

        message = (
            f"New Order Received!\n\n"
            f"Order Details:\n"
            f"- Order ID: #{item.order.id}\n"
            f"- Product: {item.produce.name}\n"
            f"- Quantity: {item.quantity} units\n"
            f"- Delivery Date: {item.delivery_date}\n"
            f"- Customer: {item.order.customer.full_name}\n\n"
            f"Please prepare the order for delivery on the scheduled date."
        )

        # Send SMS notification
        try:
            response = sms.send(
                message,
                [item.farmer.phone_number],
                callback=on_finish
            )
            print(f"New order SMS notification sent: {response}")
        except Exception as e:
            print(f"Failed to send new order SMS: {str(e)}")

        # Send email notification
        try:
            send_mail(
                subject=f"New Order Received - #{item.order.id}",
                message=message,
                from_email='noreply@farmersapp.com',
                recipient_list=[item.farmer.email],
                fail_silently=False,
            )
            print(f"New order email sent to {item.farmer.email}")
        except Exception as e:
            print(f"Failed to send new order email: {str(e)}")

        # Create dashboard notification
        try:
            # Create dashboard notification
            # Assuming you have a Notification model
            notification = Notification.objects.create(
                    title=f"Order #{item.id} Created Today",
                    message = message,
                    type='order_created',
                    related_order=item
                )
            try:
                notification.save()
                print("Notification saved successfully!")
            except Exception as e:
                print(f"Error saving notification: {e}") 
            print(f"✅ Dashboard notification message {notification.message} for Farmer {item.farmer.full_name}")
            
            
        except Exception as e:
            print(f"Failed to create new order dashboard notification: {str(e)}")

    except OrderItem.DoesNotExist:
        print(f"OrderItem {order_item_id} not found")
    except Exception as e:
        print(f"Error processing new order notifications: {str(e)}")