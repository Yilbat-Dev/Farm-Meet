from django.urls import path
from .views import RegistrationView, CustomLoginView, LogoutView, GeneratePinView, ResetPasswordView
from rest_framework_simplejwt.views import TokenRefreshView




urlpatterns = [
    path('register/', RegistrationView.as_view(), name = 'register'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('reset-password/', PasswordResetView.as_view(), name='reset_password'),
    path('generate-pin/', GeneratePinView.as_view(), name='generate_pin'),
    path('get-pin/', ResetPasswordView.as_view(), name='reset_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
 
    
]