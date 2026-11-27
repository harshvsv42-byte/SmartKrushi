from rest_framework import serializers
from .models import PlantDisease, Pest


class PlantDiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantDisease
        fields = '__all__'


class PestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pest
        fields = '__all__'


class AIDiseaseDetectionSerializer(serializers.Serializer):
    image = serializers.ImageField(required=True)
    crop_name = serializers.CharField(required=False)
