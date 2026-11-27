from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Avg, Sum, Count, Max, Min
from datetime import timedelta
from django.utils import timezone
from soil.models import SoilRecord
from crops.models import Crop, CropRecord
from weather.models import WeatherRecord
from fertilizers.models import Fertilizer
from plant_health.models import PlantDisease, Pest
from locations.models import District, State
from accounts.models import FarmerProfile


class DashboardSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        state = request.query_params.get('state', 'Gujarat')

        total_farmers = FarmerProfile.objects.count()
        total_soil_tests = SoilRecord.objects.count()
        total_crops_cataloged = Crop.objects.count()
        total_crop_records = CropRecord.objects.count()
        total_weather_logs = WeatherRecord.objects.count()
        total_fertilizers = Fertilizer.objects.count()
        total_diseases = PlantDisease.objects.count()
        total_pests = Pest.objects.count()

        # Soil summary
        avg_soil_ph = SoilRecord.objects.aggregate(avg=Avg('soil_ph'))['avg']

        # Weather current
        recent_weather = WeatherRecord.objects.order_by('-recorded_at').first()

        return Response({
            "overview": {
                "active_farmers": total_farmers,
                "soil_records_analyzed": total_soil_tests,
                "crops_supported": total_crops_cataloged,
                "crop_production_data_points": total_crop_records,
                "weather_observations": total_weather_logs,
                "fertilizers_listed": total_fertilizers,
                "documented_diseases": total_diseases,
                "documented_pests": total_pests
            },
            "highlights": {
                "average_soil_ph": round(avg_soil_ph, 2) if avg_soil_ph else None,
                "primary_state": state,
                "latest_weather": {
                    "location": f"{recent_weather.district}, {recent_weather.state}" if recent_weather else None,
                    "temperature": recent_weather.temperature if recent_weather else None,
                    "condition": recent_weather.weather_condition if recent_weather else None,
                    "recorded_at": recent_weather.recorded_at if recent_weather else None
                }
            },
            "system_health": "Active & Operational"
        })


class DashboardSoilStatisticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = SoilRecord.objects.all()
        district = request.query_params.get('district')
        if district:
            qs = qs.filter(district__icontains=district)

        total = qs.count()
        soil_types = list(qs.values('soil_type').annotate(count=Count('id')).order_by('-count'))
        districts = list(qs.values('district').annotate(count=Count('id')).order_by('-count')[:10])

        averages = qs.aggregate(
            avg_ph=Avg('soil_ph'),
            avg_n=Avg('nitrogen'),
            avg_p=Avg('phosphorus'),
            avg_k=Avg('potassium'),
            avg_oc=Avg('organic_carbon'),
            avg_ec=Avg('electrical_conductivity')
        )

        return Response({
            "total_soil_records": total,
            "soil_type_distribution": soil_types,
            "district_distribution": districts,
            "regional_averages": {
                "ph": round(averages['avg_ph'], 2) if averages['avg_ph'] is not None else None,
                "nitrogen_kg_ha": round(averages['avg_n'], 1) if averages['avg_n'] is not None else None,
                "phosphorus_kg_ha": round(averages['avg_p'], 1) if averages['avg_p'] is not None else None,
                "potassium_kg_ha": round(averages['avg_k'], 1) if averages['avg_k'] is not None else None,
                "organic_carbon_pct": round(averages['avg_oc'], 2) if averages['avg_oc'] is not None else None,
                "electrical_conductivity_dsm": round(averages['avg_ec'], 2) if averages['avg_ec'] is not None else None,
            }
        })


class DashboardCropStatisticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        crops_by_season = list(Crop.objects.values('growing_season').annotate(count=Count('id')).order_by('-count'))
        crops_by_category = list(Crop.objects.values('crop_category').annotate(count=Count('id')).order_by('-count'))

        # Production record metrics
        production_qs = CropRecord.objects.all()
        top_crops_by_production = list(
            production_qs.values('crop_name')
            .annotate(total_production=Sum('production_tonnes'), avg_yield=Avg('yield_kg_per_hectare'))
            .order_by('-total_production')[:10]
        )

        top_districts_by_area = list(
            production_qs.values('district')
            .annotate(total_area=Sum('area_hectares'))
            .order_by('-total_area')[:10]
        )

        return Response({
            "total_master_crops": Crop.objects.count(),
            "crops_by_season": crops_by_season,
            "crops_by_category": crops_by_category,
            "top_crops_by_production": top_crops_by_production,
            "top_districts_by_cultivated_area": top_districts_by_area
        })


class DashboardWeatherStatisticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        district = request.query_params.get('district')
        qs = WeatherRecord.objects.all()
        if district:
            qs = qs.filter(district__icontains=district)

        now = timezone.now()
        past_7_days = now - timedelta(days=7)
        past_30_days = now - timedelta(days=30)

        week_stats = qs.filter(recorded_at__gte=past_7_days).aggregate(
            avg_temp=Avg('temperature'),
            min_temp=Min('temperature'),
            max_temp=Max('temperature'),
            avg_humidity=Avg('humidity'),
            total_rainfall=Sum('rainfall'),
            max_wind=Max('wind_speed')
        )

        condition_distribution = list(
            qs.values('weather_condition')
            .annotate(count=Count('id'))
            .order_by('-count')[:8]
        )

        data_source_distribution = list(
            qs.values('data_source')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        return Response({
            "total_weather_records": qs.count(),
            "filtered_district": district or "All",
            "weekly_summary": {
                "avg_temperature": round(week_stats['avg_temp'], 1) if week_stats['avg_temp'] is not None else None,
                "min_temperature": week_stats['min_temp'],
                "max_temperature": week_stats['max_temp'],
                "avg_humidity": round(week_stats['avg_humidity'], 1) if week_stats['avg_humidity'] is not None else None,
                "total_rainfall_mm": round(week_stats['total_rainfall'], 2) if week_stats['total_rainfall'] is not None else 0.0,
                "max_wind_speed_kmh": week_stats['max_wind']
            },
            "weather_conditions": condition_distribution,
            "source_breakdown": data_source_distribution
        })
