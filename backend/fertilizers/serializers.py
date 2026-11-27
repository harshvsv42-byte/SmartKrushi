from rest_framework import serializers
from .models import Fertilizer


class FertilizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fertilizer
        fields = '__all__'


class FertilizerRecommendationQuerySerializer(serializers.Serializer):
    crop_name = serializers.CharField(required=False)
    soil_id = serializers.IntegerField(required=False)
    nitrogen = serializers.FloatField(required=False)
    phosphorus = serializers.FloatField(required=False)
    potassium = serializers.FloatField(required=False)
    soil_ph = serializers.FloatField(required=False)
    organic_carbon = serializers.FloatField(required=False)
