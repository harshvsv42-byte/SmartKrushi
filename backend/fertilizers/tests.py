from rest_framework.test import APITestCase
from rest_framework import status
from .models import Fertilizer


class FertilizerTests(APITestCase):

    def setUp(self):
        self.urea = Fertilizer.objects.create(
            fertilizer_name="Urea (46% N)",
            fertilizer_type="Chemical",
            nitrogen_percentage=46.0,
            recommended_crops="Wheat, Paddy, Cotton",
            application_method="Top dressing",
            dosage_per_hectare="150 kg/ha"
        )
        self.dap = Fertilizer.objects.create(
            fertilizer_name="DAP (18-46-0)",
            fertilizer_type="Chemical",
            nitrogen_percentage=18.0,
            phosphorus_percentage=46.0,
            recommended_crops="All crops",
            application_method="Basal placement"
        )

    def test_fertilizer_list(self):
        res = self.client.get('/api/v1/fertilizers/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_fertilizer_by_crop(self):
        res = self.client.get('/api/v1/fertilizers/by-crop/?crop=Wheat')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(any(f['fertilizer_name'] == "Urea (46% N)" for f in data))

    def test_fertilizer_recommendations(self):
        # Deficit nitrogen test
        res = self.client.get('/api/v1/fertilizers/recommendations/?nitrogen=180&phosphorus=8&crop_name=Wheat')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('advisory_guidelines', res.data)
        self.assertIn('recommended_fertilizers', res.data)
        self.assertIn('disclaimer', res.data)
