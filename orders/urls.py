from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, NotificationViewSet

# Initialize DRF DefaultRouter
router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'orderitems', OrderItemViewSet, basename='orderitems')
router.register(r'notifications', NotificationViewSet, basename='notification')

# Define additional payment-specific URLs
urlpatterns = [
    # Include all default routes from the router
    path('', include(router.urls)),

    # Payment verification and callback URLs
    path('orders/<int:order_id>/initiate-payment/',
         OrderViewSet.as_view({'post': 'initiate_payment'}), name='initiate-payment'),
    path('verify-payment/',
         OrderViewSet.as_view({'post': 'verify_payment'}), name='verify-payment'),
    path('payment-callback/', 
         OrderViewSet.as_view({'get': 'payment_callback'}), name='payment-callback'),
]
