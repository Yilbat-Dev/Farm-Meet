from rest_framework import serializers
from .models import FarmProduce
from django.contrib.auth import get_user_model

User = get_user_model()

class FarmProduceSerializer(serializers.HyperlinkedModelSerializer):
    # farmer = serializers.HyperlinkedRelatedField(
    #     view_name='produce',  # Assumes there is a user detail view
    #     read_only=True
    # )

    class Meta:
        model = FarmProduce
        fields = ['url', 'id', 'name', 'description', 'price', 'farmer', 'created_at']
        read_only_fields = ['farmer', 'created_at']
        extra_kwargs = {
            'url': {'view_name': 'farmproduce-detail', 'lookup_field': 'pk'}
        }


class ProduceListSerializer(serializers.HyperlinkedModelSerializer):
    farmer = serializers.CharField(source="farmer.username", read_only=True)  # Display the farmer's username

    class Meta:
        model = FarmProduce
        fields = ['url', 'id', 'name', 'price', 'created_at', 'farmer']
        extra_kwargs = {
            'url': {'view_name': 'farmproduce-detail', 'lookup_field': 'pk'}
        }

