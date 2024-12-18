import requests
from django.conf import settings

class Flutterwave:
    BASE_URL = settings.FLW_BASE_URL
    SECRET_KEY = settings.FLW_SECRET_KEY

    @staticmethod
    def initiate_payment(order, redirect_url):
        """Initiate a payment request with Flutterwave."""
        url = f"{Flutterwave.BASE_URL}/payments"
        headers = {
            "Authorization": f"Bearer {Flutterwave.SECRET_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "tx_ref": f"order-{order.id}",  # Unique transaction reference
            "amount": str(order.total_amount),
            "currency": "NGN",
            "redirect_url": redirect_url,  # URL to redirect after payment
            "customer": {
                "email": "placeholder@example.com",  # Use a placeholder email
                "phonenumber": order.customer.user.phone_number,
                "name": order.customer.full_name
            },
            "customizations": {
                "title": "Farm-Meet Payment",
                "description": f"Payment for Order {order.id}"
            }
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": str(e)}
