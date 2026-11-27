from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class AlertsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        district_filter = request.query_params.get('district', '').strip()
        district_id = request.query_params.get('district_id', '').strip()

        if not district_filter and district_id:
            if district_id.isdigit():
                try:
                    from locations.models import District
                    d = District.objects.filter(id=int(district_id)).first()
                    if d:
                        district_filter = d.district_name
                except Exception:
                    pass
            else:
                district_filter = district_id

        district_filter = district_filter.lower()

        alerts = [
            {
                "id": 1,
                "alert_type": "irrigation",
                "district": "Rajkot",
                "title": "Irrigation Schedule Alert",
                "title_gu": "સંચાઈ સમયપત્રક એલર્ટ",
                "title_hi": "सिंचाई अनुसूची चेतावनी",
                "message": "Wheat crop requires moisture boost. Schedule light irrigation within next 24-48 hours.",
                "message_gu": "ઘઉંના પાકને ભેજની જરૂર છે. આગામી 24-48 કલાકમાં હળવી સિંચાઈનું આયોજન કરો.",
                "message_hi": "गेहूं की फसल को नमी की आवश्यकता है। अगले 24-48 घंटों के भीतर हल्की सिंचाई का शेड्यूल बनाएं।",
                "severity": "high",
                "action_label": "Schedule Water",
                "created_at": "2026-10-10T08:00:00Z"
            },
            {
                "id": 2,
                "alert_type": "pest",
                "district": "Amreli",
                "title": "Pest Monitoring Warning",
                "title_gu": "જંતુ નિરીક્ષણ ચેતવણી",
                "title_hi": "कीट निगरानी चेतावनी",
                "message": "High humidity conditions detected. Inspect cotton crop for aphid/whitefly infestation risk.",
                "message_gu": "ઉંચા ભેજની સ્થિતિ શોધી કાઢવામાં આવી છે. મોલો-મશી/સફેદ માખીના જોખમ માટે કપાસનું નિરીક્ષણ કરો.",
                "message_hi": "उच्च आर्द्रता की स्थिति का पता चला। माहू/सफेद मक्खी के जोखिम के लिए कपास की फसल का निरीक्षण करें।",
                "severity": "medium",
                "action_label": "Check Protocol",
                "created_at": "2026-10-10T07:30:00Z"
            },
            {
                "id": 3,
                "alert_type": "crop",
                "district": "Junagadh",
                "title": "Fertilizer Top-Dressing",
                "title_gu": "ખાતર પૂરતી માત્રા",
                "title_hi": "उर्वरक टॉप-ड्रेसिंग",
                "message": "Optimal window for Urea top-dressing application in vegetative stage.",
                "message_gu": "વાનસ્પતિક તબક્કામાં યુરિયા ખાતર આપવાનો અનુકૂળ સમય.",
                "message_hi": "वानस्पतिक अवस्था में यूरिया टॉप-ड्रेसिंग प्रयोग के लिए इष्टतम समय।",
                "severity": "info",
                "action_label": "Apply Nutrient",
                "created_at": "2026-10-10T06:00:00Z"
            }
        ]

        if district_filter:
            filtered = [a for a in alerts if district_filter in a.get("district", "").lower()]
            if filtered:
                return Response(filtered)

        return Response(alerts)


class AlertsBriefingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        briefings = [
            {
                "id": 1,
                "alert_type": "irrigation",
                "title": "Soil Moisture Low in Block A",
                "title_gu": "બ્લોક એ માં જમીનમાં ઓછો ભેજ",
                "title_hi": "ब्लॉक ए में मिट्टी की नमी कम है",
                "message": "Root zone soil moisture dropped below 35%. Recommended irrigation duration: 45 minutes.",
                "severity": "high",
                "action_label": "Start Pump",
                "created_at": "2026-10-10T08:00:00Z"
            },
            {
                "id": 2,
                "alert_type": "pest",
                "title": "Pest Outbreak Advisory",
                "title_gu": "જીવાત ઉપદ્રવ અંગેની સલાહ",
                "title_hi": "कीट प्रकोप सलाह",
                "message": "Favorable temperature for Pink Bollworm in neighboring district. Spray recommended biopesticide.",
                "severity": "medium",
                "action_label": "View Spray Guide",
                "created_at": "2026-10-10T07:15:00Z"
            },
            {
                "id": 3,
                "alert_type": "frost",
                "title": "Weather Warning: Low Night Temp",
                "title_gu": "હવામાન ચેતવણી: ઓછું રાત્રિ તાપમાન",
                "title_hi": "मौसम की चेतावनी: रात का तापमान कम",
                "message": "Night temperature expected to drop to 12°C. Provide light protective watering to sensitive crops.",
                "severity": "high",
                "action_label": "Read Advisory",
                "created_at": "2026-10-10T05:45:00Z"
            }
        ]
        return Response(briefings)
