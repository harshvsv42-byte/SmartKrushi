from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FertilizerViewSet

router = DefaultRouter()
router.register('', FertilizerViewSet, basename='fertilizers')

urlpatterns = [
    path('', include(router.urls)),
]
