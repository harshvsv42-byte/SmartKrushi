from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StateViewSet, DistrictViewSet, TalukaViewSet, VillageViewSet

router = DefaultRouter()
router.register('states', StateViewSet, basename='location-states')
router.register('districts', DistrictViewSet, basename='location-districts')
router.register('talukas', TalukaViewSet, basename='location-talukas')
router.register('villages', VillageViewSet, basename='location-villages')

urlpatterns = [
    path('', include(router.urls)),
]
