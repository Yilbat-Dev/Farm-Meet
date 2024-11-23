from rest_framework import serializers
from .models import FarmProduce, FarmerProfile


class FarmerProfileSerializer(serializers.HyperlinkedModelSerializer):
    full_name = serializers.ReadOnlyField(source='user.get_full_name')
    phone_number = serializers.ReadOnlyField(source='user.phone_number')

    farm_category = serializers.ListField(
        child=serializers.ChoiceField(choices=FarmerProfile.FARM_CATEGORIES)
    )
    delivery_days = serializers.ListField(
        child=serializers.ChoiceField(choices=FarmerProfile.DAYS_OF_WEEK)
    )

    class Meta:
        model = FarmerProfile
        fields = ['id', 'farmer_image','farm_name', 'full_name', 'description', 'farm_category', 'farm_address',
                  'email', 'phone_number', 'farm_size', 'max_orders', 'delivery_days' ]
        
    def validate(self, attrs):
            user = self.context['request'].user
            if user.role != 'farmer':  # Adjust 'role' to match your CustomUser field
                raise serializers.ValidationError("Only users with the farmer role can create a farmer profile.")
            return attrs

    def validate_farm_category(self, value):
        if not value:
            raise serializers.ValidationError("Farm category cannot be empty.")
        return value

    def validate_delivery_days(self, value):
        if not value:
            raise serializers.ValidationError("Delivery days cannot be empty.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        if FarmerProfile.objects.filter(user=user).exists():
            raise serializers.ValidationError("A profile for this farmer already exists.")
        validated_data['user'] = user
        return super().create(validated_data)
    


class ProduceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = FarmProduce
        fields = ['id', 'name', 'description', 'price',
                  'image', 'created_at']
        read_only_fields = ['id', 'created_at', 'farmer_profile']
