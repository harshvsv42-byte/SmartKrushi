from rest_framework import serializers


class RecommendationRequestSerializer(serializers.Serializer):
    soil_ph = serializers.FloatField(required=False, min_value=0.0, max_value=14.0)
    nitrogen = serializers.FloatField(required=False, min_value=0.0)
    phosphorus = serializers.FloatField(required=False, min_value=0.0)
    potassium = serializers.FloatField(required=False, min_value=0.0)
    organic_carbon = serializers.FloatField(required=False, min_value=0.0, max_value=100.0)

    temperature = serializers.FloatField(required=False)
    rainfall = serializers.FloatField(required=False, min_value=0.0)
    humidity = serializers.FloatField(required=False, min_value=0.0, max_value=100.0)

    crop = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    growing_season = serializers.CharField(required=False, allow_blank=True)
    soil_type = serializers.CharField(required=False, allow_blank=True)

    # Optional lookup shortcuts
    soil_id = serializers.IntegerField(required=False)
    district = serializers.CharField(required=False, allow_blank=True)
