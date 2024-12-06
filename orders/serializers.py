from rest_framework import serializers
from .models import Order, OrderItem
from farmer.serializers import ProduceSerializer
from customer.serializers import CustomerProfileSerializer

class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerProfileSerializer(read_only=True)
    produce = ProduceSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'produce', 'total_amount', 'created_at', 'status']

    def validate(self, attrs):
            user = self.context['request'].user
            if user.role != 'customer':  # Adjust 'role' to match your CustomUser field
                raise serializers.ValidationError("Only customers can make orders")
            return attrs
