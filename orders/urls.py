from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet

# Initialize router and register the OrderViewSet
router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
