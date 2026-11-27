from django.contrib import admin
from .models import District, SoilRecord


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('district_id', 'state', 'district_name')
    search_fields = ('state', 'district_name')
    ordering = ('district_name',)


@admin.register(SoilRecord)
class SoilRecordAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'state', 'district', 'taluka', 'village',
        'soil_type', 'soil_ph', 'nitrogen', 'phosphorus', 'potassium',
        'sample_date', 'data_source'
    )
    list_filter = ('soil_type', 'state', 'district', 'sample_date')
    search_fields = ('state', 'district', 'taluka', 'village', 'soil_name', 'remarks')
    date_hierarchy = 'sample_date'
    ordering = ('-sample_date', '-created_at')

    fieldsets = (
        ('Location Information', {
            'fields': ('state', 'district', 'taluka', 'village')
        }),
        ('Soil Classification', {
            'fields': ('soil_name', 'soil_type', 'soil_texture')
        }),
        ('Chemical Properties', {
            'fields': ('soil_ph', 'electrical_conductivity', 'organic_carbon')
        }),
        ('Macronutrients (kg/ha)', {
            'fields': ('nitrogen', 'phosphorus', 'potassium')
        }),
        ('Micronutrients (ppm)', {
            'fields': ('sulphur', 'zinc', 'iron', 'boron')
        }),
        ('Physical Composition (%)', {
            'fields': ('sand_percentage', 'silt_percentage', 'clay_percentage')
        }),
        ('Metadata & Observations', {
            'fields': ('sample_date', 'data_source', 'remarks')
        }),
    )