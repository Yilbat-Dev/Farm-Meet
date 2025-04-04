from django.test import TestCase
# Create your tests here.
from django.test import TestCase
from unittest.mock import patch
from .models import Order
from farmer.models import FarmerProfile, FarmProduce
from customer.models import CustomerProfile

class PaymentTestCase(TestCase):
    def setUp(self):
        # Create mock customer, farmer, produce, and order
        self.customer = CustomerProfile.objects.create(
            user=self.create_mock_user("customer@test.com"),
            full_name="Test Customer"
        )
        self.farmer = FarmerProfile.objects.create(
            user=self.create_mock_user("farmer@test.com"),
            full_name="Test Farmer"
        )
        self.order = Order.objects.create(
            customer=self.customer,
            farmer=self.farmer,
            subtotal=5000.00,
            delivery_amount=500.00,
            service_fee=100.00,
            total_amount=5600.00,
            delivery_option="pickup",
            delivery_address="123 Test Street"
        )

    def create_mock_user(self, email):
        from django.contrib.auth.models import User
        return User.objects.create(email=email, username=email)

    @patch('orders.services.requests.post')
    def test_initiate_payment(self, mock_post):
        mock_post.return_value.json.return_value = {
            "status": "success",
            "data": {"tx_ref": "order-1"}
        }
        mock_post.return_value.status_code = 200

        response = self.order.initiate_payment("https://callback-url.com")
        self.assertEqual(response["status"], "success")
        self.assertEqual(self.order.payment_reference, "order-1")

    @patch('orders.services.requests.get')
    def test_verify_payment(self, mock_get):
        self.order.payment_reference = "order-1"
        self.order.save()

        mock_get.return_value.json.return_value = {
            "status": "success",
            "data": {"status": "successful"}
        }
        mock_get.return_value.status_code = 200

        response = self.order.verify_payment()
        self.assertEqual(response["status"], "success")
        self.assertEqual(self.order.payment_status, "successful")
