from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmProduceViewSet, ProduceListViewSet

router = DefaultRouter()
router.register(r'produce', FarmProduceViewSet, basename='produce')
router.register(r'produce-list', ProduceListViewSet, basename='produce-list')

urlpatterns = router.urls
