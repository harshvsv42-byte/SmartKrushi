from django.urls import path
from .views import (
    DashboardSummaryView,
    DashboardSoilStatisticsView,
    DashboardCropStatisticsView,
    DashboardWeatherStatisticsView,
)

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('soil-statistics/', DashboardSoilStatisticsView.as_view(), name='dashboard-soil-statistics'),
    path('crop-statistics/', DashboardCropStatisticsView.as_view(), name='dashboard-crop-statistics'),
    path('weather-statistics/', DashboardWeatherStatisticsView.as_view(), name='dashboard-weather-statistics'),
]
