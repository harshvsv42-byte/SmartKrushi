from rest_framework import serializers
from .models import WeatherRecord


class WeatherRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherRecord
        fields = [
            'id', 'state', 'district', 'taluka', 'village',
            'latitude', 'longitude',
            'temperature', 'feels_like', 'humidity',
            'rainfall', 'wind_speed', 'wind_direction', 'pressure',
            'weather_condition', 'recorded_at', 'data_source', 'is_manual',
            'created_at'
        ]


class WeatherFetchSerializer(serializers.Serializer):
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
    state = serializers.CharField(required=False, default="Gujarat")
    district = serializers.CharField(required=False, default="Unknown")
    taluka = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    village = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class WeatherManualEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherRecord
        fields = [
            'id', 'state', 'district', 'taluka', 'village',
            'latitude', 'longitude',
            'temperature', 'feels_like', 'humidity',
            'rainfall', 'wind_speed', 'wind_direction', 'pressure',
            'weather_condition', 'recorded_at'
        ]

    def create(self, validated_data):
        validated_data['data_source'] = 'Manual Entry'
        validated_data['is_manual'] = True
        return super().create(validated_data)
