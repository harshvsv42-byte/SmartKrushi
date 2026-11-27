from rest_framework import serializers
from .models import SoilRecord, District


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'


class SoilRecordSerializer(serializers.ModelSerializer):
    ph_category = serializers.ReadOnlyField()

    class Meta:
        model = SoilRecord
        fields = [
            'id', 'state', 'district', 'taluka', 'village',
            'soil_name', 'soil_type', 'soil_texture', 'soil_ph', 'ph_category',
            'electrical_conductivity', 'organic_carbon',
            'nitrogen', 'phosphorus', 'potassium',
            'sulphur', 'zinc', 'iron', 'boron',
            'sand_percentage', 'silt_percentage', 'clay_percentage',
            'sample_date', 'data_source', 'remarks',
            'created_at', 'updated_at'
        ]

    def validate_soil_ph(self, value):
        if value < 0.0 or value > 14.0:
            raise serializers.ValidationError("Soil pH must be between 0.0 and 14.0.")
        return value

    def validate(self, attrs):
        sand = attrs.get('sand_percentage')
        silt = attrs.get('silt_percentage')
        clay = attrs.get('clay_percentage')
        if sand is not None and silt is not None and clay is not None:
            total = sand + silt + clay
            if abs(total - 100.0) > 1.5:
                raise serializers.ValidationError({
                    "non_field_errors": [f"Sand, silt, and clay percentages should sum to 100% (currently {total:.1f}%)."]
                })
        return attrs


class SoilAnalysisSerializer(serializers.Serializer):
    soil_id = serializers.IntegerField(required=False)
    soil_ph = serializers.FloatField(required=False)
    nitrogen = serializers.FloatField(required=False)
    phosphorus = serializers.FloatField(required=False)
    potassium = serializers.FloatField(required=False)
    organic_carbon = serializers.FloatField(required=False)
    electrical_conductivity = serializers.FloatField(required=False)
