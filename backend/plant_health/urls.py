from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlantDiseaseViewSet, PestViewSet

router = DefaultRouter()
router.register('diseases', PlantDiseaseViewSet, basename='plant-diseases')
router.register('pests', PestViewSet, basename='pests')

urlpatterns = [
    path('', include(router.urls)),
]
