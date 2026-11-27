from django.urls import path
from .diagnostics_views import DiagnosticsView, DiagnosticsDetailView

urlpatterns = [
    path('', DiagnosticsView.as_view(), name='diagnostics-list-create'),
    path('<int:pk>/', DiagnosticsDetailView.as_view(), name='diagnostics-detail'),
]
