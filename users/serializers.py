from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import random
from django.core.cache import cache
from .SMS import AfricaTalkingService

CustomUser = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name',
                  'role', 'phone_number', 'password']
        extra_kwargs = {
            'username': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': False},
            'role': {'required': False},
            'phone_number': {'required': True},
            'password': {'write_only': True, 'required': True},
        }

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This username is already taken.")
        return value

    def validate_phone_number(self, value):
        if CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "This phone number is already in use.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError(
                "Password must be at least 6 characters long.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError(
                "Password must contain at least one number.")
        return value

    def create(self, validated_data):
        # Create user with validated data and hash the password
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password']
        )


User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove 'username' field so it's not required
        self.fields.pop('username', None)

    def validate(self, attrs):
        phone_number = attrs.get('phone_number')
        password = attrs.get('password')

        if not phone_number:
            raise serializers.ValidationError(
                {"phone_number": "This field is required."})
        if not password:
            raise serializers.ValidationError(
                {"password": "This field is required."})

         # Standardize the phone number format
        if not phone_number.startswith('+'):  # Add country code if missing
            # Strip leading zero and prepend +234
            phone_number = f'+234{phone_number.lstrip("0")}'

        # Authenticate the user with phone_number
        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid phone number or password.")

        # Check the password
        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid phone number or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        # Generate tokens manually

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Return the custom data with the tokens
        return {

            'access': access_token,
            'refresh': str(refresh),
            'phone_number': user.phone_number
        }


class GeneratePinSerializer(serializers.Serializer):
    phone_number = serializers.CharField()

    def validate_phone_number(self, value):
        # Standardize the phone number format
        if not value.startswith('+'):  # Add country code if missing
            # Strip leading zero and prepend +234
            value = f'+234{value.lstrip("0")}'

        # Check if the standardized phone number exists in the database
        if not CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number not found.")

        # Return the standardized phone number
        return value

    def save(self, **kwargs):
        phone_number = self.validated_data['phone_number']

        # Generate a random 6-digit PIN
        generated_pin = str(random.randint(100000, 999999))

        # Store the PIN and phone number in the cache
        # Store PIN for 5 minutes
        cache.set(f"reset_pin_{phone_number}", generated_pin, timeout=300)
        # Store phone number for 5 minutes
        cache.set("current_reset_phone", phone_number, timeout=300)

        # Prepare the message
        message = f"Your verification PIN is {generated_pin}. It will expire in 5 minutes."

        # Use Africa's Talking to send the SMS
        sms_service = AfricaTalkingService()
        result = sms_service.send_sms(phone_number, message)

        # Handle SMS sending result
        if result.get('status') == "success":
            return {
                "message": f"A PIN : {generated_pin } has been sent to your phone number: {phone_number}. Please enter the PIN to proceed.",
                "phone_number": phone_number,
                "generated_pin": generated_pin
            }
        else:
            raise serializers.ValidationError(
                f"Failed to send PIN: {result.get('message', 'Unknown error')}")


class ResetPasswordSerializer(serializers.Serializer):
    phone_number = serializers.CharField(write_only=True)
    pin = serializers.CharField(write_only=True)  # PIN for verification
    new_password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(min_length=6, write_only=True)

    def validate(self, data):

        pin = data.get('pin')
        user_phone_number = data.get('phone_number')

        # Retrieve phone number from cache
        phone_number = cache.get("current_reset_phone")
        if not phone_number:
            raise serializers.ValidationError(
                "Session expired. Please request a new PIN.")
        elif phone_number != user_phone_number:
            raise serializers.ValidationError(
                "Wrong Number pls input correct user phone number.")

        # Validate PIN
        cached_pin = cache.get(f"reset_pin_{phone_number}")
        if not cached_pin or cached_pin != pin:
            raise serializers.ValidationError(
                "Invalid or expired PIN. Please request a new PIN")

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
