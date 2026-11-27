"""
URL Configuration for Smart Agriculture Assistant.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.shortcuts import redirect
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def api_root(request):
    """Welcome page — redirect to Swagger UI."""
    return redirect('/api/docs/')


def api_info(request):
    """JSON overview of all available API endpoints."""
    return JsonResponse({
        "project": "Smart Agriculture Assistant API",
        "version": "1.0",
        "status": "running",
        "documentation": {
            "swagger_ui": request.build_absolute_uri('/api/docs/'),
            "redoc": request.build_absolute_uri('/api/redoc/'),
            "openapi_schema": request.build_absolute_uri('/api/schema/'),
        },
        "endpoints": {
            "auth": request.build_absolute_uri('/api/v1/auth/'),
            "locations": request.build_absolute_uri('/api/v1/locations/'),
            "soil": request.build_absolute_uri('/api/v1/soil/'),
            "crops": request.build_absolute_uri('/api/v1/crops/'),
            "weather": request.build_absolute_uri('/api/v1/weather/'),
            "fertilizers": request.build_absolute_uri('/api/v1/fertilizers/'),
            "diseases": request.build_absolute_uri('/api/v1/diseases/'),
            "pests": request.build_absolute_uri('/api/v1/pests/'),
            "recommendations": request.build_absolute_uri('/api/v1/recommendations/'),
            "datasets": request.build_absolute_uri('/api/v1/datasets/'),
            "dashboard": request.build_absolute_uri('/api/v1/dashboard/'),
        },
        "admin": request.build_absolute_uri('/admin/'),
    })


urlpatterns = [
    # Root → redirect to Swagger UI
    path('', api_root, name='root'),
    path('api/', api_info, name='api-info'),

    # Django Admin
    path('admin/', admin.site.urls),

    # OpenAPI / Swagger / ReDoc Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Endpoints
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/locations/', include('locations.urls')),
    path('api/v1/soil/', include('soil.urls')),
    path('api/v1/crops/', include('crops.urls')),
    path('api/v1/weather/', include('weather.urls')),
    path('api/v1/fertilizers/', include('fertilizers.urls')),
    path('api/v1/', include('plant_health.urls')),  # exposes /api/v1/diseases/ and /api/v1/pests/
    path('api/v1/recommendations/', include('recommendations.urls')),
    path('api/v1/datasets/', include('datasets.urls')),
    path('api/v1/dashboard/', include('dashboard.urls')),
    path('api/v1/market/', include('dashboard.market_urls')),
    path('api/v1/alerts/', include('dashboard.alerts_urls')),
    path('api/v1/diagnostics/', include('dashboard.diagnostics_urls')),

    # Direct API Aliases (backward-compatibility for /api/<endpoint>)
    path('api/auth/', include('accounts.urls')),
    path('api/locations/', include('locations.urls')),
    path('api/soil/', include('soil.urls')),
    path('api/crops/', include('crops.urls')),
    path('api/weather/', include('weather.urls')),
    path('api/fertilizers/', include('fertilizers.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/market/', include('dashboard.market_urls')),
    path('api/alerts/', include('dashboard.alerts_urls')),
    path('api/diagnostics/', include('dashboard.diagnostics_urls')),

]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

