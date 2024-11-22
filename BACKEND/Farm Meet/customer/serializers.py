# from rest_framework import serializers
# from .models import Order, CustomerProfile
# from farmer.serializers import FarmProduceSerializer
# from django.contrib.auth import get_user_model

# class CustomerProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomerProfile
#         fields = ['id', 'address', 'profile_picture']

# class OrderSerializer(serializers.ModelSerializer):
#     produce = FarmProduceSerializer(read_only=True)

#     class Meta:
#         model = Order
#         fields = ['id', 'customer', 'produce', 'quantity', 'delivery_option', 'paid', 'order_date']
#         read_only_fields = ['id', 'customer', 'order_date']