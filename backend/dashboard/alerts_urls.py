from django.urls import path
from .alerts_views import AlertsListView, AlertsBriefingView

urlpatterns = [
    path('', AlertsListView.as_view(), name='alerts-list'),
    path('briefing/', AlertsBriefingView.as_view(), name='alerts-briefing'),
]
