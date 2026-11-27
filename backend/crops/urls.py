from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropViewSet, CropRecordViewSet

router = DefaultRouter()
router.register('records', CropRecordViewSet, basename='crop-records')
router.register('', CropViewSet, basename='crops')

urlpatterns = [
    path('', include(router.urls)),
]
