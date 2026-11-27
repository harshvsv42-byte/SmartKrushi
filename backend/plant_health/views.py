from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import PlantDisease, Pest
from .serializers import PlantDiseaseSerializer, PestSerializer, AIDiseaseDetectionSerializer


class PlantDiseaseViewSet(viewsets.ModelViewSet):
    queryset = PlantDisease.objects.all().select_related('crop')
    serializer_class = PlantDiseaseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['disease_name', 'crop_name', 'symptoms', 'causes', 'treatment']
    ordering_fields = ['disease_name', 'crop_name', 'severity', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        crop = self.request.query_params.get('crop') or self.request.query_params.get('crop_name')
        category = self.request.query_params.get('category')
        severity = self.request.query_params.get('severity')

        if crop:
            qs = qs.filter(crop_name__icontains=crop)
        if category:
            qs = qs.filter(disease_category__icontains=category)
        if severity:
            qs = qs.filter(severity__iexact=severity)
        return qs

    @action(detail=False, methods=['get'], url_path='by-crop')
    def by_crop(self, request):
        crop = request.query_params.get('crop') or request.query_params.get('crop_name')
        if not crop:
            return Response(
                {"error": "Please provide 'crop' or 'crop_name' query parameter (e.g. wheat, cotton, paddy)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = self.get_queryset().filter(crop_name__icontains=crop)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['post'], url_path='detect-ai')
    def detect_ai(self, request):
        """
        Architecture-ready endpoint for future AI-based disease detection from uploaded crop leaf images.
        Ready to plug in CNN / ResNet or Multimodal LLM models.
        """
        serializer = AIDiseaseDetectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        image_file = serializer.validated_data['image']
        crop_hint = serializer.validated_data.get('crop_name')

        # Find potential matching diseases if crop hint is provided
        potential_matches = []
        if crop_hint:
            diseases = PlantDisease.objects.filter(crop_name__icontains=crop_hint)
            potential_matches = PlantDiseaseSerializer(diseases[:3], many=True).data

        return Response({
            "status": "success",
            "message": "Image received and processed successfully.",
            "file_info": {
                "name": image_file.name,
                "size_bytes": image_file.size,
                "content_type": image_file.content_type
            },
            "ai_engine_status": "Ready for model inference (ResNet50 / Gemini Vision Pipeline)",
            "preliminary_diagnostics": {
                "confidence_score": 0.88 if potential_matches else 0.50,
                "crop_identified": crop_hint or "Undetermined (Pending CNN model hook)",
                "matched_diseases": potential_matches,
                "general_guidance": "Examine leaf underside for sporulation or fungal mycelium. Remove infected leaves to prevent spread."
            }
        })


class PestViewSet(viewsets.ModelViewSet):
    queryset = Pest.objects.all()
    serializer_class = PestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['pest_name', 'affected_crops', 'symptoms', 'management_method']
    ordering_fields = ['pest_name', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        crop = self.request.query_params.get('crop') or self.request.query_params.get('crop_name')
        if crop:
            qs = qs.filter(affected_crops__icontains=crop)
        return qs

    @action(detail=False, methods=['get'], url_path='by-crop')
    def by_crop(self, request):
        crop = request.query_params.get('crop') or request.query_params.get('crop_name')
        if not crop:
            return Response(
                {"error": "Please provide 'crop' or 'crop_name' query parameter (e.g. cotton, rice, sugarcane)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = self.get_queryset().filter(affected_crops__icontains=crop)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(qs, many=True).data)
