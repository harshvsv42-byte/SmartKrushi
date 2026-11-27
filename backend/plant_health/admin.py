from django.contrib import admin
from .models import PlantDisease, Pest


@admin.register(PlantDisease)
class PlantDiseaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'disease_name', 'crop_name', 'disease_category', 'severity', 'created_at')
    list_filter = ('disease_category', 'severity', 'crop_name')
    search_fields = ('disease_name', 'crop_name', 'symptoms', 'treatment')
    ordering = ('crop_name', 'disease_name')

    fieldsets = (
        ('Crop & Classification', {
            'fields': ('crop', 'crop_name', 'disease_name', 'disease_category', 'severity', 'image')
        }),
        ('Diagnostic Signs', {
            'fields': ('symptoms', 'affected_plant_parts', 'causes')
        }),
        ('Control & Management', {
            'fields': ('prevention', 'treatment')
        }),
    )


@admin.register(Pest)
class PestAdmin(admin.ModelAdmin):
    list_display = ('id', 'pest_name', 'scientific_name', 'affected_crops', 'created_at')
    search_fields = ('pest_name', 'scientific_name', 'affected_crops', 'symptoms')
    ordering = ('pest_name',)

    fieldsets = (
        ('Pest Information', {
            'fields': ('pest_name', 'scientific_name', 'affected_crops', 'image')
        }),
        ('Damage & Signs', {
            'fields': ('symptoms', 'damage_description')
        }),
        ('Integrated Pest Management (IPM)', {
            'fields': ('prevention', 'management_method')
        }),
    )
