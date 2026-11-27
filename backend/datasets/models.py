import uuid
from django.db import models
from django.contrib.auth.models import User


class DatasetImportHistory(models.Model):
    DATASET_TYPE_CHOICES = [
        ('soil', 'Soil Records (soil.SoilRecord)'),
        ('crop', 'Crop Catalog (crops.Crop)'),
        ('crop_record', 'Crop Production Records (crops.CropRecord)'),
        ('weather', 'Weather Records (weather.WeatherRecord)'),
        ('fertilizer', 'Fertilizer Catalog (fertilizers.Fertilizer)'),
        ('disease', 'Plant Diseases (plant_health.PlantDisease)'),
        ('pest', 'Pests Catalog (plant_health.Pest)'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending Preview'),
        ('PREVIEWED', 'Previewed'),
        ('PROCESSING', 'Processing Import'),
        ('COMPLETED', 'Successfully Completed'),
        ('PARTIAL', 'Completed with Errors / Skipped Rows'),
        ('FAILED', 'Failed'),
        ('ROLLED_BACK', 'Rolled Back'),
    ]

    dataset_name = models.CharField(max_length=255)
    dataset_type = models.CharField(max_length=50, choices=DATASET_TYPE_CHOICES, db_index=True)
    uploaded_file = models.FileField(upload_to='datasets/uploads/')

    total_rows = models.PositiveIntegerField(default=0)
    successful_rows = models.PositiveIntegerField(default=0)
    failed_rows = models.PositiveIntegerField(default=0)
    skipped_rows = models.PositiveIntegerField(default=0)

    import_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    error_report = models.JSONField(default=list, blank=True)
    column_mapping = models.JSONField(default=dict, blank=True)

    # Identifiers for rollback support
    batch_id = models.CharField(max_length=64, default=uuid.uuid4, db_index=True)
    imported_record_ids = models.JSONField(default=list, blank=True, help_text="IDs of created records to allow rollback")

    imported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'dataset_import_history'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.dataset_name} ({self.dataset_type}) - {self.import_status} [{self.successful_rows}/{self.total_rows} rows]"
