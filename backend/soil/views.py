from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Avg, Min, Max, Count
import math
from .models import SoilRecord
from .serializers import SoilRecordSerializer
from locations.models import District as LocDistrict
from crops.models import Crop
from recommendations.engine import AgriRecommendationEngine


class SoilRecordViewSet(viewsets.ModelViewSet):
    queryset = SoilRecord.objects.all()
    serializer_class = SoilRecordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['state', 'district', 'taluka', 'village', 'soil_name', 'soil_type']
    ordering_fields = ['sample_date', 'soil_ph', 'nitrogen', 'phosphorus', 'potassium', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        taluka = self.request.query_params.get('taluka')
        village = self.request.query_params.get('village')
        soil_type = self.request.query_params.get('soil_type')
        min_ph = self.request.query_params.get('min_ph')
        max_ph = self.request.query_params.get('max_ph')

        if state:
            qs = qs.filter(state__icontains=state)
        if district:
            qs = qs.filter(district__icontains=district)
        if taluka:
            qs = qs.filter(taluka__icontains=taluka)
        if village:
            qs = qs.filter(village__icontains=village)
        if soil_type:
            qs = qs.filter(soil_type__icontains=soil_type)
        if min_ph:
            qs = qs.filter(soil_ph__gte=float(min_ph))
        if max_ph:
            qs = qs.filter(soil_ph__lte=float(max_ph))
        return qs

    @action(detail=False, methods=['get'], url_path='by-coordinates')
    def by_coordinates(self, request):
        """
        Fetch location-based soil details using GPS coordinates or district name.
        Returns comprehensive soil data, ICAR nutrient ratings, physical properties,
        suitable crops, and agronomic recommendations.
        """
        lat = request.query_params.get('latitude') or request.query_params.get('lat')
        lon = request.query_params.get('longitude') or request.query_params.get('lon')
        district_param = request.query_params.get('district')

        resolved_district = None
        resolved_state = "Gujarat"
        lat_f = None
        lon_f = None

        if lat and lon:
            try:
                lat_f = float(lat)
                lon_f = float(lon)
            except (ValueError, TypeError):
                pass

        if lat_f is not None and lon_f is not None:
            def haversine(lat1, lon1, lat2, lon2):
                R = 6371.0
                dlat = math.radians(lat2 - lat1)
                dlon = math.radians(lon2 - lon1)
                a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                return R * c

            districts = LocDistrict.objects.all().select_related('state')
            best_district = None
            min_dist = float('inf')
            for d in districts:
                if d.latitude is not None and d.longitude is not None:
                    dist = haversine(lat_f, lon_f, d.latitude, d.longitude)
                    if dist < min_dist:
                        min_dist = dist
                        best_district = d

            if best_district:
                resolved_district = best_district.district_name
                resolved_state = best_district.state.state_name if best_district.state else "Gujarat"

        if not resolved_district:
            resolved_district = district_param or "Ahmedabad"

        # Find matching SoilRecord
        soil_record = SoilRecord.objects.filter(district__icontains=resolved_district).first()
        if not soil_record:
            # Fallback to state or first available record
            soil_record = SoilRecord.objects.filter(state__icontains=resolved_state).first() or SoilRecord.objects.first()

        if not soil_record:
            return Response({"error": "No soil record found."}, status=status.HTTP_404_NOT_FOUND)

        # Scientific ratings based on ICAR / Indian soil standards
        n = soil_record.nitrogen
        p = soil_record.phosphorus
        k = soil_record.potassium
        ph = soil_record.soil_ph
        oc = soil_record.organic_carbon
        ec = soil_record.electrical_conductivity

        n_status = "Low (<280 kg/ha)" if (n and n < 280) else ("Medium (280-560 kg/ha)" if (n and n <= 560) else "High (>560 kg/ha)") if n else "Not Tested"
        p_status = "Low (<10 kg/ha)" if (p and p < 10) else ("Medium (10-25 kg/ha)" if (p and p <= 25) else "High (>25 kg/ha)") if p else "Not Tested"
        k_status = "Low (<110 kg/ha)" if (k and k < 110) else ("Medium (110-280 kg/ha)" if (k and k <= 280) else "High (>280 kg/ha)") if k else "Not Tested"

        if ph < 6.0:
            ph_status = "Acidic (pH < 6.0)"
        elif 6.0 <= ph <= 7.5:
            ph_status = "Neutral / Optimal (6.0 - 7.5)"
        elif 7.5 < ph <= 8.5:
            ph_status = "Moderately Alkaline (7.5 - 8.5)"
        else:
            ph_status = "Strongly Alkaline / Sodic (> 8.5)"

        oc_status = "Low (<0.5%)" if (oc and oc < 0.5) else ("Medium (0.5-0.75%)" if (oc and oc <= 0.75) else "High (>0.75%)") if oc else "Not Tested"

        # Physical and drainage properties based on soil type
        st_lower = (soil_record.soil_type or "").lower()
        if "black" in st_lower or "clay" in st_lower:
            drainage = "Slow to Moderate (Heavy Clay Structure)"
            water_holding_capacity = "High (180 - 220 mm/m)"
            estimated_moisture = 38.0
            fertility_level = "High"
        elif "sandy" in st_lower or "desert" in st_lower:
            drainage = "Rapid / Highly Permeable"
            water_holding_capacity = "Low (60 - 100 mm/m)"
            estimated_moisture = 18.0
            fertility_level = "Low to Moderate"
        elif "alluvial" in st_lower or "loam" in st_lower:
            drainage = "Well Drained (Ideal Loamy Porosity)"
            water_holding_capacity = "Medium to High (140 - 180 mm/m)"
            estimated_moisture = 32.0
            fertility_level = "Very High"
        elif "laterite" in st_lower or "red" in st_lower:
            drainage = "Good to Excessive"
            water_holding_capacity = "Moderate (100 - 130 mm/m)"
            estimated_moisture = 24.0
            fertility_level = "Moderate"
        else:
            drainage = "Moderate"
            water_holding_capacity = "Moderate (120 - 160 mm/m)"
            estimated_moisture = 28.0
            fertility_level = "Moderate"

        # Suitable crops from Crop database
        suitable_crops_qs = Crop.objects.filter(
            suitable_ph_min__lte=ph + 0.5,
            suitable_ph_max__gte=ph - 0.5
        )
        if soil_record.soil_type:
            soil_crop_matches = suitable_crops_qs.filter(suitable_soil__icontains=soil_record.soil_type)
            if soil_crop_matches.exists():
                suitable_crops_qs = soil_crop_matches

        suitable_crops_list = [
            {
                "id": c.id,
                "crop_name": c.crop_name,
                "crop_category": c.crop_category,
                "growing_season": c.growing_season,
                "crop_duration_days": c.crop_duration_days,
            }
            for c in suitable_crops_qs[:8]
        ]

        # Recommendations via AgriRecommendationEngine
        rec_eval = AgriRecommendationEngine.evaluate(
            soil_ph=ph,
            nitrogen=n,
            phosphorus=p,
            potassium=k,
            organic_carbon=oc,
            soil_type=soil_record.soil_type,
            location=soil_record.district
        )

        return Response({
            "success": True,
            "district": resolved_district or soil_record.district,
            "state": resolved_state or soil_record.state,
            "location": {
                "latitude": lat_f,
                "longitude": lon_f,
                "district": resolved_district or soil_record.district,
                "state": resolved_state or soil_record.state,
                "taluka": soil_record.taluka or "",
                "village": soil_record.village or "",
            },
            "soil_id": soil_record.id,
            "soil_type": soil_record.soil_type,
            "soil_classification": soil_record.soil_name or f"{soil_record.soil_type} Soil",
            "soil_texture": soil_record.soil_texture or ("Clay Loam" if "black" in st_lower else "Sandy Loam"),
            "soil_ph": ph,
            "ph_category": soil_record.ph_category,
            "ph_status": ph_status,
            "nutrients": {
                "nitrogen": {"value": n, "unit": "kg/ha", "status": n_status},
                "phosphorus": {"value": p, "unit": "kg/ha", "status": p_status},
                "potassium": {"value": k, "unit": "kg/ha", "status": k_status},
                "organic_carbon": {"value": oc, "unit": "%", "status": oc_status},
                "electrical_conductivity": {"value": ec, "unit": "dS/m"},
                "sulphur": {"value": soil_record.sulphur, "unit": "ppm"},
                "zinc": {"value": soil_record.zinc, "unit": "ppm"},
                "iron": {"value": soil_record.iron, "unit": "ppm"},
                "boron": {"value": soil_record.boron, "unit": "ppm"},
            },
            "physical_composition": {
                "sand_percentage": soil_record.sand_percentage,
                "silt_percentage": soil_record.silt_percentage,
                "clay_percentage": soil_record.clay_percentage,
            },
            "moisture_percentage": estimated_moisture,
            "soil_fertility": fertility_level,
            "water_holding_capacity": water_holding_capacity,
            "drainage": drainage,
            "overall_health_score": rec_eval.get("overall_health_score", "Good"),
            "suitable_crops": suitable_crops_list,
            "soil_recommendations": rec_eval.get("soil_suitability", {}).get("recommendations", []),
            "fertilizer_recommendations": rec_eval.get("fertilizer_guidance", []),
            "irrigation_recommendations": f"For {soil_record.soil_type} soil: Maintain balanced watering. {drainage}.",
            "sample_date": soil_record.sample_date.isoformat() if soil_record.sample_date else None,
            "data_source": soil_record.data_source,
            "remarks": soil_record.remarks,
        })

    @action(detail=False, methods=['get'], url_path='by-location')
    def by_location(self, request):
        state = request.query_params.get('state')
        district = request.query_params.get('district')
        taluka = request.query_params.get('taluka')
        village = request.query_params.get('village')

        if not (state or district):
            return Response(
                {"error": "Please specify at least 'state' or 'district' parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = self.get_queryset()
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'post'], url_path='analysis')
    def analysis(self, request):
        """
        Analyze soil nutrient levels and provide ratings.
        Accepts soil_id or direct parameters (soil_ph, nitrogen, phosphorus, potassium, organic_carbon, electrical_conductivity).
        """
        data = request.data if request.method == 'POST' else request.query_params
        soil_id = data.get('soil_id') or data.get('id')

        soil_ph = None
        n = None
        p = None
        k = None
        oc = None
        ec = None

        if soil_id:
            try:
                record = SoilRecord.objects.get(id=soil_id)
                soil_ph = record.soil_ph
                n = record.nitrogen
                p = record.phosphorus
                k = record.potassium
                oc = record.organic_carbon
                ec = record.electrical_conductivity
            except SoilRecord.DoesNotExist:
                return Response({"error": f"SoilRecord with id {soil_id} not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                if 'soil_ph' in data or 'ph' in data:
                    soil_ph = float(data.get('soil_ph') or data.get('ph'))
                if 'nitrogen' in data or 'n' in data:
                    n = float(data.get('nitrogen') or data.get('n'))
                if 'phosphorus' in data or 'p' in data:
                    p = float(data.get('phosphorus') or data.get('p'))
                if 'potassium' in data or 'k' in data:
                    k = float(data.get('potassium') or data.get('k'))
                if 'organic_carbon' in data or 'oc' in data:
                    oc = float(data.get('organic_carbon') or data.get('oc'))
                if 'electrical_conductivity' in data or 'ec' in data:
                    ec = float(data.get('electrical_conductivity') or data.get('ec'))
            except (ValueError, TypeError) as e:
                return Response({"error": f"Invalid numeric parameter: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Scientific ratings based on ICAR / Indian soil standards
        results = {}

        if soil_ph is not None:
            if soil_ph < 6.0:
                ph_status = "Acidic (May need agricultural lime or dolomite)"
            elif 6.0 <= soil_ph <= 7.5:
                ph_status = "Neutral / Optimal for most Indian crops"
            elif 7.5 < soil_ph <= 8.5:
                ph_status = "Moderately Alkaline (Use gypsum / organic matter)"
            else:
                ph_status = "Strongly Alkaline / Sodic (Requires soil reclamation)"
            results['soil_ph'] = {'value': soil_ph, 'status': ph_status}

        if n is not None:
            # Low: < 280 kg/ha, Medium: 280 - 560 kg/ha, High: > 560 kg/ha
            n_status = "Low (<280 kg/ha)" if n < 280 else ("Medium (280-560 kg/ha)" if n <= 560 else "High (>560 kg/ha)")
            results['nitrogen'] = {'value': n, 'status': n_status, 'unit': 'kg/ha'}

        if p is not None:
            # Low: < 10 kg/ha, Medium: 10 - 25 kg/ha, High: > 25 kg/ha
            p_status = "Low (<10 kg/ha)" if p < 10 else ("Medium (10-25 kg/ha)" if p <= 25 else "High (>25 kg/ha)")
            results['phosphorus'] = {'value': p, 'status': p_status, 'unit': 'kg/ha'}

        if k is not None:
            # Low: < 110 kg/ha, Medium: 110 - 280 kg/ha, High: > 280 kg/ha
            k_status = "Low (<110 kg/ha)" if k < 110 else ("Medium (110-280 kg/ha)" if k <= 280 else "High (>280 kg/ha)")
            results['potassium'] = {'value': k, 'status': k_status, 'unit': 'kg/ha'}

        if oc is not None:
            # Low: < 0.5%, Medium: 0.5 - 0.75%, High: > 0.75%
            oc_status = "Low (<0.5%)" if oc < 0.5 else ("Medium (0.5-0.75%)" if oc <= 0.75 else "High (>0.75%)")
            results['organic_carbon'] = {'value': oc, 'status': oc_status, 'unit': '%'}

        if ec is not None:
            # Normal: < 1.0 dS/m, Critical: > 2.0 dS/m
            ec_status = "Normal (<1.0 dS/m)" if ec < 1.0 else ("Slight Salinity (1.0-2.0 dS/m)" if ec <= 2.0 else "Harmful Salinity (>2.0 dS/m)")
            results['electrical_conductivity'] = {'value': ec, 'status': ec_status, 'unit': 'dS/m'}

        return Response({
            "soil_id": soil_id,
            "nutrients_analysis": results,
            "overall_health_score": "Good" if (n and n >= 280 and p and p >= 10 and k and k >= 110 and soil_ph and 6.0 <= soil_ph <= 7.8) else "Requires Soil Amendment",
            "disclaimer": "Thresholds based on standard Indian Council of Agricultural Research (ICAR) benchmarks. Consult local Krishi Vigyan Kendra (KVK) for specific field trials."
        })

    @action(detail=False, methods=['get'], url_path='statistics')
    def statistics(self, request):
        qs = self.get_queryset()
        total_records = qs.count()
        soil_type_counts = list(qs.values('soil_type').annotate(count=Count('id')).order_by('-count'))
        district_counts = list(qs.values('state', 'district').annotate(count=Count('id')).order_by('-count')[:15])

        aggregates = qs.aggregate(
            avg_ph=Avg('soil_ph'),
            min_ph=Min('soil_ph'),
            max_ph=Max('soil_ph'),
            avg_nitrogen=Avg('nitrogen'),
            avg_phosphorus=Avg('phosphorus'),
            avg_potassium=Avg('potassium'),
            avg_oc=Avg('organic_carbon')
        )

        return Response({
            "total_records": total_records,
            "averages": {
                "avg_ph": round(aggregates['avg_ph'], 2) if aggregates['avg_ph'] is not None else None,
                "min_ph": aggregates['min_ph'],
                "max_ph": aggregates['max_ph'],
                "avg_nitrogen": round(aggregates['avg_nitrogen'], 2) if aggregates['avg_nitrogen'] is not None else None,
                "avg_phosphorus": round(aggregates['avg_phosphorus'], 2) if aggregates['avg_phosphorus'] is not None else None,
                "avg_potassium": round(aggregates['avg_potassium'], 2) if aggregates['avg_potassium'] is not None else None,
                "avg_organic_carbon": round(aggregates['avg_oc'], 2) if aggregates['avg_oc'] is not None else None,
            },
            "by_soil_type": soil_type_counts,
            "by_district": district_counts
        })
