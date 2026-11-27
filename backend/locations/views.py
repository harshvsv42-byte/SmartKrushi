from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import math
from .models import State, District, Taluka, Village
from .serializers import StateSerializer, DistrictSerializer, TalukaSerializer, VillageSerializer


class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all().prefetch_related('districts')
    serializer_class = StateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['state_name']
    ordering_fields = ['state_name', 'created_at']


class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all().select_related('state').prefetch_related('talukas')
    serializer_class = DistrictSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['district_name', 'state__state_name']
    ordering_fields = ['district_name', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        state_id = self.request.query_params.get('state_id') or self.request.query_params.get('state')
        state_name = self.request.query_params.get('state_name')

        if state_id:
            if state_id.isdigit():
                qs = qs.filter(state_id=state_id)
            else:
                qs = qs.filter(state__state_name__iexact=state_id)
        if state_name:
            qs = qs.filter(state__state_name__icontains=state_name)
        return qs

    @action(detail=False, methods=['get', 'post'], url_path='locate')
    def locate(self, request):
        """
        Resolve device GPS coordinates to nearest district and state.
        """
        lat = (
            request.query_params.get('latitude') or
            request.query_params.get('lat') or
            (request.data.get('latitude') if isinstance(request.data, dict) else None)
        )
        lon = (
            request.query_params.get('longitude') or
            request.query_params.get('lon') or
            (request.data.get('longitude') if isinstance(request.data, dict) else None)
        )

        if lat is None or lon is None:
            return Response(
                {"error": "Latitude and longitude are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lat_f = float(lat)
            lon_f = float(lon)
        except (ValueError, TypeError):
            return Response(
                {"error": "Latitude and longitude must be valid floating numbers."},
                status=status.HTTP_400_BAD_REQUEST
            )

        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0  # Earth radius in km
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        districts = District.objects.all().select_related('state')
        best_district = None
        min_distance = float('inf')

        for d in districts:
            if d.latitude is not None and d.longitude is not None:
                dist = haversine(lat_f, lon_f, d.latitude, d.longitude)
                if dist < min_distance:
                    min_distance = dist
                    best_district = d

        if not best_district:
            best_district = districts.first()
            min_distance = 0.0

        if not best_district:
            return Response({"error": "No district found in database."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "latitude": lat_f,
            "longitude": lon_f,
            "district": best_district.district_name,
            "district_id": best_district.id,
            "state": best_district.state.state_name if best_district.state else "Gujarat",
            "state_id": best_district.state.id if best_district.state else 1,
            "distance_km": round(min_distance, 2)
        })


class TalukaViewSet(viewsets.ModelViewSet):
    queryset = Taluka.objects.all().select_related('district', 'district__state').prefetch_related('villages')
    serializer_class = TalukaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['taluka_name', 'district__district_name', 'district__state__state_name']
    ordering_fields = ['taluka_name', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        district_id = self.request.query_params.get('district_id') or self.request.query_params.get('district')
        district_name = self.request.query_params.get('district_name')
        state_name = self.request.query_params.get('state_name')

        if district_id:
            if district_id.isdigit():
                qs = qs.filter(district_id=district_id)
            else:
                qs = qs.filter(district__district_name__iexact=district_id)
        if district_name:
            qs = qs.filter(district__district_name__icontains=district_name)
        if state_name:
            qs = qs.filter(district__state__state_name__icontains=state_name)
        return qs


class VillageViewSet(viewsets.ModelViewSet):
    queryset = Village.objects.all().select_related('taluka', 'taluka__district', 'taluka__district__state')
    serializer_class = VillageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'village_name', 'taluka__taluka_name',
        'taluka__district__district_name', 'taluka__district__state__state_name'
    ]
    ordering_fields = ['village_name', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        taluka_id = self.request.query_params.get('taluka_id') or self.request.query_params.get('taluka')
        taluka_name = self.request.query_params.get('taluka_name')
        district_name = self.request.query_params.get('district_name')

        if taluka_id:
            if taluka_id.isdigit():
                qs = qs.filter(taluka_id=taluka_id)
            else:
                qs = qs.filter(taluka__taluka_name__iexact=taluka_id)
        if taluka_name:
            qs = qs.filter(taluka__taluka_name__icontains=taluka_name)
        if district_name:
            qs = qs.filter(taluka__district__district_name__icontains=district_name)
        return qs
