from django.urls import path
from .market_views import MarketPricesView, GovernmentSchemesView, CropCalendarView

urlpatterns = [
    path('prices/', MarketPricesView.as_view(), name='market-prices'),
    path('schemes/', GovernmentSchemesView.as_view(), name='government-schemes'),
    path('calendar/', CropCalendarView.as_view(), name='crop-calendar'),
]
