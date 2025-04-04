from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegistrationSerializer, PinValidationSerializer, CustomTokenObtainPairSerializer, GeneratePinSerializer, ResetPasswordSerializer, VerifyOTPSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class RegistrationView(APIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        request_body=RegistrationSerializer,
        responses={
            201: openapi.Response(
                description="User registered successfully",
                examples={
                    "application/json": {"message": "User registered successfully."}
                },
            ),
            400: openapi.Response(description="Validation errors"),
        },
    )
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken

class PinValidationView(APIView):
    serializer_class = PinValidationSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        request_body=PinValidationSerializer,
        responses={
            200: openapi.Response(
                description="PIN validated successfully and tokens issued",
                examples={
                    "application/json": {
                        "message": "PIN validated successfully.",
                        "refresh": "refresh_token_example",
                        "access": "access_token_example"
                    }
                },
            ),
            400: openapi.Response(description="Validation errors"),
        },
    )
    def post(self, request):
            serializer = PinValidationSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()  # This should return a user instance

                # Generate tokens for the user
                refresh = RefreshToken.for_user(user)

                # Determine user role and profile
                if hasattr(user, "farmer_profile"):
                    role = "farmer"
                    profile_id = user.farmer_profile.id
                elif hasattr(user, "customer_profile"):
                    role = "customer"
                    profile_id = user.customer_profile.id
                else:
                    role = user.role
                    profile_id = None

                response_data = {
                    "message": "PIN validated successfully.",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "role": role,
                    "profile_exists": bool(profile_id),
                    "profile_id": profile_id,
                }
                return Response(response_data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLoginView(TokenObtainPairView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
            },
            required=['refresh'],
        ),
        responses={
            200: openapi.Response(description="Logout successful."),
            400: openapi.Response(description="Invalid refresh token or unable to blacklist."),
        },
    )
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logout successful."}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Invalid refresh token or unable to blacklist."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GeneratePinView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    serializer_class = GeneratePinSerializer

    @swagger_auto_schema(
        operation_id="generatePin",
        request_body=GeneratePinSerializer,
        responses={
            200: openapi.Response(description="PIN generated successfully."),
            400: openapi.Response(description="Validation errors."),
        },
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer
    authentication_classes = []

    @swagger_auto_schema(
        request_body=ResetPasswordSerializer,
        responses={
            200: openapi.Response(description="Password reset successful."),
            400: openapi.Response(description="Validation errors."),
        },
    )
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        request_body=VerifyOTPSerializer,
        responses={200: "OTP verified successfully.", 400: "Invalid OTP."},
    )
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        request_body=ResetPasswordSerializer,
        responses={200: "Password reset successful.", 400: "Validation errors."},
    )
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)