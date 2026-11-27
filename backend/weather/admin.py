from django.contrib import admin
from .models import WeatherRecord


@admin.register(WeatherRecord)
class WeatherRecordAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'state', 'district', 'taluka',
        'temperature', 'humidity', 'rainfall',
        'wind_speed', 'weather_condition',
        'is_manual', 'data_source', 'recorded_at'
    )
    list_filter = ('is_manual', 'weather_condition', 'state', 'district', 'recorded_at')
    search_fields = ('state', 'district', 'taluka', 'village', 'weather_condition', 'data_source')
    date_hierarchy = 'recorded_at'
    ordering = ('-recorded_at',)

    fieldsets = (
        ('Location', {
            'fields': ('state', 'district', 'taluka', 'village', 'latitude', 'longitude')
        }),
        ('Atmospheric Readings', {
            'fields': (
                'temperature', 'feels_like', 'humidity',
                'rainfall', 'wind_speed', 'wind_direction', 'pressure', 'weather_condition'
            )
        }),
        ('Source & Timing', {
            'fields': ('recorded_at', 'data_source', 'is_manual')
        }),
    )
