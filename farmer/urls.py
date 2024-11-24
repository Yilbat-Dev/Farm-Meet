from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmerProfileViewSet, ProduceViewSet

router = DefaultRouter()
router.register(r'farmer-profiles', FarmerProfileViewSet, basename='farmer-profile')
router.register(r'produce', ProduceViewSet, basename='produce')

urlpatterns = [
    path('', include(router.urls)),
]