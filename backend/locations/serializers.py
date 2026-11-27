from rest_framework import serializers
from .models import State, District, Taluka, Village


class VillageSerializer(serializers.ModelSerializer):
    taluka_name = serializers.ReadOnlyField(source='taluka.taluka_name')
    district_name = serializers.ReadOnlyField(source='taluka.district.district_name')
    state_name = serializers.ReadOnlyField(source='taluka.district.state.state_name')

    class Meta:
        model = Village
        fields = [
            'id', 'taluka', 'taluka_name', 'district_name', 'state_name',
            'village_name', 'latitude', 'longitude', 'created_at', 'updated_at'
        ]


class TalukaSerializer(serializers.ModelSerializer):
    district_name = serializers.ReadOnlyField(source='district.district_name')
    state_name = serializers.ReadOnlyField(source='district.state.state_name')
    village_count = serializers.IntegerField(source='villages.count', read_only=True)

    class Meta:
        model = Taluka
        fields = [
            'id', 'district', 'district_name', 'state_name',
            'taluka_name', 'latitude', 'longitude', 'village_count',
            'created_at', 'updated_at'
        ]


class DistrictSerializer(serializers.ModelSerializer):
    state_name = serializers.ReadOnlyField(source='state.state_name')
    taluka_count = serializers.IntegerField(source='talukas.count', read_only=True)

    class Meta:
        model = District
        fields = [
            'id', 'state', 'state_name', 'district_name',
            'latitude', 'longitude', 'taluka_count',
            'created_at', 'updated_at'
        ]


class StateSerializer(serializers.ModelSerializer):
    district_count = serializers.IntegerField(source='districts.count', read_only=True)

    class Meta:
        model = State
        fields = [
            'id', 'state_name', 'latitude', 'longitude',
            'district_count', 'created_at', 'updated_at'
        ]
