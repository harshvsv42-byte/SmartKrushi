from django.contrib import admin
from .models import CropData, Crop, CropRecord


@admin.register(CropData)
class CropDataAdmin(admin.ModelAdmin):
    list_display = (
        'crop_record_id',
        'state',
        'district',
        'crop_name',
        'growing_season',
        'crop_duration_days',
        'illustrative_yield_kg_ha',
    )
    search_fields = ('state', 'district', 'crop_name')
    list_filter = ('state', 'district', 'growing_season')
    ordering = ('state', 'district', 'crop_name')


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'crop_name', 'scientific_name', 'crop_category',
        'growing_season', 'crop_duration_days', 'suitable_soil',
        'suitable_ph_min', 'suitable_ph_max', 'water_requirement'
    )
    list_filter = ('crop_category', 'growing_season', 'water_requirement')
    search_fields = ('crop_name', 'scientific_name', 'suitable_soil', 'crop_description')
    ordering = ('crop_name',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('crop_name', 'scientific_name', 'crop_category', 'crop_description', 'image')
        }),
        ('Growing Requirements', {
            'fields': (
                'growing_season', 'crop_duration_days', 'suitable_soil',
                'suitable_ph_min', 'suitable_ph_max', 'temperature_min', 'temperature_max',
                'water_requirement', 'rainfall_requirement', 'fertilizer_requirement'
            )
        }),
        ('Agronomic Practice', {
            'fields': ('sowing_period', 'harvesting_period', 'irrigation_method', 'common_diseases')
        }),
    )


@admin.register(CropRecord)
class CropRecordAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'state', 'district', 'taluka', 'crop_name',
        'growing_season', 'area_hectares', 'production_tonnes',
        'yield_kg_per_hectare', 'year', 'data_source'
    )
    list_filter = ('year', 'growing_season', 'state', 'district')
    search_fields = ('state', 'district', 'taluka', 'crop_name')
    ordering = ('-year', 'state', 'district', 'crop_name')