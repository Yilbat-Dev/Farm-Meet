from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WithdrawalViewSet, WalletDetailView

from django.urls import path, include


router = DefaultRouter()
router.register(r'withdrawals', WithdrawalViewSet, basename='withdrawal')

urlpatterns = [
    path('api/', include(router.urls)),
    path('',
         WalletDetailView.as_view()
         )
]
