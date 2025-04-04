from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StateViewSet, CustomerProfileViewSet

router = DefaultRouter()
router.register('states', StateViewSet, basename='state')
router.register('profiles', CustomerProfileViewSet, basename='customerprofile')

urlpatterns = [
    path('', include(router.urls)),
]
