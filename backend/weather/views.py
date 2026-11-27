from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Avg, Max, Min, Sum
from datetime import datetime, timedelta
from .models import WeatherRecord
from .serializers import WeatherRecordSerializer, WeatherFetchSerializer, WeatherManualEntrySerializer
from .services import WeatherService


class WeatherViewSet(viewsets.ModelViewSet):
    queryset = WeatherRecord.objects.all()
    serializer_class = WeatherRecordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['state', 'district', 'taluka', 'village', 'weather_condition']
    ordering_fields = ['recorded_at', 'temperature', 'humidity', 'rainfall']

    def get_queryset(self):
        qs = super().get_queryset()
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        taluka = self.request.query_params.get('taluka')
        is_manual = self.request.query_params.get('is_manual')
        from_date = self.request.query_params.get('from_date')
        to_date = self.request.query_params.get('to_date')

        if state:
            qs = qs.filter(state__icontains=state)
        if district:
            qs = qs.filter(district__icontains=district)
        if taluka:
            qs = qs.filter(taluka__icontains=taluka)
        if is_manual is not None:
            qs = qs.filter(is_manual=is_manual.lower() in ['true', '1'])
        if from_date:
            qs = qs.filter(recorded_at__date__gte=from_date)
        if to_date:
            qs = qs.filter(recorded_at__date__lte=to_date)
        return qs

    @action(detail=False, methods=['get'], url_path='current')
    def current(self, request):
        lat = request.query_params.get('latitude') or request.query_params.get('lat')
        lon = request.query_params.get('longitude') or request.query_params.get('lon')
        district = request.query_params.get('district')

        # 1. Try finding recent record in DB
        qs = WeatherRecord.objects.all()
        if district:
            qs = qs.filter(district__icontains=district)
        elif lat and lon:
            try:
                lat_f = round(float(lat), 3)
                lon_f = round(float(lon), 3)
                qs = qs.filter(
                    latitude__gte=lat_f - 0.1, latitude__lte=lat_f + 0.1,
                    longitude__gte=lon_f - 0.1, longitude__lte=lon_f + 0.1
                )
            except ValueError:
                pass

        latest = qs.order_by('-recorded_at').first()

        # If lat and lon provided and latest is older than 2 hours (or none exists), fetch fresh from API
        if lat and lon:
            try:
                lat_f = float(lat)
                lon_f = float(lon)
                needs_fetch = False
                if not latest:
                    needs_fetch = True
                else:
                    from django.utils import timezone
                    if (timezone.now() - latest.recorded_at) > timedelta(hours=2):
                        needs_fetch = True

                if needs_fetch:
                    state = request.query_params.get('state', 'Gujarat')
                    district_val = district or "Unknown"
                    result = WeatherService.fetch_live_weather(
                        latitude=lat_f,
                        longitude=lon_f,
                        state=state,
                        district=district_val
                    )
                    if result.get("success"):
                        return Response(result["data"])
            except Exception as e:
                pass

        if latest:
            return Response(WeatherRecordSerializer(latest).data)

        return Response(
            {"message": "No weather record found. Provide 'latitude' and 'longitude' to fetch live weather."},
            status=status.HTTP_404_NOT_FOUND
        )

    @action(detail=False, methods=['get'], url_path='details')
    def details(self, request):
        """
        Return comprehensive weather data: current live conditions + 7-day forecast.
        """
        lat = request.query_params.get('latitude') or request.query_params.get('lat') or 23.0225
        lon = request.query_params.get('longitude') or request.query_params.get('lon') or 72.5714
        district = request.query_params.get('district') or 'Ahmedabad'
        state = request.query_params.get('state') or 'Gujarat'

        try:
            lat_f = float(lat)
            lon_f = float(lon)
        except (ValueError, TypeError):
            lat_f, lon_f = 23.0225, 72.5714

        live_res = WeatherService.fetch_live_weather(lat_f, lon_f, state=state, district=district)
        current_data = live_res.get("data") if live_res.get("success") else None

        forecast_res = WeatherService.fetch_forecast(lat_f, lon_f, days=7)
        forecast_list = forecast_res.get("forecast", []) if forecast_res.get("success") else []

        if not current_data:
            latest = WeatherRecord.objects.filter(district__icontains=district).order_by('-recorded_at').first()
            if latest:
                current_data = WeatherRecordSerializer(latest).data

        return Response({
            "success": True,
            "location": {
                "district": district,
                "state": state,
                "latitude": lat_f,
                "longitude": lon_f,
            },
            "current": current_data,
            "forecast": forecast_list
        })

    @action(detail=False, methods=['get'], url_path='forecast')
    def forecast(self, request):
        lat = request.query_params.get('latitude') or request.query_params.get('lat')
        lon = request.query_params.get('longitude') or request.query_params.get('lon')
        days = request.query_params.get('days', 7)

        if not (lat and lon):
            return Response(
                {"error": "Query parameters 'latitude' and 'longitude' are required for weather forecast."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lat_f = float(lat)
            lon_f = float(lon)
        except ValueError:
            return Response({"error": "Latitude and longitude must be valid floating point numbers."}, status=status.HTTP_400_BAD_REQUEST)

        result = WeatherService.fetch_forecast(lat_f, lon_f, days=days)
        if not result.get("success"):
            return Response(result, status=status.HTTP_502_BAD_GATEWAY)

        return Response(result)

    @action(detail=False, methods=['get'], url_path='history')
    def history(self, request):
        qs = self.get_queryset()
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['post'], url_path='fetch')
    def fetch_weather(self, request):
        serializer = WeatherFetchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        result = WeatherService.fetch_live_weather(
            latitude=data['latitude'],
            longitude=data['longitude'],
            state=data.get('state', 'Gujarat'),
            district=data.get('district', 'Unknown'),
            taluka=data.get('taluka'),
            village=data.get('village'),
        )

        if not result.get("success"):
            return Response(result, status=status.HTTP_502_BAD_GATEWAY)

        http_status = status.HTTP_201_CREATED if result.get("created") else status.HTTP_200_OK
        return Response(result, status=http_status)

    @action(detail=False, methods=['post'], url_path='manual-entry')
    def manual_entry(self, request):
        serializer = WeatherManualEntrySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        record = serializer.save()
        return Response(WeatherRecordSerializer(record).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='summary')
    def weather_summary(self, request):
        """
        Daily and weekly weather summaries for a district or coordinates.
        """
        district = request.query_params.get('district')
        qs = self.get_queryset()
        if district:
            qs = qs.filter(district__icontains=district)

        from django.utils import timezone
        now = timezone.now()
        last_7_days = now - timedelta(days=7)
        last_24_hours = now - timedelta(hours=24)

        daily_agg = qs.filter(recorded_at__gte=last_24_hours).aggregate(
            avg_temp=Avg('temperature'),
            min_temp=Min('temperature'),
            max_temp=Max('temperature'),
            avg_humidity=Avg('humidity'),
            total_rainfall=Sum('rainfall'),
            max_wind=Max('wind_speed')
        )

        weekly_agg = qs.filter(recorded_at__gte=last_7_days).aggregate(
            avg_temp=Avg('temperature'),
            min_temp=Min('temperature'),
            max_temp=Max('temperature'),
            avg_humidity=Avg('humidity'),
            total_rainfall=Sum('rainfall'),
            max_wind=Max('wind_speed')
        )

        return Response({
            "district": district or "All locations",
            "last_24_hours": {
                "avg_temperature": round(daily_agg['avg_temp'], 1) if daily_agg['avg_temp'] is not None else None,
                "min_temperature": daily_agg['min_temp'],
                "max_temperature": daily_agg['max_temp'],
                "avg_humidity": round(daily_agg['avg_humidity'], 1) if daily_agg['avg_humidity'] is not None else None,
                "total_rainfall_mm": round(daily_agg['total_rainfall'], 2) if daily_agg['total_rainfall'] is not None else 0.0,
                "max_wind_speed_kmh": daily_agg['max_wind']
            },
            "last_7_days": {
                "avg_temperature": round(weekly_agg['avg_temp'], 1) if weekly_agg['avg_temp'] is not None else None,
                "min_temperature": weekly_agg['min_temp'],
                "max_temperature": weekly_agg['max_temp'],
                "avg_humidity": round(weekly_agg['avg_humidity'], 1) if weekly_agg['avg_humidity'] is not None else None,
                "total_rainfall_mm": round(weekly_agg['total_rainfall'], 2) if weekly_agg['total_rainfall'] is not None else 0.0,
                "max_wind_speed_kmh": weekly_agg['max_wind']
            }
        })
