"""
Smart Agriculture Rule-Based Recommendation Engine

Agronomic thresholds grounded in:
1. ICAR (Indian Council of Agricultural Research) Soil Fertility Ratings
2. Government of Gujarat Directorate of Agriculture Package of Practices
3. FAO Crop Ecological Requirements

DISCLAIMER & LIMITATIONS:
This module executes documented agronomic rules and decision heuristics.
It is an expert advisory rule-engine, NOT a black-box machine learning model.
All recommendations are advisory and should be complemented with local
Krishi Vigyan Kendra (KVK) soil testing.
"""

from typing import Dict, List, Any, Optional
from crops.models import Crop
from fertilizers.models import Fertilizer
from weather.models import WeatherRecord
from soil.models import SoilRecord


# Documented Agronomic Thresholds (ICAR Standards)
AGRONOMIC_THRESHOLDS = {
    "nitrogen_kg_ha": {"low": 280.0, "medium": 560.0},
    "phosphorus_kg_ha": {"low": 10.0, "medium": 25.0},
    "potassium_kg_ha": {"low": 110.0, "medium": 280.0},
    "organic_carbon_pct": {"low": 0.50, "medium": 0.75},
    "ph": {
        "strongly_acidic": 5.5,
        "moderately_acidic": 6.0,
        "neutral_min": 6.5,
        "neutral_max": 7.5,
        "moderately_alkaline": 8.5
    },
    "temperature_celsius": {"cold_stress": 12.0, "heat_stress": 38.0},
    "rainfall_mm": {"drought_risk": 5.0, "heavy_rain_risk": 50.0},
    "humidity_pct": {"fungal_risk": 80.0, "dry_air": 30.0}
}


class AgriRecommendationEngine:
    """
    Modular, rule-based recommendation service.
    """

    @classmethod
    def evaluate(
        cls,
        soil_ph: Optional[float] = None,
        nitrogen: Optional[float] = None,
        phosphorus: Optional[float] = None,
        potassium: Optional[float] = None,
        organic_carbon: Optional[float] = None,
        temperature: Optional[float] = None,
        rainfall: Optional[float] = None,
        humidity: Optional[float] = None,
        crop_name: Optional[str] = None,
        location: Optional[str] = None,
        growing_season: Optional[str] = None,
        soil_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Produce comprehensive recommendations based on inputs.
        """
        # 1. Evaluate Soil Suitability & Deficiencies
        soil_eval = cls._evaluate_soil(soil_ph, nitrogen, phosphorus, potassium, organic_carbon)

        # 2. Evaluate Weather Alerts & Irrigation
        weather_eval = cls._evaluate_weather(temperature, rainfall, humidity)

        # 3. Find Suitable Crops (if not restricted to one crop)
        suitable_crops = cls._find_suitable_crops(
            soil_ph=soil_ph,
            temperature=temperature,
            season=growing_season,
            soil_type=soil_type,
            target_crop=crop_name
        )

        # 4. Generate Fertilizer Guidance
        fertilizer_guidance = cls._generate_fertilizer_guidance(
            soil_eval=soil_eval,
            crop_name=crop_name
        )

        # 5. Crop-Specific Cultivation Guidance
        crop_guidance = cls._get_crop_guidance(crop_name)

        return {
            "engine_metadata": {
                "engine_type": "Rule-Based Agronomic Heuristics",
                "version": "1.0",
                "references": [
                    "ICAR Guidelines for Soil Fertility Classification",
                    "Gujarat State Agricultural Universities Package of Practices"
                ],
                "disclaimer": (
                    "Informational guidance only. Field conditions, seed variety, and micro-climate "
                    "significantly alter requirements. Always consult certified soil test reports."
                )
            },
            "input_summary": {
                "soil_ph": soil_ph,
                "nitrogen_kg_ha": nitrogen,
                "phosphorus_kg_ha": phosphorus,
                "potassium_kg_ha": potassium,
                "organic_carbon_pct": organic_carbon,
                "temperature_c": temperature,
                "rainfall_mm": rainfall,
                "humidity_pct": humidity,
                "crop": crop_name,
                "location": location,
                "growing_season": growing_season,
                "soil_type": soil_type
            },
            "soil_suitability": soil_eval["suitability"],
            "nutrient_deficiencies": soil_eval["deficiencies"],
            "suitable_crops": suitable_crops,
            "fertilizer_guidance": fertilizer_guidance,
            "irrigation_suggestions": weather_eval["irrigation_suggestions"],
            "weather_farming_alerts": weather_eval["alerts"],
            "crop_cultivation_guidance": crop_guidance,
        }

    @classmethod
    def _evaluate_soil(cls, ph, n, p, k, oc) -> Dict[str, Any]:
        deficiencies = []
        suitability_notes = []
        status = "Good"

        if ph is not None:
            if ph < AGRONOMIC_THRESHOLDS["ph"]["moderately_acidic"]:
                deficiencies.append({
                    "nutrient": "Soil pH (Acidic)",
                    "severity": "High" if ph < 5.5 else "Moderate",
                    "remedy": "Apply agricultural lime (calcium carbonate) or dolomite to raise soil pH."
                })
                suitability_notes.append("Acidic soil may inhibit phosphorus and micronutrient availability.")
                status = "Needs Amendment"
            elif ph > AGRONOMIC_THRESHOLDS["ph"]["moderately_alkaline"]:
                deficiencies.append({
                    "nutrient": "Soil pH (Alkaline / Sodic)",
                    "severity": "High",
                    "remedy": "Apply gypsum (calcium sulphate) and incorporate organic matter / green manure."
                })
                suitability_notes.append("High alkalinity restricts iron, zinc, and phosphorus uptake.")
                status = "Needs Amendment"
            else:
                suitability_notes.append(f"Soil pH ({ph}) is optimal for most standard crops.")

        if n is not None:
            if n < AGRONOMIC_THRESHOLDS["nitrogen_kg_ha"]["low"]:
                deficiencies.append({
                    "nutrient": "Nitrogen (N)",
                    "severity": "High",
                    "current_level": f"{n} kg/ha (Low)",
                    "remedy": "Apply urea or organic nitrogen compost in split applications (basal + vegetative stage)."
                })
                status = "Needs Amendment"
            elif n < AGRONOMIC_THRESHOLDS["nitrogen_kg_ha"]["medium"]:
                suitability_notes.append(f"Nitrogen level is moderate ({n} kg/ha).")
            else:
                suitability_notes.append(f"Nitrogen level is rich ({n} kg/ha). Avoid excessive N application.")

        if p is not None:
            if p < AGRONOMIC_THRESHOLDS["phosphorus_kg_ha"]["low"]:
                deficiencies.append({
                    "nutrient": "Phosphorus (P)",
                    "severity": "High",
                    "current_level": f"{p} kg/ha (Low)",
                    "remedy": "Apply Single Super Phosphate (SSP) or DAP as basal placement near the root zone."
                })
                status = "Needs Amendment"

        if k is not None:
            if k < AGRONOMIC_THRESHOLDS["potassium_kg_ha"]["low"]:
                deficiencies.append({
                    "nutrient": "Potassium (K)",
                    "severity": "Moderate",
                    "current_level": f"{k} kg/ha (Low)",
                    "remedy": "Apply Muriate of Potash (MOP) to improve drought tolerance and grain quality."
                })
                status = "Needs Amendment"

        if oc is not None:
            if oc < AGRONOMIC_THRESHOLDS["organic_carbon_pct"]["low"]:
                deficiencies.append({
                    "nutrient": "Organic Carbon",
                    "severity": "High",
                    "current_level": f"{oc}% (Low)",
                    "remedy": "Incorporate 5-10 tonnes/ha Farm Yard Manure (FYM), vermicompost, or sow green manure crops (Dhaincha/Sunhemp)."
                })

        return {
            "status": status,
            "suitability": {
                "rating": status,
                "observations": suitability_notes or ["Soil metrics appear within acceptable agronomic ranges."]
            },
            "deficiencies": deficiencies
        }

    @classmethod
    def _evaluate_weather(cls, temp, rain, humidity) -> Dict[str, Any]:
        alerts = []
        irrigation = []

        if temp is not None:
            if temp >= AGRONOMIC_THRESHOLDS["temperature_celsius"]["heat_stress"]:
                alerts.append(f"Extreme Heat Alert: Temperature ({temp}°C) exceeds heat stress threshold. High risk of moisture stress and flower drop.")
                irrigation.append("Provide light, frequent evening irrigation or drip fertigation to counteract transpiration loss.")
            elif temp <= AGRONOMIC_THRESHOLDS["temperature_celsius"]["cold_stress"]:
                alerts.append(f"Cold Warning: Temperature ({temp}°C) is low. Risk of delayed germination or frost injury in tender crops.")
                irrigation.append("Apply a light evening irrigation to moderate soil temperature and prevent frost burn.")

        if rain is not None:
            if rain >= AGRONOMIC_THRESHOLDS["rainfall_mm"]["heavy_rain_risk"]:
                alerts.append(f"Heavy Rainfall Alert: {rain} mm precipitation recorded. High risk of waterlogging and root rot.")
                irrigation.append("Immediately ensure field drainage channels are clear. Suspend fertilizer and pesticide spraying until field drains.")
            elif rain < AGRONOMIC_THRESHOLDS["rainfall_mm"]["drought_risk"]:
                irrigation.append("Rainfall is minimal. Monitor soil moisture in active root zone and irrigate based on critical crop stage.")

        if humidity is not None:
            if humidity >= AGRONOMIC_THRESHOLDS["humidity_pct"]["fungal_risk"]:
                alerts.append(f"High Humidity Warning ({humidity}%): Prolonged wetness promotes fungal leaf spots, downy mildew, and blast disease.")
            elif humidity <= AGRONOMIC_THRESHOLDS["humidity_pct"]["dry_air"]:
                alerts.append(f"Low Humidity Alert ({humidity}%): Rapid evapotranspiration; inspect for sucking pests like spider mites and thrips.")

        if not alerts:
            alerts.append("Weather parameters are currently favorable for regular field operations.")
        if not irrigation:
            irrigation.append("Follow standard irrigation schedule tailored to crop growth stage (e.g. flowering, pod development).")

        return {
            "alerts": alerts,
            "irrigation_suggestions": irrigation
        }

    @classmethod
    def _find_suitable_crops(cls, soil_ph, temperature, season, soil_type, target_crop=None) -> List[Dict[str, Any]]:
        qs = Crop.objects.all()

        if target_crop:
            qs = qs.filter(crop_name__icontains=target_crop)
            if not qs.exists():
                return [{
                    "crop_name": target_crop,
                    "suitability_score": "Unknown",
                    "reason": f"'{target_crop}' is not currently in the master crop catalog. Verify spelling or add to database."
                }]

        candidates = []
        for crop in qs[:20]:
            score = 100
            reasons = []

            # 1. Season match
            if season and crop.growing_season:
                if season.lower() in crop.growing_season.lower() or crop.growing_season.lower() in ['annual', 'perennial']:
                    score += 10
                    reasons.append(f"Matches {season} season")
                else:
                    score -= 30
                    reasons.append(f"Preferred season is {crop.growing_season}")

            # 2. pH compatibility
            if soil_ph is not None:
                if crop.suitable_ph_min <= soil_ph <= crop.suitable_ph_max:
                    score += 15
                    reasons.append("Optimal soil pH")
                elif abs(soil_ph - crop.suitable_ph_min) <= 0.6 or abs(soil_ph - crop.suitable_ph_max) <= 0.6:
                    score -= 10
                    reasons.append(f"pH {soil_ph} is marginally outside preferred range ({crop.suitable_ph_min}-{crop.suitable_ph_max})")
                else:
                    score -= 40
                    reasons.append(f"pH {soil_ph} is unfavorable (needs {crop.suitable_ph_min}-{crop.suitable_ph_max})")

            # 3. Temperature tolerance
            if temperature is not None:
                if crop.temperature_min <= temperature <= crop.temperature_max:
                    score += 10
                else:
                    score -= 25
                    reasons.append(f"Current temp {temperature}°C outside tolerance ({crop.temperature_min}-{crop.temperature_max}°C)")

            # 4. Soil type
            if soil_type and crop.suitable_soil:
                if soil_type.lower() in crop.suitable_soil.lower():
                    score += 15
                    reasons.append(f"Thrives in {soil_type}")

            rating = "Highly Suitable" if score >= 85 else ("Moderately Suitable" if score >= 60 else "Marginally Suitable")

            candidates.append({
                "id": crop.id,
                "crop_name": crop.crop_name,
                "scientific_name": crop.scientific_name,
                "crop_category": crop.crop_category,
                "growing_season": crop.growing_season,
                "crop_duration_days": crop.crop_duration_days,
                "suitability_rating": rating,
                "suitability_score": max(min(score, 100), 10),
                "notes": reasons or ["Matches general agro-climatic conditions."]
            })

        candidates.sort(key=lambda x: x["suitability_score"], reverse=True)
        return candidates[:8]

    @classmethod
    def _generate_fertilizer_guidance(cls, soil_eval, crop_name) -> Dict[str, Any]:
        guidelines = []
        deficiencies = soil_eval.get("deficiencies", [])

        if deficiencies:
            for d in deficiencies:
                guidelines.append(f"Address {d['nutrient']}: {d['remedy']}")
        else:
            guidelines.append("Apply balanced basal NPK dose as per recommended package of practices.")

        # Suggest fertilizers from db
        suggested = []
        for fert in Fertilizer.objects.all()[:4]:
            suggested.append({
                "fertilizer_name": fert.fertilizer_name,
                "type": fert.fertilizer_type,
                "npk": f"{fert.nitrogen_percentage}-{fert.phosphorus_percentage}-{fert.potassium_percentage}",
                "application": fert.application_method,
                "dosage_guideline": fert.dosage_per_hectare
            })

        return {
            "advisory_notes": guidelines,
            "suggested_inputs": suggested,
            "disclaimer": "Do not exceed manufacturer or university recommended dosage. Adjust for organic manure already applied."
        }

    @classmethod
    def _get_crop_guidance(cls, crop_name) -> Optional[Dict[str, Any]]:
        if not crop_name:
            return None
        crop = Crop.objects.filter(crop_name__icontains=crop_name).first()
        if not crop:
            return None

        return {
            "crop": crop.crop_name,
            "scientific_name": crop.scientific_name,
            "growing_season": crop.growing_season,
            "duration": f"{crop.crop_duration_days} days",
            "sowing_period": crop.sowing_period or "Check local monsoon onset",
            "harvesting_period": crop.harvesting_period or "At physiological maturity",
            "irrigation_method": crop.irrigation_method or "Border strip / Furrow / Drip",
            "fertilizer_requirement": crop.fertilizer_requirement or "Consult university package of practices",
            "common_diseases": crop.common_diseases or "Scout weekly for foliar leaf spots and root rots"
        }
