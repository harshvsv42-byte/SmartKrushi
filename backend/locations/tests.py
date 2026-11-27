from rest_framework.test import APITestCase
from rest_framework import status
from .models import State, District, Taluka, Village


class LocationTests(APITestCase):

    def setUp(self):
        self.state = State.objects.create(state_name="Gujarat", latitude=22.25, longitude=71.19)
        self.district = District.objects.create(state=self.state, district_name="Valsad", latitude=20.61, longitude=72.92)
        self.taluka = Taluka.objects.create(district=self.district, taluka_name="Pardi", latitude=20.51, longitude=72.95)
        self.village = Village.objects.create(taluka=self.taluka, village_name="Killa-Pardi")

    def test_get_states(self):
        res = self.client.get('/api/v1/locations/states/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Results can be paginated
        data = res.data.get('results', res.data)
        self.assertTrue(any(s['state_name'] == "Gujarat" for s in data))

    def test_get_districts_hierarchical_filtering(self):
        res = self.client.get(f'/api/v1/locations/districts/?state={self.state.state_name}')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(any(d['district_name'] == "Valsad" for d in data))

    def test_get_talukas_by_district(self):
        res = self.client.get(f'/api/v1/locations/talukas/?district={self.district.district_name}')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(any(t['taluka_name'] == "Pardi" for t in data))

    def test_get_villages_by_taluka(self):
        res = self.client.get(f'/api/v1/locations/villages/?taluka={self.taluka.taluka_name}')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data.get('results', res.data)
        self.assertTrue(any(v['village_name'] == "Killa-Pardi" for v in data))
