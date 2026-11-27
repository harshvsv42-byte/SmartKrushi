from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Avg, Sum, Max, Min, Count, Q
from .models import Crop, CropRecord, CropData
from .serializers import CropSerializer, CropRecordSerializer, CropDataSerializer


class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['crop_name', 'scientific_name', 'crop_category', 'suitable_soil', 'growing_season']
    ordering_fields = ['crop_name', 'crop_duration_days', 'suitable_ph_min', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        season = self.request.query_params.get('season')
        soil = self.request.query_params.get('soil')
        water = self.request.query_params.get('water')

        if category:
            qs = qs.filter(crop_category__icontains=category)
        if season:
            qs = qs.filter(growing_season__icontains=season)
        if soil:
            qs = qs.filter(suitable_soil__icontains=soil)
        if water:
            qs = qs.filter(water_requirement__iexact=water)
        return qs

    @action(detail=False, methods=['get'], url_path='categories')
    def categories(self, request):
        """
        List crop categories with counts and multilingual names.
        """
        from .serializers import CATEGORY_TRANSLATIONS
        categories_counts = dict(
            Crop.objects.values('crop_category').annotate(count=Count('id')).values_list('crop_category', 'count')
        )
        
        all_choices = [c[0] for c in Crop.CATEGORY_CHOICES]
        result = []
        for cat in all_choices:
            count = categories_counts.get(cat, 0)
            key = cat.lower()
            trans = CATEGORY_TRANSLATIONS.get(key, {})
            result.append({
                "id": key.replace(" ", "_"),
                "name": cat,
                "name_gu": trans.get('gu', cat),
                "name_hi": trans.get('hi', cat),
                "name_en": trans.get('en', cat),
                "crop_count": count
            })
        return Response({
            "total_categories": len(result),
            "categories": result
        })

    @action(detail=False, methods=['get'], url_path='by-season')
    def by_season(self, request):
        season = request.query_params.get('season')
        if not season:
            return Response(
                {"error": "Please provide a 'season' query parameter (e.g. Kharif, Rabi, Zaid, Annual)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        qs = self.get_queryset().filter(growing_season__icontains=season)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'], url_path='suitable-for-soil')
    def suitable_for_soil(self, request):
        soil_type = request.query_params.get('soil_type') or request.query_params.get('soil')
        soil_ph_str = request.query_params.get('soil_ph') or request.query_params.get('ph')

        qs = self.get_queryset()

        if soil_type:
            qs = qs.filter(suitable_soil__icontains=soil_type)

        if soil_ph_str:
            try:
                soil_ph = float(soil_ph_str)
                # Crop is suitable if ph is between min and max (with slight 0.3 tolerance)
                qs = qs.filter(
                    suitable_ph_min__lte=soil_ph + 0.3,
                    suitable_ph_max__gte=soil_ph - 0.3
                )
            except ValueError:
                return Response({"error": "Invalid soil_ph parameter. Must be a float."}, status=status.HTTP_400_BAD_REQUEST)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'], url_path='by-location')
    def by_location(self, request):
        state = request.query_params.get('state')
        district = request.query_params.get('district')
        taluka = request.query_params.get('taluka')

        if not (state or district):
            return Response(
                {"error": "Please provide 'state' and/or 'district' parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find distinct crops from CropRecord for this location
        records = CropRecord.objects.all()
        if state:
            records = records.filter(state__icontains=state)
        if district:
            records = records.filter(district__icontains=district)
        if taluka:
            records = records.filter(taluka__icontains=taluka)

        crop_names = records.values_list('crop_name', flat=True).distinct()

        # Also check legacy CropData table
        legacy_records = CropData.objects.all()
        if state:
            legacy_records = legacy_records.filter(state__icontains=state)
        if district:
            legacy_records = legacy_records.filter(district__icontains=district)
        legacy_names = legacy_records.values_list('crop_name', flat=True).distinct()

        combined_names = set(crop_names).union(set(legacy_names))

        crops = Crop.objects.filter(crop_name__in=combined_names)
        return Response({
            "location": {"state": state, "district": district, "taluka": taluka},
            "total_crops_found": len(combined_names),
            "crop_names": sorted(list(combined_names)),
            "crop_profiles": CropSerializer(crops, many=True).data
        })


class CropRecordViewSet(viewsets.ModelViewSet):
    queryset = CropRecord.objects.all().select_related('crop')
    serializer_class = CropRecordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['state', 'district', 'taluka', 'crop_name', 'growing_season']
    ordering_fields = ['year', 'production_tonnes', 'yield_kg_per_hectare', 'area_hectares']

    def get_queryset(self):
        qs = super().get_queryset()
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        crop_name = self.request.query_params.get('crop') or self.request.query_params.get('crop_name')
        season = self.request.query_params.get('season')
        year = self.request.query_params.get('year')

        if state:
            qs = qs.filter(state__icontains=state)
        if district:
            qs = qs.filter(district__icontains=district)
        if crop_name:
            qs = qs.filter(crop_name__icontains=crop_name)
        if season:
            qs = qs.filter(growing_season__icontains=season)
        if year:
            qs = qs.filter(year=year)
        return qs
