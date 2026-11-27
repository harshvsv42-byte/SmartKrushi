from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Crop, CropRecord


class CropTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='agri_officer', password='password123')
        self.client.force_authenticate(user=self.user)

        self.crop = Crop.objects.create(
            crop_name="Wheat",
            scientific_name="Triticum aestivum",
            crop_category="Cereal",
            growing_season="Rabi",
            crop_duration_days=120,
            suitable_soil="Alluvial, Clay Loam",
            suitable_ph_min=6.0,
            suitable_ph_max=7.5,
            temperature_min=10.0,
            temperature_max=25.0
        )

        self.crop_record = CropRecord.objects.create(
            state="Gujarat",
            district="Ahmedabad",
            crop=self.crop,
            crop_name="Wheat",
            growing_season="Rabi",
            area_hectares=1000.0,
            production_tonnes=3500.0,
            year=2024
        )

    def test_crop_list_and_filter(self):
        res = self.client.get('/api/v1/crops/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res_season = self.client.get('/api/v1/crops/by-season/?season=Rabi')
        self.assertEqual(res_season.status_code, status.HTTP_200_OK)
        data = res_season.data.get('results', res_season.data)
        self.assertTrue(any(c['crop_name'] == "Wheat" for c in data))

    def test_crops_suitable_for_soil(self):
        res = self.client.get('/api/v1/crops/suitable-for-soil/?soil_ph=6.8&soil_type=Alluvial')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(any(c['crop_name'] == "Wheat" for c in data))

    def test_crop_record_auto_computed_yield(self):
        # 3500 tonnes on 1000 hectares = 3500 kg/ha
        self.assertEqual(self.crop_record.yield_kg_per_hectare, 3500.0)

    def test_crops_by_location(self):
        res = self.client.get('/api/v1/crops/by-location/?district=Ahmedabad')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('Wheat', res.data['crop_names'])
