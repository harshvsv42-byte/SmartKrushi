import io
import json
import pandas as pd
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import DatasetImportHistory
from soil.models import SoilRecord


class DatasetTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='dataset_admin', password='password123', is_staff=True)
        self.client.force_authenticate(user=self.user)

    def test_csv_upload_and_preview(self):
        csv_content = (
            "state,district,soil_type,soil_ph,nitrogen\n"
            "Gujarat,Valsad,Alluvial,6.8,310\n"
            "Gujarat,Surat,Black,7.2,340\n"
        ).encode('utf-8')
        uploaded = SimpleUploadedFile("soil.csv", csv_content, content_type="text/csv")

        upload_res = self.client.post('/api/v1/datasets/upload/', {
            "dataset_name": "Test Soil Upload",
            "dataset_type": "soil",
            "uploaded_file": uploaded
        }, format='multipart')

        self.assertEqual(upload_res.status_code, status.HTTP_201_CREATED)
        dataset_id = upload_res.data['dataset_id']
        self.assertIn('preview', upload_res.data)
        self.assertEqual(upload_res.data['preview']['total_rows'], 2)

        # Import execution
        import_res = self.client.post('/api/v1/datasets/import/', {
            "dataset_id": dataset_id
        }, format='json')
        self.assertEqual(import_res.status_code, status.HTTP_200_OK)
        self.assertEqual(import_res.data['result']['successful_rows'], 2)
        self.assertEqual(SoilRecord.objects.filter(district='Valsad').count(), 1)

    def test_json_upload_and_import(self):
        json_data = [
            {"state": "Gujarat", "district": "Anand", "soil_type": "Alluvial", "soil_ph": 7.0, "nitrogen": 290},
            {"state": "Gujarat", "district": "Kheda", "soil_type": "Alluvial", "soil_ph": 7.1, "nitrogen": 300},
        ]
        uploaded = SimpleUploadedFile("soil.json", json.dumps(json_data).encode('utf-8'), content_type="application/json")

        upload_res = self.client.post('/api/v1/datasets/upload/', {
            "dataset_name": "Test JSON Import",
            "dataset_type": "soil",
            "uploaded_file": uploaded
        }, format='multipart')

        dataset_id = upload_res.data['dataset_id']
        import_res = self.client.post('/api/v1/datasets/import/', {"dataset_id": dataset_id}, format='json')
        self.assertEqual(import_res.status_code, status.HTTP_200_OK)
        self.assertEqual(import_res.data['result']['successful_rows'], 2)
        self.assertTrue(SoilRecord.objects.filter(district="Anand").exists())

    def test_excel_upload_and_import(self):
        df = pd.DataFrame([
            {"state": "Gujarat", "district": "Bhavnagar", "soil_type": "Black", "soil_ph": 7.5, "nitrogen": 220},
            {"state": "Gujarat", "district": "Amreli", "soil_type": "Medium Black", "soil_ph": 7.3, "nitrogen": 240},
        ])
        excel_io = io.BytesIO()
        df.to_excel(excel_io, index=False)
        excel_io.seek(0)
        uploaded = SimpleUploadedFile("soil.xlsx", excel_io.getvalue(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

        upload_res = self.client.post('/api/v1/datasets/upload/', {
            "dataset_name": "Test Excel Import",
            "dataset_type": "soil",
            "uploaded_file": uploaded
        }, format='multipart')
        self.assertEqual(upload_res.status_code, status.HTTP_201_CREATED)

        dataset_id = upload_res.data['dataset_id']
        import_res = self.client.post('/api/v1/datasets/import/', {"dataset_id": dataset_id}, format='json')
        self.assertEqual(import_res.status_code, status.HTTP_200_OK)
        self.assertEqual(import_res.data['result']['successful_rows'], 2)
        self.assertTrue(SoilRecord.objects.filter(district="Bhavnagar").exists())

    def test_invalid_data_handling_and_reporting(self):
        # Missing required field 'district' and invalid pH in row 2
        csv_content = (
            "state,district,soil_type,soil_ph\n"
            "Gujarat,,Black,7.0\n"               # Row 1: missing district
            "Gujarat,Rajkot,Black,18.5\n"         # Row 2: invalid pH > 14
            "Gujarat,Jamnagar,Black,7.2\n"        # Row 3: valid
        ).encode('utf-8')
        uploaded = SimpleUploadedFile("invalid.csv", csv_content, content_type="text/csv")

        upload_res = self.client.post('/api/v1/datasets/upload/', {
            "dataset_name": "Test Invalid Rows",
            "dataset_type": "soil",
            "uploaded_file": uploaded
        }, format='multipart')

        dataset_id = upload_res.data['dataset_id']
        import_res = self.client.post('/api/v1/datasets/import/', {"dataset_id": dataset_id}, format='json')
        self.assertEqual(import_res.status_code, status.HTTP_200_OK)
        # 1 successful row, 2 failed rows
        self.assertEqual(import_res.data['result']['successful_rows'], 1)
        self.assertEqual(import_res.data['result']['failed_rows'], 2)

        # Check errors endpoint
        err_res = self.client.get(f'/api/v1/datasets/{dataset_id}/errors/')
        self.assertEqual(err_res.status_code, status.HTTP_200_OK)
        self.assertEqual(err_res.data['total_errors'], 2)

    def test_import_batch_rollback(self):
        csv_content = (
            "state,district,soil_type,soil_ph\n"
            "Gujarat,Patan,Sandy Loam,7.8\n"
            "Gujarat,Patan,Alluvial,7.6\n"
        ).encode('utf-8')
        uploaded = SimpleUploadedFile("rollback.csv", csv_content, content_type="text/csv")

        upload_res = self.client.post('/api/v1/datasets/upload/', {
            "dataset_name": "Test Rollback",
            "dataset_type": "soil",
            "uploaded_file": uploaded
        }, format='multipart')

        dataset_id = upload_res.data['dataset_id']
        self.client.post('/api/v1/datasets/import/', {"dataset_id": dataset_id}, format='json')
        self.assertEqual(SoilRecord.objects.filter(district='Patan').count(), 2)

        # Rollback
        rollback_res = self.client.post(f'/api/v1/datasets/{dataset_id}/rollback/')
        self.assertEqual(rollback_res.status_code, status.HTTP_200_OK)
        self.assertTrue(rollback_res.data['success'])
        # Records should be removed
        self.assertEqual(SoilRecord.objects.filter(district='Patan').count(), 0)

    def test_export_data_endpoint(self):
        SoilRecord.objects.create(state="Gujarat", district="Dahod", soil_ph=7.0, soil_type="Red")
        res = self.client.get('/api/v1/datasets/export/?dataset_type=soil&format=csv')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res['Content-Type'], 'text/csv')
