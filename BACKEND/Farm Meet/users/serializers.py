from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
import random
from django.core.cache import cache 

# User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'phone_number', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_phone_number(self, value):
        if CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone number is already in use.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value

    def create(self, validated_data):
        # Create user with validated data and hash the password
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password']
        )
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError("Username and password are required.")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        data = super().validate(attrs)
        data['username'] = user.username
        data['phone_number'] = user.phone_number
        return data
    

# class PasswordResetSerializer(serializers.Serializer):
#     phone_number = serializers.CharField()
#     pin = serializers.CharField(required=False, write_only=True)  # PIN for verification
#     new_password = serializers.CharField(min_length=6, write_only=True)
#     confirm_password = serializers.CharField(min_length=6, write_only=True)

#     def validate_phone_number(self, value):
#         if not CustomUser.objects.filter(phone_number=value).exists():
#             raise serializers.ValidationError("Phone number not found.")
#         return value

#     def validate(self, data):
#         phone_number = data.get('phone_number')
#         pin = data.get('pin')

#         # Step 1: If PIN is not provided, generate and send it
#         if not pin:
#             generated_pin = str(random.randint(100000, 999999))  # Generate a 6-digit PIN
#             cache.set(f"reset_pin_{phone_number}", generated_pin, timeout=300)  # Store PIN for 5 minutes
#             # Simulate sending the PIN (replace with actual SMS service)
#             raise serializers.ValidationError(f"A PIN has been sent to your phone. Please enter the PIN to proceed. {generated_pin}")

#         # Step 2: Validate the PIN
#         cached_pin = cache.get(f"reset_pin_{phone_number}")
#         if not cached_pin or cached_pin != pin:
#             raise serializers.ValidationError("Invalid or expired PIN.")

#         # Step 3: Validate passwords
#         if data['new_password'] != data['confirm_password']:
#             raise serializers.ValidationError("Passwords do not match.")
        
#         return data

#     def save(self, **kwargs):
#         phone_number = self.validated_data['phone_number']
#         new_password = self.validated_data['new_password']

#         # Reset the user's password
#         user = CustomUser.objects.get(phone_number=phone_number)
#         user.set_password(new_password)
#         user.save()

#         # Delete the PIN after successful reset
#         cache.delete(f"reset_pin_{phone_number}")
#         return user


class GeneratePinSerializer(serializers.Serializer):
    phone_number = serializers.CharField()

    def validate_phone_number(self, value):
        if not CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number not found.")
        return value

    def save(self, **kwargs):
        phone_number = self.validated_data['phone_number']

        # Generate a random 6-digit PIN
        generated_pin = str(random.randint(100000, 999999))
        cache.set(f"reset_pin_{phone_number}", generated_pin, timeout=300)  # Store PIN for 5 minutes
        cache.set("current_reset_phone", phone_number, timeout=300)  # Store phone no for 5 minutes

        # Simulate sending the PIN (replace with actual SMS service)
        # print(f"PIN sent to {phone_number}: {generated_pin}")
        raise serializers.ValidationError(f"A PIN has been sent to your phone no: {phone_number} Please enter the PIN to proceed. {generated_pin}")
    

class ResetPasswordSerializer(serializers.Serializer):
    
    pin = serializers.CharField(write_only=True)  # PIN for verification
    new_password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(min_length=6, write_only=True)

    def validate(self, data):
        
        pin = data.get('pin')

        # Retrieve phone number from cache
        phone_number = cache.get("current_reset_phone")
        if not phone_number:
            raise serializers.ValidationError("Session expired. Please request a new PIN.")

        # Validate PIN
        cached_pin = cache.get(f"reset_pin_{phone_number}")
        if not cached_pin or cached_pin != pin:
            raise serializers.ValidationError("Invalid or expired PIN.")

        # Validate passwords
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        # return data

        
    
        data['phone_number'] = phone_number
        return data

    def save(self, **kwargs):
        phone_number = self.validated_data['phone_number']
        new_password = self.validated_data['new_password']

        # Reset the user's password
        user = CustomUser.objects.get(phone_number=phone_number)
        user.set_password(new_password)
        user.save()

        # Delete the PIN after successful reset
         # Delete the PIN and phone number after successful reset
        cache.delete(f"reset_pin_{phone_number}")
        cache.delete("current_reset_phone")

        return {"message": "Password reset successfully."}