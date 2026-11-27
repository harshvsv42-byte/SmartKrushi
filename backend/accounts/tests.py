from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import FarmerProfile


class AccountAuthTests(APITestCase):

    def setUp(self):
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
        self.profile_url = '/api/v1/auth/profile/'

        self.user_data = {
            "username": "farmer_ramesh",
            "email": "ramesh@example.com",
            "password": "SecurePassword123!",
            "password_confirm": "SecurePassword123!",
            "full_name": "Ramesh Patel",
            "phone_number": "9876543210",
            "state": "Gujarat",
            "district": "Valsad",
            "farm_size": 2.5,
            "preferred_language": "gu"
        }

    def test_farmer_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['username'], 'farmer_ramesh')
        self.assertTrue(FarmerProfile.objects.filter(full_name="Ramesh Patel").exists())

    def test_registration_password_mismatch(self):
        data = self.user_data.copy()
        data['password_confirm'] = "DifferentPassword123!"
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_farmer_login_and_jwt_tokens(self):
        # First register
        self.client.post(self.register_url, self.user_data, format='json')

        # Login with username
        login_res = self.client.post(self.login_url, {
            "username": "farmer_ramesh",
            "password": "SecurePassword123!"
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', login_res.data)
        access_token = login_res.data['tokens']['access']

        # Access profile using JWT token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        profile_res = self.client.get(self.profile_url)
        self.assertEqual(profile_res.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_res.data['full_name'], 'Ramesh Patel')
        self.assertEqual(profile_res.data['district'], 'Valsad')

    def test_profile_update(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_res = self.client.post(self.login_url, {
            "username": "farmer_ramesh",
            "password": "SecurePassword123!"
        }, format='json')
        access_token = login_res.data['tokens']['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        patch_res = self.client.patch(self.profile_url, {
            "farm_size": 3.75,
            "taluka": "Pardi"
        }, format='json')
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data['farm_size'], 3.75)
        self.assertEqual(patch_res.data['taluka'], 'Pardi')

    def test_unauthenticated_profile_access_denied(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
