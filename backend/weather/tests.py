import datetime
from unittest.mock import patch
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import WeatherRecord
from .services import WeatherService


class WeatherTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='weather_tester', password='password123')
        self.client.force_authenticate(user=self.user)

        self.record = WeatherRecord.objects.create(
            state="Gujarat",
            district="Valsad",
            latitude=20.6105,
            longitude=72.9258,
            temperature=30.5,
            feels_like=33.0,
            humidity=72.0,
            rainfall=0.0,
            wind_speed=12.0,
            weather_condition="Clear sky",
            recorded_at=datetime.datetime(2024, 10, 1, 12, 0, tzinfo=datetime.timezone.utc),
            data_source="Test Mock",
            is_manual=False
        )

    def test_weather_history(self):
        res = self.client.get('/api/v1/weather/history/?district=Valsad')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(len(data) >= 1)

    def test_weather_manual_entry(self):
        manual_data = {
            "state": "Gujarat",
            "district": "Surat",
            "latitude": 21.1702,
            "longitude": 72.8311,
            "temperature": 32.0,
            "humidity": 65.0,
            "rainfall": 1.5,
            "wind_speed": 14.0,
            "weather_condition": "Partly cloudy",
            "recorded_at": "2024-10-02T10:00:00Z"
        }
        res = self.client.post('/api/v1/weather/manual-entry/', manual_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data['is_manual'])
        self.assertEqual(res.data['data_source'], 'Manual Entry')

    @patch('requests.get')
    def test_weather_fetch_from_api_mocked(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.raise_for_status = lambda: None
        mock_get.return_value.json.return_value = {
            "current": {
                "time": "2024-10-02T14:00",
                "temperature_2m": 31.2,
                "apparent_temperature": 34.0,
                "relative_humidity_2m": 60.0,
                "rain": 0.0,
                "precipitation": 0.0,
                "wind_speed_10m": 15.0,
                "wind_direction_10m": 220.0,
                "surface_pressure": 1012.0,
                "weather_code": 0
            }
        }

        fetch_data = {
            "latitude": 22.3039,
            "longitude": 70.8022,
            "district": "Rajkot"
        }
        res = self.client.post('/api/v1/weather/fetch/', fetch_data, format='json')
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertTrue(res.data['success'])
        self.assertEqual(res.data['data']['temperature'], 31.2)

    def test_weather_summary(self):
        res = self.client.get('/api/v1/weather/summary/?district=Valsad')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('last_24_hours', res.data)
        self.assertIn('last_7_days', res.data)
