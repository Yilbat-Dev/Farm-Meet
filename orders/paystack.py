# import requests
# from django.conf import settings

# class Paystack:
#     PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET_KEY
#     PAYSTACK_BASE_URL = "https://api.paystack.co"

#     @classmethod
#     def initialize_payment(cls, email, amount):
#         headers = {
#             "Authorization": f"Bearer {cls.PAYSTACK_SECRET_KEY}",
#             "Content-Type": "application/json",
#         }
#         data = {
#             "email": email,
#             "amount": int(amount * 100),  # Convert to kobo
#         }
#         url = f"{cls.PAYSTACK_BASE_URL}/transaction/initialize"
#         response = requests.post(url, json=data, headers=headers)
#         return response.json()

#     @classmethod
#     def verify_payment(cls, reference):
#         headers = {
#             "Authorization": f"Bearer {cls.PAYSTACK_SECRET_KEY}",
#         }
#         url = f"{cls.PAYSTACK_BASE_URL}/transaction/verify/{reference}"
#         response = requests.get(url, headers=headers)
#         return response.json()
