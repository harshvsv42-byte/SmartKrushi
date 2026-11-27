from django.contrib import admin
from .models import Fertilizer


@admin.register(Fertilizer)
class FertilizerAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'fertilizer_name', 'fertilizer_type',
        'nitrogen_percentage', 'phosphorus_percentage',
        'potassium_percentage', 'sulphur_percentage',
        'application_method', 'dosage_per_hectare'
    )
    list_filter = ('fertilizer_type',)
    search_fields = ('fertilizer_name', 'recommended_crops', 'description')
    ordering = ('fertilizer_name',)

    fieldsets = (
        ('General Details', {
            'fields': ('fertilizer_name', 'fertilizer_type', 'description')
        }),
        ('Nutrient Composition (%)', {
            'fields': (
                'nitrogen_percentage', 'phosphorus_percentage',
                'potassium_percentage', 'sulphur_percentage'
            )
        }),
        ('Application Recommendations', {
            'fields': (
                'recommended_crops', 'application_method',
                'dosage_per_hectare', 'application_timing', 'precautions'
            )
        }),
    )
