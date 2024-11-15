from rest_framework import serializers
from .models import Order
from farmer.models import FarmProduce
from django.contrib.auth import get_user_model

User = get_user_model()

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    customer = serializers.HyperlinkedRelatedField(
        view_name='user-detail',  # Link to user detail view
        read_only=True
    )
    produce = serializers.HyperlinkedRelatedField(
        view_name='farmproduce-detail',  # Link to farm produce detail
        queryset=FarmProduce.objects.all()  # Allow selecting a produce item by URL
    )

    class Meta:
        model = Order
        fields = ['url', 'id', 'customer', 'produce', 'quantity', 'delivery_type', 'is_paid', 'created_at']
        extra_kwargs = {
            'url': {'view_name': 'order-detail', 'lookup_field': 'pk'}
        }
