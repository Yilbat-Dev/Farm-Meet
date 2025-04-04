from django.urls import path
from .views import RegistrationView, PinValidationView, CustomLoginView, LogoutView, GeneratePinView, ResetPasswordView,VerifyOTPView
from rest_framework_simplejwt.views import TokenRefreshView




urlpatterns = [
    path('register-generate-pin/', RegistrationView.as_view(), name = 'register-generate-pin'),
    path('register-pin-validate/', PinValidationView.as_view(), name = 'register-validate-pin'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset-generate-otp/', GeneratePinView.as_view(), name='generate_pin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    path("auth/verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("auth/reset-password/", ResetPasswordView.as_view(), name="reset-password"),   
]