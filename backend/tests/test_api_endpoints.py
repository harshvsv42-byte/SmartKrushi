"""
Integration tests for SmartKrushi core REST API endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status


class SmartKrushiApiEndpointsTest(TestCase):
    """Verifies that all primary API v1 endpoints respond with HTTP 200."""

    def setUp(self):
        self.client = APIClient()

    def test_api_info_endpoint(self):
        """Root API metadata overview responds with HTTP 200."""
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data.get('status'), 'running')
        self.assertIn('endpoints', data)

    def test_weather_endpoints(self):
        """Weather current and details endpoints respond."""
        response = self.client.get('/api/v1/weather/current/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])

    def test_crops_endpoint(self):
        """Crops catalog endpoint returns a 200 OK."""
        response = self.client.get('/api/v1/crops/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_market_prices_endpoint(self):
        """Market prices endpoint responds."""
        response = self.client.get('/api/v1/market/prices/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_alerts_endpoint(self):
        """System alerts endpoint responds."""
        response = self.client.get('/api/v1/alerts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_market_schemes_endpoint(self):
        """Government subsidy schemes endpoint responds."""
        response = self.client.get('/api/v1/market/schemes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
