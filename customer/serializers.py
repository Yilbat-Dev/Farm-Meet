from rest_framework import serializers
from .models import State, LGA, CustomerProfile

class LGASerializer(serializers.ModelSerializer):
    class Meta:
        model = LGA
        fields = ['id', 'name']


class StateSerializer(serializers.ModelSerializer):
    lgas = LGASerializer(many=True, read_only=True)

    class Meta:
        model = State
        fields = ['id', 'name', 'capital', 'lgas']


class CustomerProfileSerializer(serializers.ModelSerializer):
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all())
    lga = serializers.PrimaryKeyRelatedField(queryset=LGA.objects.all())
    full_name = serializers.ReadOnlyField(source='user.full_name')
    phone_number = serializers.ReadOnlyField(source='user.phone_number')

    class Meta:
        model = CustomerProfile
        fields = ['id', 'full_name','phone_number', 'state', 'lga', 'address']

    def validate(self, data):
        # Ensure the selected LGA belongs to the selected State
        state = data.get('state')
        lga = data.get('lga')
        if lga and lga.state != state:
            raise serializers.ValidationError("The selected LGA does not belong to the selected state.")
        return data

    def validate(self, attrs):
            user = self.context['request'].user
            if user.role != 'customer':  # Adjust 'role' to match your CustomUser field
                raise serializers.ValidationError("Only customers can create customer profiles")
            return attrs
