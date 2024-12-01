from django.urls import path
from .views import RegistrationView, PinValidationview, CustomLoginView, LogoutView, GeneratePinView, ResetPasswordView
from rest_framework_simplejwt.views import TokenRefreshView




urlpatterns = [
    path('register-generate-pin/', RegistrationView.as_view(), name = 'register-generate-pin'),
     path('register-pin-validate/', PinValidationview.as_view(), name = 'register-validate-pin'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('generate-pin/', GeneratePinView.as_view(), name='generate_pin'),
    path('get-pin/', ResetPasswordView.as_view(), name='reset_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
 
    
]