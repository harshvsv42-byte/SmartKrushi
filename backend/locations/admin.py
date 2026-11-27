from django.contrib import admin
from .models import State, District, Taluka, Village


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('id', 'state_name', 'latitude', 'longitude', 'created_at')
    search_fields = ('state_name',)
    ordering = ('state_name',)


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('id', 'district_name', 'state', 'latitude', 'longitude', 'created_at')
    list_filter = ('state',)
    search_fields = ('district_name', 'state__state_name')
    ordering = ('state__state_name', 'district_name')


@admin.register(Taluka)
class TalukaAdmin(admin.ModelAdmin):
    list_display = ('id', 'taluka_name', 'district', 'get_state', 'created_at')
    list_filter = ('district__state', 'district')
    search_fields = ('taluka_name', 'district__district_name')
    ordering = ('district__state__state_name', 'district__district_name', 'taluka_name')

    @admin.display(description='State', ordering='district__state__state_name')
    def get_state(self, obj):
        return obj.district.state.state_name


@admin.register(Village)
class VillageAdmin(admin.ModelAdmin):
    list_display = ('id', 'village_name', 'taluka', 'get_district', 'get_state', 'created_at')
    list_filter = ('taluka__district__state', 'taluka__district')
    search_fields = ('village_name', 'taluka__taluka_name', 'taluka__district__district_name')
    ordering = ('taluka__taluka_name', 'village_name')

    @admin.display(description='District', ordering='taluka__district__district_name')
    def get_district(self, obj):
        return obj.taluka.district.district_name

    @admin.display(description='State', ordering='taluka__district__state__state_name')
    def get_state(self, obj):
        return obj.taluka.district.state.state_name
