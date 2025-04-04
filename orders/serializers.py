from rest_framework import serializers
from .models import Order, OrderItem,Notification
from farmer.models import FarmProduce, FarmerProfile
from customer.models import CustomerProfile
from farmer.serializers import ProduceSerializer, FarmerProfileSerializer, ProduceImageSerializer
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
#             return attrs0

class OrderItemSerializer(serializers.ModelSerializer):
    produce = serializers.PrimaryKeyRelatedField(
        queryset=FarmProduce.objects.all()
    )
    farmer = serializers.PrimaryKeyRelatedField(
        queryset=FarmerProfile.objects.all()
    )
    customer_name = serializers.SerializerMethodField()
    produce_name = serializers.SerializerMethodField()
    produce_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'farmer', 'customer_name', 'produce', 'produce_name',
            'produce_image', 'price', 'quantity', 'total', 'delivery_status',
            'payment_status', 'created_at', 'delivery_date',
        ]
        read_only_fields = [
            'order', 'price', 'delivery_status', 'payment_status',
            'created_at', 'delivery_date', 'total', 'farmer_name',
            'produce_name', 'produce_image'
        ]

    def get_customer_name(self, obj):
        return obj.order.customer.full_name  # Assuming 'full_name' is the field for the farmer's name

    def get_produce_name(self, obj):
        return obj.produce.name  # Assuming 'name' is the field for the produce name

    def get_produce_image(self, obj):
        images = obj.produce.images.all()
        if images.exists():
            return ProduceImageSerializer(images.first()).data
        return None




# class OrderItemSerializer(serializers.HyperlinkedModelSerializer):
#     produce = serializers.PrimaryKeyRelatedField(
#         queryset=FarmProduce.objects.all())
#     farmer = serializers.PrimaryKeyRelatedField(
#         queryset=FarmerProfile.objects.all())

#     class Meta:
#         model = OrderItem
#         fields = ['id', 'order', 'farmer', 'produce', 'price','quantity', 'total','delivery_status', 'payment_status','created_at', 'delivery_date',]
#         read_only_fields = ['order','price', 'delivery_status', 'payment_status','created_at', 'delivery_date', 'total']

    # def update(self, instance, validated_data):
    #     """
    #     Override the update method to fetch the price from the FarmProduce model.
    #     """
    #     if 'produce' in validated_data:
    #         produce = validated_data['produce']
    #         instance.price = produce.price  # Update price from the new produce

    #     instance.quantity = validated_data.get('quantity', instance.quantity)
    #     # instance.total_price = instance.quantity * instance.price  # Recalculate total price
    #     instance.save()
    #     return instance


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer = serializers.ReadOnlyField(source='customer.id',)
    delivery_address = serializers.ReadOnlyField(source='customer.address',)

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'service_fee',  'delivery_fee','total_amount', 'grand_total',
            'delivery_option', 'delivery_address', 'payment_status',
            'created_at', 'items'
        ]
        read_only_fields = [
            'grand_total', 'total_amount', 'created_at', 'service_fee',
             'delivery_fee','payment_status'
        ]

    def validate(self, attrs):
        user = self.context['request'].user
        if user.role != 'customer':  # Replace with your CustomUser field logic
            raise serializers.ValidationError(
                "Only customers can make orders.")
        return attrs

    def create(self, validated_data):
        # Extract the authenticated user
        user = self.context['request'].user

        # Ensure the user has an associated CustomerProfile
        try:
            customer = user.customer_profile  # Replace with your reverse relation if necessary
        except CustomerProfile.DoesNotExist:
            raise serializers.ValidationError(
                "No customer profile found for the user.")

        """
        Create an order and its associated order items.
        """
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(customer=customer, **validated_data)

        # Iterate over the provided order items
        for item_data in items_data:
            produce_id = item_data.get("produce")
            farmer_id = item_data.get("farmer")

            print(f"Item data: {item_data}")
            if not produce_id:
                raise serializers.ValidationError(
                    "Produce must be provided for each order item.")
            if not farmer_id:
                raise serializers.ValidationError(
                    "Farmer must be provided for each order item.")

            # Retrieve the produce instance
            try:
                produce_instance = FarmProduce.objects.get(
                    id=item_data['produce'].id)
            #     if produce_instance.quantity < item_data['quantity'] or produce_instance.status == "out of stock":
            #         raise serializers.ValidationError({
            #         'produce': f"Produce {produce_instance.name} is out of stock. Available quantity: {produce_instance.quantity}"
            # })
            except FarmProduce.DoesNotExist:
                raise serializers.ValidationError(
                    f"Produce with id {produce_id} does not exist.")
            # Retrieve the farmer instance
            try:
                farmer_instance = FarmerProfile.objects.get(
                    id=item_data['farmer'].id)
            except FarmerProfile.DoesNotExist:
                raise serializers.ValidationError(
                    f"Farmer with id {farmer_id} does not exist.")

            # Add the price from the produce object to the order item
            # item_data['price'] = produce_instance.price

            # Create the order item and associate it with the order
           # Create the OrderItem without passing 'produce' in **item_data
        item_data_copy = item_data.copy()
        item_data_copy.pop('farmer', None)
        item_data_copy.pop('produce', None)

        OrderItem.objects.create(
            order=order,
            produce=produce_instance,
            farmer=farmer_instance,
            **item_data_copy  # Use the cleaned copy without farmer and produce
        )

    # Calculate totals
        total_amount = sum(item.quantity * item.price for item in order.items.all())
        order.total_amount = total_amount
        order.grand_total = total_amount + order.delivery_fee + order.service_fee
        order.save()

        return order
            # # Recalculate the total order amount based on order items
        # total_amount = sum(
        #     item.quantity * item.price for item in order.items.all()
        # )

        # order.total_amount = total_amount
        # order.grand_total = total_amount + order.delivery_fee + order.service_fee
        # order.save()

        # return order


class NotificationSerializer(serializers.ModelSerializer):
    related_order = serializers.PrimaryKeyRelatedField(queryset=OrderItem.objects.all(), allow_null=True)  # Important!
    class Meta:
        model = Notification
        fields = ['id', 'related_order','title', 'message', 'type', 'read', 'created_at']
        read_only_fields = ['related_order','read', 'created_at',  'message', 'type', 'title']