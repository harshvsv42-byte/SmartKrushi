from django.urls import path
from .views import RecommendationView, CropSuitabilityView, FertilizerGuidanceView

urlpatterns = [
    path('', RecommendationView.as_view(), name='recommendations'),
    path('crop-suitability/', CropSuitabilityView.as_view(), name='recommendations-crop-suitability'),
    path('fertilizer-guidance/', FertilizerGuidanceView.as_view(), name='recommendations-fertilizer-guidance'),
]
