from rest_framework.test import APITestCase
from rest_framework import status
from crops.models import Crop
from fertilizers.models import Fertilizer
from .engine import AgriRecommendationEngine


class RecommendationTests(APITestCase):

    def setUp(self):
        Crop.objects.create(
            crop_name="Cotton",
            crop_category="Fiber",
            growing_season="Kharif",
            suitable_soil="Black soil",
            suitable_ph_min=6.5,
            suitable_ph_max=8.0,
            temperature_min=20.0,
            temperature_max=36.0
        )
        Fertilizer.objects.create(
            fertilizer_name="Urea (46% N)",
            fertilizer_type="Chemical",
            nitrogen_percentage=46.0,
            recommended_crops="Cotton, Wheat"
        )

    def test_engine_evaluates_deficiencies_and_crops(self):
        res = AgriRecommendationEngine.evaluate(
            soil_ph=7.2,
            nitrogen=180.0,  # Deficient
            phosphorus=8.0,   # Deficient
            potassium=150.0,
            organic_carbon=0.45,
            temperature=30.0,
            rainfall=10.0,
            humidity=55.0,
            crop_name="Cotton",
            growing_season="Kharif",
            soil_type="Black soil"
        )

        self.assertIn("nutrient_deficiencies", res)
        # Should flag Nitrogen and Phosphorus
        flagged_nutrients = [d['nutrient'] for d in res["nutrient_deficiencies"]]
        self.assertTrue(any("Nitrogen" in n for n in flagged_nutrients))
        self.assertTrue(any("Phosphorus" in n for n in flagged_nutrients))

        # Suitable crops list
        self.assertTrue(len(res["suitable_crops"]) >= 1)
        self.assertEqual(res["suitable_crops"][0]["crop_name"], "Cotton")

    def test_recommendation_api_endpoints(self):
        # Full recommendation
        res = self.client.get('/api/v1/recommendations/?soil_ph=7.0&nitrogen=200&crop=Cotton')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('suitable_crops', res.data)
        self.assertIn('fertilizer_guidance', res.data)
        self.assertIn('engine_metadata', res.data)

        # Crop suitability shortcut
        res_crop = self.client.get('/api/v1/recommendations/crop-suitability/?soil_ph=7.0&season=Kharif')
        self.assertEqual(res_crop.status_code, status.HTTP_200_OK)
        self.assertIn('suitable_crops', res_crop.data)

        # Fertilizer guidance shortcut
        res_fert = self.client.get('/api/v1/recommendations/fertilizer-guidance/?nitrogen=150')
        self.assertEqual(res_fert.status_code, status.HTTP_200_OK)
        self.assertIn('nutrient_deficiencies', res_fert.data)
