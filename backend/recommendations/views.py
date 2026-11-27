from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import RecommendationRequestSerializer
from .engine import AgriRecommendationEngine
from soil.models import SoilRecord
from weather.models import WeatherRecord


class RecommendationView(APIView):
    permission_classes = [AllowAny]

    def get_and_prepare_inputs(self, request):
        params = request.data if request.method == 'POST' else request.query_params

        soil_ph = None
        nitrogen = None
        phosphorus = None
        potassium = None
        organic_carbon = None
        soil_type = params.get('soil_type')

        soil_id = params.get('soil_id')
        if soil_id:
            soil_rec = SoilRecord.objects.filter(id=soil_id).first()
            if soil_rec:
                soil_ph = soil_rec.soil_ph
                nitrogen = soil_rec.nitrogen
                phosphorus = soil_rec.phosphorus
                potassium = soil_rec.potassium
                organic_carbon = soil_rec.organic_carbon
                soil_type = soil_rec.soil_type

        # Override if explicitly provided
        def to_float(val):
            try:
                return float(val) if val is not None and val != '' else None
            except ValueError:
                return None

        soil_ph = to_float(params.get('soil_ph')) or soil_ph
        nitrogen = to_float(params.get('nitrogen')) or nitrogen
        phosphorus = to_float(params.get('phosphorus')) or phosphorus
        potassium = to_float(params.get('potassium')) or potassium
        organic_carbon = to_float(params.get('organic_carbon')) or organic_carbon

        temperature = to_float(params.get('temperature'))
        rainfall = to_float(params.get('rainfall'))
        humidity = to_float(params.get('humidity'))

        district = params.get('district') or params.get('location')
        if (temperature is None or humidity is None) and district:
            latest_weather = WeatherRecord.objects.filter(district__icontains=district).order_by('-recorded_at').first()
            if latest_weather:
                temperature = temperature if temperature is not None else latest_weather.temperature
                humidity = humidity if humidity is not None else latest_weather.humidity
                rainfall = rainfall if rainfall is not None else latest_weather.rainfall

        return {
            "soil_ph": soil_ph,
            "nitrogen": nitrogen,
            "phosphorus": phosphorus,
            "potassium": potassium,
            "organic_carbon": organic_carbon,
            "temperature": temperature,
            "rainfall": rainfall,
            "humidity": humidity,
            "crop_name": params.get('crop') or params.get('crop_name'),
            "location": district,
            "growing_season": params.get('growing_season') or params.get('season'),
            "soil_type": soil_type,
        }

    def get(self, request):
        inputs = self.get_and_prepare_inputs(request)
        result = AgriRecommendationEngine.evaluate(**inputs)
        return Response(result, status=status.HTTP_200_OK)

    def post(self, request):
        inputs = self.get_and_prepare_inputs(request)
        result = AgriRecommendationEngine.evaluate(**inputs)
        return Response(result, status=status.HTTP_200_OK)


class CropSuitabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        view = RecommendationView()
        inputs = view.get_and_prepare_inputs(request)
        result = AgriRecommendationEngine.evaluate(**inputs)
        return Response({
            "suitable_crops": result["suitable_crops"],
            "soil_suitability": result["soil_suitability"],
            "disclaimer": result["engine_metadata"]["disclaimer"]
        })


class FertilizerGuidanceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        view = RecommendationView()
        inputs = view.get_and_prepare_inputs(request)
        result = AgriRecommendationEngine.evaluate(**inputs)
        return Response({
            "nutrient_deficiencies": result["nutrient_deficiencies"],
            "fertilizer_guidance": result["fertilizer_guidance"],
            "disclaimer": result["engine_metadata"]["disclaimer"]
        })
