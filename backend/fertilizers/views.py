from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import Fertilizer
from .serializers import FertilizerSerializer
from soil.models import SoilRecord


class FertilizerViewSet(viewsets.ModelViewSet):
    queryset = Fertilizer.objects.all()
    serializer_class = FertilizerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['fertilizer_name', 'fertilizer_type', 'recommended_crops', 'description']
    ordering_fields = ['fertilizer_name', 'nitrogen_percentage', 'phosphorus_percentage', 'potassium_percentage']

    def get_queryset(self):
        qs = super().get_queryset()
        f_type = self.request.query_params.get('type') or self.request.query_params.get('fertilizer_type')
        if f_type:
            qs = qs.filter(fertilizer_type__icontains=f_type)
        return qs

    @action(detail=False, methods=['get'], url_path='by-crop')
    def by_crop(self, request):
        crop = request.query_params.get('crop') or request.query_params.get('crop_name')
        if not crop:
            return Response(
                {"error": "Please provide 'crop' or 'crop_name' query parameter (e.g. wheat, paddy, cotton)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Match specific crop or general categories like 'all crops', 'cereals'
        qs = self.get_queryset().filter(
            Q(recommended_crops__icontains=crop) |
            Q(recommended_crops__icontains='all') |
            Q(recommended_crops__isnull=True)
        )

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get', 'post'], url_path='recommendations')
    def recommendations(self, request):
        """
        Provide fertilizer guidance based on crop and soil nutrient values.
        Accepts: crop_name, soil_id, or direct (nitrogen, phosphorus, potassium, soil_ph, organic_carbon).
        """
        data = request.data if request.method == 'POST' else request.query_params
        crop_name = data.get('crop_name') or data.get('crop')
        soil_id = data.get('soil_id')

        soil_n = None
        soil_p = None
        soil_k = None
        soil_ph = None
        soil_oc = None

        if soil_id:
            try:
                soil_rec = SoilRecord.objects.get(id=soil_id)
                soil_n = soil_rec.nitrogen
                soil_p = soil_rec.phosphorus
                soil_k = soil_rec.potassium
                soil_ph = soil_rec.soil_ph
                soil_oc = soil_rec.organic_carbon
            except SoilRecord.DoesNotExist:
                return Response({"error": f"SoilRecord with id {soil_id} not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                if 'nitrogen' in data or 'n' in data:
                    soil_n = float(data.get('nitrogen') or data.get('n'))
                if 'phosphorus' in data or 'p' in data:
                    soil_p = float(data.get('phosphorus') or data.get('p'))
                if 'potassium' in data or 'k' in data:
                    soil_k = float(data.get('potassium') or data.get('k'))
                if 'soil_ph' in data or 'ph' in data:
                    soil_ph = float(data.get('soil_ph') or data.get('ph'))
                if 'organic_carbon' in data or 'oc' in data:
                    soil_oc = float(data.get('organic_carbon') or data.get('oc'))
            except (ValueError, TypeError) as e:
                return Response({"error": f"Invalid numerical parameter: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        suggested_fertilizers = []
        guidelines = []
        cautions = []

        # 1. Nitrogen deficit guidance
        if soil_n is not None and soil_n < 280:
            guidelines.append("Nitrogen level is LOW (<280 kg/ha). Apply nitrogenous fertilizers in split doses.")
            n_fert = Fertilizer.objects.filter(nitrogen_percentage__gte=20).first()
            if n_fert:
                suggested_fertilizers.append(FertilizerSerializer(n_fert).data)
        elif soil_n is not None and soil_n > 560:
            cautions.append("Soil Nitrogen is already HIGH. Reduce nitrogenous fertilizer to avoid lodging and pests.")

        # 2. Phosphorus deficit guidance
        if soil_p is not None and soil_p < 10:
            guidelines.append("Phosphorus level is LOW (<10 kg/ha). Apply phosphatic fertilizer as basal dose at sowing.")
            p_fert = Fertilizer.objects.filter(phosphorus_percentage__gte=20).first()
            if p_fert:
                suggested_fertilizers.append(FertilizerSerializer(p_fert).data)

        # 3. Potassium deficit guidance
        if soil_k is not None and soil_k < 110:
            guidelines.append("Potassium level is LOW (<110 kg/ha). Apply muriate of potash (MOP) or sulfate of potash.")
            k_fert = Fertilizer.objects.filter(potassium_percentage__gte=20).first()
            if k_fert:
                suggested_fertilizers.append(FertilizerSerializer(k_fert).data)

        # 4. Organic carbon guidance
        if soil_oc is not None and soil_oc < 0.5:
            guidelines.append("Organic carbon is LOW (<0.5%). Incorporate 5-10 tonnes/ha Farmyard Manure (FYM) or Vermicompost.")
            org_fert = Fertilizer.objects.filter(fertilizer_type='Organic').first()
            if org_fert:
                suggested_fertilizers.append(FertilizerSerializer(org_fert).data)

        # 5. Crop specific guidance
        if crop_name:
            crop_matched = Fertilizer.objects.filter(recommended_crops__icontains=crop_name)
            for f in crop_matched[:3]:
                if not any(item['id'] == f.id for item in suggested_fertilizers):
                    suggested_fertilizers.append(FertilizerSerializer(f).data)

        # 6. Fallback if no specific nutrient deficit detected
        if not suggested_fertilizers:
            for f in Fertilizer.objects.all()[:4]:
                suggested_fertilizers.append(FertilizerSerializer(f).data)

        if not guidelines:
            guidelines.append("Soil nutrient levels appear balanced. Maintain fertility with recommended basal NPK dose and compost.")

        return Response({
            "target_crop": crop_name or "General Crop",
            "soil_conditions": {
                "soil_ph": soil_ph,
                "nitrogen": soil_n,
                "phosphorus": soil_p,
                "potassium": soil_k,
                "organic_carbon": soil_oc
            },
            "advisory_guidelines": guidelines,
            "precautions": cautions or ["Avoid applying fertilizers in waterlogged fields.", "Wear protective gloves and mask when handling chemicals."],
            "recommended_fertilizers": suggested_fertilizers,
            "disclaimer": (
                "IMPORTANT: These fertilizer recommendations are advisory and informational only. "
                "Do not apply chemicals excessively. Always consult certified soil test results from "
                "your nearest Government Krishi Vigyan Kendra (KVK) or agricultural extension officer."
            )
        })
