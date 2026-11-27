import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import PlantDisease, Pest


class PlantHealthTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='planthealthuser', password='pass1234')
        self.disease = PlantDisease.objects.create(
            crop_name="Cotton",
            disease_name="Bacterial Blight",
            disease_category="Bacterial",
            symptoms="Water-soaked angular spots on leaves",
            treatment="Copper Oxychloride spray"
        )
        self.pest = Pest.objects.create(
            pest_name="Pink Bollworm",
            affected_crops="Cotton",
            symptoms="Rosetted flowers and damaged bolls",
            management_method="Pheromone traps"
        )

    def test_diseases_list_and_by_crop(self):
        res = self.client.get('/api/v1/diseases/by-crop/?crop=Cotton')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(any(d['disease_name'] == "Bacterial Blight" for d in data))

    def test_pests_list_and_by_crop(self):
        res = self.client.get('/api/v1/pests/by-crop/?crop=Cotton')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(any(p['pest_name'] == "Pink Bollworm" for p in data))

    def test_ai_disease_detection_endpoint(self):
        # Authenticate for POST endpoint (IsAuthenticatedOrReadOnly)
        self.client.force_authenticate(user=self.user)

        # Create a dummy image
        img_io = io.BytesIO()
        image = Image.new('RGB', (100, 100), color='green')
        image.save(img_io, format='JPEG')
        img_io.seek(0)
        uploaded_image = SimpleUploadedFile("leaf.jpg", img_io.getvalue(), content_type="image/jpeg")

        res = self.client.post('/api/v1/diseases/detect-ai/', {
            "image": uploaded_image,
            "crop_name": "Cotton"
        }, format='multipart')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'success')
        self.assertIn('preliminary_diagnostics', res.data)
