from rest_framework import serializers
from .models import Crop, CropRecord, CropData


class CropDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropData
        fields = '__all__'


CROP_TRANSLATIONS = {
    'castor': {
        'gu': {'name': 'એરંડા / દિવેલા', 'season': 'ખરીફ (ચોમાસુ)', 'category': 'તેલીબિયાં પાક', 'climate': 'ગરમ અને ભેજવાળું વાતાવરણ'},
        'hi': {'name': 'अरंडी', 'season': 'खरीफ', 'category': 'तिलहन', 'climate': 'गर्म और आर्द्र जलवायु'},
    },
    'cotton': {
        'gu': {'name': 'કપાસ', 'season': 'ખરીફ (ચોમાસુ)', 'category': 'રેસાવાળા પાક', 'climate': 'લાંબો ઉનાળો અને મધ્યમ વરસાદ'},
        'hi': {'name': 'कपास', 'season': 'खरीफ', 'category': 'रेशा फसल', 'climate': 'लंबी गर्मी और मध्यम वर्षा'},
    },
    'cumin': {
        'gu': {'name': 'જીરું', 'season': 'રવિ (શિયાળુ)', 'category': 'મસાલા પાક', 'climate': 'સૂકું અને ઠંડું વાતાવરણ'},
        'hi': {'name': 'जीरा', 'season': 'रवि (सर्दियां)', 'category': 'मसाला फसल', 'climate': 'शुष्क और ठंडा मौसम'},
    },
    'groundnut': {
        'gu': {'name': 'મગફળી', 'season': 'ખરીફ / ઉનાળુ', 'category': 'તેલીબિયાં પાક', 'climate': 'ગરમ અને હૂંફાળું વાતાવરણ'},
        'hi': {'name': 'मूंगफली', 'season': 'खरीफ', 'category': 'तिलहन', 'climate': 'गर्म और धूप वाला मौसम'},
    },
    'paddy': {
        'gu': {'name': 'ડાંગર / ચોખા', 'season': 'ખરીફ (ચોમાસુ)', 'category': 'અનાજ પાક', 'climate': 'વધુ ભેજ અને પુષ્કળ પાણી'},
        'hi': {'name': 'धान / चावल', 'season': 'खरीफ', 'category': 'अनाज', 'climate': 'उच्च आर्द्रता और पर्याप्त पानी'},
    },
    'sugarcane': {
        'gu': {'name': 'શેરડી', 'season': 'વાર્ષિક (બારેમાસ)', 'category': 'રોકડિયો પાક', 'climate': 'ઉષ્ણકટિબંધીય ગરમ વાતાવરણ'},
        'hi': {'name': 'गन्ना', 'season': 'वार्षिक', 'category': 'नकदी फसल', 'climate': 'उष्णकटिबंधीय नम जलवायु'},
    },
    'wheat': {
        'gu': {'name': 'ઘઉં', 'season': 'રવિ (શિયાળુ)', 'category': 'અનાજ પાક', 'climate': 'ઠંડી ઋતુ અને પૂરતો સૂર્યપ્રકાશ'},
        'hi': {'name': 'गेहूं', 'season': 'रवि', 'category': 'अनाज', 'climate': 'ठंडी और शुष्क जलवायु'},
    },
}

CATEGORY_TRANSLATIONS = {
    'cereal': {'gu': 'અનાજ પાક', 'hi': 'अनाज फसल', 'en': 'Cereals'},
    'pulse': {'gu': 'કઠોળ પાક', 'hi': 'दलहन फसल', 'en': 'Pulses'},
    'oilseed': {'gu': 'તેલીબિયાં પાક', 'hi': 'तिलहन फसल', 'en': 'Oilseeds'},
    'cash crop': {'gu': 'રોકડિયો પાક', 'hi': 'नकदी फसल', 'en': 'Cash Crops'},
    'fiber': {'gu': 'રેસાવાળા પાક', 'hi': 'रेशा फसल', 'en': 'Fiber Crops'},
    'vegetable': {'gu': 'શાકભાજી', 'hi': 'सब्जियां', 'en': 'Vegetables'},
    'fruit': {'gu': 'ફળફળાદિ', 'hi': 'फल', 'en': 'Fruits'},
    'spice': {'gu': 'મસાલા પાક', 'hi': 'मसाला फसल', 'en': 'Spices'},
    'fodder': {'gu': 'ઘાસચારો', 'hi': 'चारा', 'en': 'Fodder'},
    'medicinal': {'gu': 'ઔષધીય પાક', 'hi': 'औषधीय फसल', 'en': 'Medicinal'},
}

SEASON_TRANSLATIONS = {
    'kharif': {'gu': 'ખરીફ (ચોમાસુ)', 'hi': 'खरीफ (मानसून)', 'en': 'Kharif (Monsoon)'},
    'rabi': {'gu': 'રવિ (શિયાળુ)', 'hi': 'रवि (सर्दियां)', 'en': 'Rabi (Winter)'},
    'zaid': {'gu': 'ઝાયદ (ઉનાળુ)', 'hi': 'जायद (गर्मी)', 'en': 'Zaid (Summer)'},
    'annual': {'gu': 'વાર્ષિક / બારેમાસ', 'hi': 'वार्षिक', 'en': 'Annual / Year-round'},
}


class CropSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='crop_name', read_only=True)
    crop_type = serializers.CharField(source='crop_category', read_only=True)
    growing_days = serializers.IntegerField(source='crop_duration_days', read_only=True)

    name_gu = serializers.SerializerMethodField()
    name_hi = serializers.SerializerMethodField()
    name_en = serializers.CharField(source='crop_name', read_only=True)

    category_gu = serializers.SerializerMethodField()
    category_hi = serializers.SerializerMethodField()
    category_en = serializers.CharField(source='crop_category', read_only=True)

    season_gu = serializers.SerializerMethodField()
    season_hi = serializers.SerializerMethodField()
    season_en = serializers.CharField(source='growing_season', read_only=True)

    display_name = serializers.SerializerMethodField()
    display_category = serializers.SerializerMethodField()
    display_season = serializers.SerializerMethodField()
    display_climate = serializers.SerializerMethodField()

    timeline = serializers.SerializerMethodField()
    soil_requirements = serializers.SerializerMethodField()
    temperature_requirements = serializers.SerializerMethodField()
    water_requirements = serializers.SerializerMethodField()
    disease_and_pest_info = serializers.SerializerMethodField()

    class Meta:
        model = Crop
        fields = '__all__'

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            lang = request.query_params.get('lang') or request.headers.get('Accept-Language', '')
            if 'hi' in lang.lower():
                return 'hi'
            if 'en' in lang.lower():
                return 'en'
        return 'gu'

    def get_name_gu(self, obj):
        key = (obj.crop_name or '').lower()
        return CROP_TRANSLATIONS.get(key, {}).get('gu', {}).get('name', obj.crop_name)

    def get_name_hi(self, obj):
        key = (obj.crop_name or '').lower()
        return CROP_TRANSLATIONS.get(key, {}).get('hi', {}).get('name', obj.crop_name)

    def get_category_gu(self, obj):
        key = (obj.crop_category or '').lower()
        return CATEGORY_TRANSLATIONS.get(key, {}).get('gu', obj.crop_category)

    def get_category_hi(self, obj):
        key = (obj.crop_category or '').lower()
        return CATEGORY_TRANSLATIONS.get(key, {}).get('hi', obj.crop_category)

    def get_season_gu(self, obj):
        key = (obj.growing_season or '').lower()
        return SEASON_TRANSLATIONS.get(key, {}).get('gu', obj.growing_season)

    def get_season_hi(self, obj):
        key = (obj.growing_season or '').lower()
        return SEASON_TRANSLATIONS.get(key, {}).get('hi', obj.growing_season)

    def get_display_name(self, obj):
        lang = self._get_lang()
        if lang == 'gu':
            return self.get_name_gu(obj)
        if lang == 'hi':
            return self.get_name_hi(obj)
        return obj.crop_name

    def get_display_category(self, obj):
        lang = self._get_lang()
        if lang == 'gu':
            return self.get_category_gu(obj)
        if lang == 'hi':
            return self.get_category_hi(obj)
        return obj.crop_category

    def get_display_season(self, obj):
        lang = self._get_lang()
        if lang == 'gu':
            return self.get_season_gu(obj)
        if lang == 'hi':
            return self.get_season_hi(obj)
        return obj.growing_season

    def get_display_climate(self, obj):
        key = (obj.crop_name or '').lower()
        lang = self._get_lang()
        return CROP_TRANSLATIONS.get(key, {}).get(lang, {}).get('climate', f"Suitable for {obj.growing_season} season in Gujarat")

    def get_timeline(self, obj):
        return {
            "sowing_period": obj.sowing_period or ("June - July" if obj.growing_season == "Kharif" else "October - November"),
            "germination_period": "5 - 10 days",
            "growing_period": f"{max(obj.crop_duration_days - 35, 30)} - {obj.crop_duration_days - 10} days",
            "harvesting_period": obj.harvesting_period or ("October - December" if obj.growing_season == "Kharif" else "March - April"),
            "total_crop_duration": f"{obj.crop_duration_days} days",
            "duration_days": obj.crop_duration_days,
            "season": obj.growing_season,
        }

    def get_soil_requirements(self, obj):
        return {
            "soil_type": obj.suitable_soil,
            "ph_min": obj.suitable_ph_min,
            "ph_max": obj.suitable_ph_max,
            "ph_range": f"{obj.suitable_ph_min} - {obj.suitable_ph_max}",
            "description": f"Grows best in {obj.suitable_soil} with optimal pH between {obj.suitable_ph_min} and {obj.suitable_ph_max}."
        }

    def get_temperature_requirements(self, obj):
        return {
            "temperature_min": obj.temperature_min,
            "temperature_max": obj.temperature_max,
            "temperature_range": f"{obj.temperature_min}°C - {obj.temperature_max}°C",
            "climate": f"Requires warm climate with temperatures {obj.temperature_min}°C to {obj.temperature_max}°C."
        }

    def get_water_requirements(self, obj):
        return {
            "water_requirement": obj.water_requirement,
            "rainfall_requirement": obj.rainfall_requirement or "500-800 mm",
            "irrigation_method": obj.irrigation_method or "Drip / Furrow irrigation",
        }

    def get_disease_and_pest_info(self, obj):
        diseases = []
        if hasattr(obj, 'diseases'):
            for d in obj.diseases.all()[:4]:
                diseases.append({
                    "disease_name": d.disease_name,
                    "symptoms": d.symptoms,
                    "prevention": d.prevention,
                    "treatment": d.treatment
                })
        return {
            "common_diseases": obj.common_diseases or "Fusarium wilt, Leaf spot",
            "disease_list": diseases,
            "pest_protection": "Use pheromone traps and recommended neem oil sprays for early pest management."
        }


class CropRecordSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)

    class Meta:
        model = CropRecord
        fields = [
            'id', 'state', 'district', 'taluka',
            'crop', 'crop_name', 'crop_details',
            'growing_season', 'crop_duration_days',
            'area_hectares', 'production_tonnes', 'yield_kg_per_hectare',
            'year', 'data_source', 'created_at', 'updated_at'
        ]


class CropSuitabilitySerializer(serializers.Serializer):
    soil_type = serializers.CharField(required=False)
    soil_ph = serializers.FloatField(required=False)
    temperature = serializers.FloatField(required=False)
    growing_season = serializers.CharField(required=False)
