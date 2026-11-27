import datetime
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import SoilRecord


class SoilTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='test_officer', password='password123')
        self.client.force_authenticate(user=self.user)

        self.soil = SoilRecord.objects.create(
            state="Gujarat",
            district="Valsad",
            taluka="Pardi",
            village="Killa-Pardi",
            soil_name="Coastal Alluvial",
            soil_type="Alluvial",
            soil_ph=6.8,
            nitrogen=320.0,
            phosphorus=18.0,
            potassium=220.0,
            organic_carbon=0.75,
            electrical_conductivity=0.4,
            sand_percentage=40.0,
            silt_percentage=30.0,
            clay_percentage=30.0,
            sample_date=datetime.date(2024, 5, 1)
        )

    def test_soil_crud_operations(self):
        # Read
        res = self.client.get(f'/api/v1/soil/{self.soil.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['soil_type'], 'Alluvial')
        self.assertEqual(res.data['ph_category'], 'Neutral / Optimal')

        # Create
        new_data = {
            "state": "Gujarat",
            "district": "Surat",
            "soil_type": "Black",
            "soil_ph": 7.4,
            "nitrogen": 250.0,
            "phosphorus": 12.0,
            "potassium": 280.0,
            "sample_date": "2024-06-01"
        }
        create_res = self.client.post('/api/v1/soil/', new_data, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)

        # Update
        patch_res = self.client.patch(f'/api/v1/soil/{self.soil.id}/', {"soil_ph": 7.1}, format='json')
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data['soil_ph'], 7.1)

    def test_soil_ph_validation(self):
        invalid_data = {
            "state": "Gujarat",
            "district": "Surat",
            "soil_type": "Black",
            "soil_ph": 15.5  # Out of range 0-14
        }
        res = self.client.post('/api/v1/soil/', invalid_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_soil_by_location(self):
        res = self.client.get('/api/v1/soil/by-location/?district=Valsad')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(len(data) >= 1)

    def test_soil_analysis_endpoint(self):
        res = self.client.get(f'/api/v1/soil/analysis/?soil_id={self.soil.id}')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('nutrients_analysis', res.data)
        self.assertIn('nitrogen', res.data['nutrients_analysis'])
        self.assertIn('overall_health_score', res.data)

    def test_soil_statistics_endpoint(self):
        res = self.client.get('/api/v1/soil/statistics/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('total_records', res.data)
        self.assertIn('averages', res.data)
