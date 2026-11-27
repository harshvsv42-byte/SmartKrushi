from django.contrib import admin
from .models import FarmerProfile


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'full_name', 'phone_number', 'role', 'state', 'district', 'farm_size', 'created_at')
    list_filter = ('role', 'state', 'district', 'preferred_language')
    search_fields = ('full_name', 'phone_number', 'user__username', 'user__email', 'district', 'village')
    ordering = ('full_name',)

    fieldsets = (
        ('User Association', {
            'fields': ('user', 'role')
        }),
        ('Personal Details', {
            'fields': ('full_name', 'phone_number', 'preferred_language')
        }),
        ('Location & Land Holding', {
            'fields': ('state', 'district', 'taluka', 'village', 'farm_size', 'primary_crops')
        }),
    )
