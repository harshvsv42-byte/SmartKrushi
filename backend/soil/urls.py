from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SoilRecordViewSet

router = DefaultRouter()
router.register('', SoilRecordViewSet, basename='soil')

urlpatterns = [
    path('', include(router.urls)),
]
