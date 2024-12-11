from rest_framework import serializers
from .models import Order, OrderItem
from farmer.serializers import ProduceSerializer
from customer.serializers import CustomerProfileSerializer

# class OrderSerializer(serializers.ModelSerializer):
#     customer = CustomerProfileSerializer(read_only=True)
#     produce = ProduceSerializer(many=True)

#     class Meta:
#         model = Order
#         fields = ['id', 'customer', 'produce', 'total_amount', 'created_at', 'status']

#     def validate(self, attrs):
#             user = self.context['request'].user
#             if user.role != 'customer':  # Adjust 'role' to match your CustomUser field
#                 raise serializers.ValidationError("Only customers can make orders")
#             return attrs

class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'produce', 'quantity', 'price', 'total_price']
        read_only_fields = ['order']



class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerProfileSerializer(read_only=True)
    items = OrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'items', 'subtotal', 'delivery_amount', 'service_fee', 'total_amount', 'status', 'created_at']

    def validate(self, attrs):
            user = self.context['request'].user
            if user.role != 'customer':  # Adjust 'role' to match your CustomUser field
                raise serializers.ValidationError("Only customers can make orders")
            return attrs

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        # Create OrderItems
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        # Calculate totals
        order.calculate_subtotal()
        order.calculate_total()
        return order
