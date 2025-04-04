from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmerProfileViewSet, ProduceViewSet,BankAccountViewSet,WalletViewSet
from django.urls import reverse

router = DefaultRouter()
router.register(r'farmer-profiles', FarmerProfileViewSet, basename='farmer-profile')
router.register(r'produce', ProduceViewSet, basename='produce')
router.register(r'bank-accounts', BankAccountViewSet, basename='bank-account')
router.register(r'withdrawal-requests', WalletViewSet, basename='withdrawal-request')


urlpatterns = [
    path('', include(router.urls)),
    path('bank-accounts/add-bank/',
         BankAccountViewSet.as_view({'post': 'add_bank_account'}), name='add-bank'),

    path('bank-accounts/my-bank-accounts/',
         BankAccountViewSet.as_view({'get': 'list_farmer_accounts'}), name='my-bank-accounts'),

    path('bank-accounts/<int:pk>/create-paystack-recipient/',  # <int:pk> is crucial
         BankAccountViewSet.as_view({'post': 'create_paystack_recipient'}), name='create-paystack-recipient'),

    path('withdrawal-requests/withdraw/',
         WalletViewSet.as_view({'post': 'withdraw'}), name='withdraw'),

]

