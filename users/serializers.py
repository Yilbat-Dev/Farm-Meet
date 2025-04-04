from rest_framework import serializers
import re
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
import random
from django.core.cache import cache 
from .SMS import AfricaTalkingService

CustomUser = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'role', 'phone_number', 'password']
        extra_kwargs = {
            'role': {'required': True},
            'phone_number': {'required': True},
            'password': {'write_only': True, 'required': True},
        }

    def validate_phone_number(self, value):
        if not value.startswith('+'):
            value = f'+234{value.lstrip("0")}'  # Standardize Nigerian format
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
        pin = str(random.randint(100000, 999999))  # Generate a 6-digit PIN
        phone_number = validated_data['phone_number']

        # Save user data and PIN to cache
        cache.set(f"temp_user_{phone_number}", validated_data, timeout=300)  # Store user data for 5 minutes
        cache.set(f"pin_{phone_number}", pin, timeout=300)  # Store PIN for 5 minutes

       
        # Prepare the message
        message = f"Your verification PIN is {pin}. It will expire in 5 minutes."

        # Use Africa's Talking to send the SMS
        sms_service = AfricaTalkingService()
        result = sms_service.send_sms(phone_number, message)

        # if result.get('status') != "success":
        #     raise serializers.ValidationError(f"Failed to send PIN: {result.get('message', 'Unknown error')}")

       
        return {
            "message": f"A PIN has been sent to your phone number: {phone_number}. Please enter the PIN {pin} to proceed.",
        }

class PinValidationSerializer(serializers.Serializer):
    pin_code = serializers.CharField()

    def validate(self, data):
        """
        Validate the provided PIN code and ensure the user can be activated.
        """
        pin_code = data.get("pin_code")

        # Step 1: Retrieve phone number associated with the PIN
        phone_number = None
        for key in cache.iter_keys("pin_*"):  # Search through PIN cache keys
            if cache.get(key) == pin_code:
                phone_number = key.split("_")[1]  # Extract phone number from the key
                break

        if not phone_number:
            raise serializers.ValidationError("Invalid PIN or PIN has expired.")

        # Step 2: Retrieve user data from cache
        user_data = cache.get(f"temp_user_{phone_number}")
        if not user_data:
            raise serializers.ValidationError("Session expired. Please request a new PIN.")

        # Step 3: Ensure no duplicate active user exists
        if CustomUser.objects.filter(phone_number=phone_number, is_active=True).exists():
            raise serializers.ValidationError("User is already activated.")

        # Attach necessary data for user creation
        data['phone_number'] = phone_number
        data['user_data'] = user_data

        return data

    def create(self, validated_data):
        """
        Create and activate the user based on validated data.
        """
        phone_number = validated_data['phone_number']
        user_data = validated_data['user_data']

        # Step 4: Create and activate the user
        user = CustomUser.objects.create_user(
            full_name=user_data['full_name'],
            phone_number=phone_number,
            role=user_data['role'],
            password=user_data['password'],
            is_active=True,
        )

        # Step 5: Clear cached data
        cache.delete(f"temp_user_{phone_number}")
        cache.delete(f"pin_{phone_number}")

        return user  # Return the user instance




# class PinValidationSerializer(serializers.Serializer):
#     pin_code = serializers.CharField()

#     def validate(self, data):
#         """
#         Validate the provided PIN code and ensure the user can be activated.
#         """
#         pin_code = data.get("pin_code")

#         # Step 1: Retrieve phone number associated with the PIN
#         phone_number = None
#         for key in cache.iter_keys("pin_*"):  # Search through PIN cache keys
#             if cache.get(key) == pin_code:
#                 phone_number = key.split("_")[1]  # Extract phone number from the key
#                 break

#         if not phone_number:
#             raise serializers.ValidationError("Invalid PIN or PIN has expired.")

#         # Step 2: Retrieve user data from cache
#         user_data = cache.get(f"temp_user_{phone_number}")
#         if not user_data:
#             raise serializers.ValidationError("Session expired. Please request a new PIN.")

#         # Step 3: Ensure no duplicate active user exists
#         if CustomUser.objects.filter(phone_number=phone_number, is_active=True).exists():
#             raise serializers.ValidationError("User is already activated.")

#         # Attach necessary data for user creation
#         data['phone_number'] = phone_number
#         data['user_data'] = user_data

#         return data

#     def create(self, validated_data):
#         """
#         Create and activate the user based on validated data.
#         """
#         phone_number = validated_data['phone_number']
#         user_data = validated_data['user_data']

#         # Step 4: Create and activate the user
#         user = CustomUser.objects.create_user(
#             full_name=user_data['full_name'],
#             phone_number=phone_number,
#             role=user_data['role'],
#             password=user_data['password'],
#             is_active=True,
#         )

#         # Step 5: Clear cached data
#         cache.delete(f"temp_user_{phone_number}")
#         cache.delete(f"pin_{phone_number}")

#         return {"message": "User activated successfully."}


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
            raise serializers.ValidationError({"phone_number": "This field is required."})
        if not password:
            raise serializers.ValidationError({"password": "This field is required."})

        # Standardize phone number format
        if not phone_number.startswith('+'):
            phone_number = f'+234{phone_number.lstrip("0")}'  # Strip leading zero and prepend +234

        # Authenticate the user with phone_number
        try:
            user = CustomUser.objects.get(phone_number=phone_number)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid phone number or password.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid phone number or password.")
        
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        # Determine user role
        if hasattr(user, "farmer_profile"):
            role = "farmer"
            profile_id = user.farmer_profile.id
        elif hasattr(user, "customer_profile"):
            role = "customer"
            profile_id = user.customer_profile.id
        else:
            role = user.role
            profile_id = None

        # Generate tokens manually 
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Return custom response with tokens, role, and profile info
        return {
            "access": access_token,
            "refresh": str(refresh),
            "phone_number": user.phone_number,
            "role": role,
            "profile_exists": bool(profile_id),
            "profile_id": profile_id
        }
    
class GeneratePinSerializer(serializers.Serializer):
    phone_number = serializers.CharField()

    def validate_phone_number(self, value):
        # Standardize the phone number format by ensuring it starts with '+'
        if not value.startswith('+'):
            value = f'+234{value.lstrip("0")}'  # Remove any leading zero and prepend +234

        # Verify that the phone number exists in your user database
        if not CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number not found.")

        return value

    def save(self, **kwargs):
        phone_number = self.validated_data['phone_number']
        # Generate a random 6-digit PIN
        generated_pin = str(random.randint(100000, 999999))

        # Store the PIN and the phone number in cache for 5 minutes
        cache.set(f"reset_pin_{phone_number}", generated_pin, timeout=300)
        cache.set("current_reset_phone", phone_number, timeout=300)

        # Prepare the SMS message
        message = f"Your verification PIN is {generated_pin}. It will expire in 5 minutes."

        # Send the SMS using Africa's Talking service
        sms_service = AfricaTalkingService()
        result = sms_service.send_sms(phone_number, message)

        if result.get('status') == "success":
            return {
                "message": f"A PIN: {generated_pin} has been sent to your phone number: {phone_number}. Please enter the PIN to proceed.",
                "phone_number": phone_number,
                "generated_pin": generated_pin
            }
        else:
            raise serializers.ValidationError(f"Failed to send PIN: {result.get('message', 'Unknown error')}")    


class VerifyOTPSerializer(serializers.Serializer):
    # We only require the PIN input; the phone number is retrieved from cache
    pin = serializers.CharField(write_only=True)

    def validate(self, data):
        input_pin = data.get("pin")

        # Retrieve the phone number from the cache
        phone_number = cache.get("current_reset_phone")
        if not phone_number:
            raise serializers.ValidationError("Session expired. Please request a new PIN.")

        # Retrieve the generated PIN from cache using the phone number
        cached_pin = cache.get(f"reset_pin_{phone_number}")
        if not cached_pin or cached_pin != input_pin:
            raise serializers.ValidationError("Invalid or expired PIN. Please request a new one.")

        # Attach the phone number to data for downstream processes if needed
        data["phone_number"] = phone_number
        return data

class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(min_length=6, write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        # Retrieve phone number from cache
        phone_number = cache.get("current_reset_phone")
        if not phone_number:
            raise serializers.ValidationError("Session expired. Please verify your OTP again.")

        data["phone_number"] = phone_number
        return data

    def save(self, **kwargs):
        phone_number = self.validated_data["phone_number"]
        new_password = self.validated_data["new_password"]

        # Reset the user's password
        user = CustomUser.objects.get(phone_number=phone_number)
        user.set_password(new_password)
        user.save()

        # Clear cache
        cache.delete(f"reset_pin_{phone_number}")
        cache.delete("current_reset_phone")

        return {"message": "Password reset successfully."}