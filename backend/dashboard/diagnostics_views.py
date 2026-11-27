from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from datetime import datetime


DIAGNOSTICS_DB = [
    {
        "id": 1,
        "image": None,
        "crop_name": "Cotton (કપાસ)",
        "disease_detected": "Cotton Bacterial Blight (જીવાણુજન્ય રોગ)",
        "confidence": 94.5,
        "status": "analyzed",
        "treatment": "Spray Copper Oxychloride 50% WP @ 2.5g per litre water along with Streptocycline 1g/10L.",
        "created_at": "2026-10-10T10:00:00Z"
    },
    {
        "id": 2,
        "image": None,
        "crop_name": "Groundnut (મગફળી)",
        "disease_detected": "Tikka Leaf Spot (ટપકાનો રોગ)",
        "confidence": 91.2,
        "status": "analyzed",
        "treatment": "Spray Mancozeb 75% WP @ 2g/L or Carbendazim 50% WP @ 1g/L at 15-day intervals.",
        "created_at": "2026-10-09T14:30:00Z"
    }
]


class DiagnosticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(DIAGNOSTICS_DB)

    def post(self, request):
        desc = request.data.get('location_description', '')
        crop_name = request.data.get('crop_name', 'Crop Specimen')
        
        # Simulate intelligent plant health disease diagnosis
        new_diag = {
            "id": len(DIAGNOSTICS_DB) + 1,
            "image": None,
            "crop_name": crop_name,
            "disease_detected": "Early Leaf Spot / Nutrient Deficiency Analysis",
            "confidence": 92.8,
            "status": "analyzed",
            "treatment": "Maintain soil moisture, apply balanced Micronutrient spray (Zinc + Iron 0.5%), avoid overhead watering.",
            "created_at": datetime.utcnow().isoformat() + "Z"
        }
        DIAGNOSTICS_DB.insert(0, new_diag)
        return Response(new_diag, status=status.HTTP_201_CREATED)


class DiagnosticsDetailView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        diag = next((d for d in DIAGNOSTICS_DB if d["id"] == pk), None)
        if not diag:
            return Response({"error": "Diagnostic record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if 'status' in request.data:
            diag['status'] = request.data['status']
        return Response(diag)
