from rest_framework import serializers
from .models import DatasetImportHistory


class DatasetUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetImportHistory
        fields = ['id', 'dataset_name', 'dataset_type', 'uploaded_file', 'created_at']

    def validate_uploaded_file(self, value):
        import os
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ['.csv', '.xlsx', '.xls', '.json']:
            raise serializers.ValidationError("Unsupported file extension. Allowed extensions are: .csv, .xlsx, .xls, .json")
        # Max file size 25MB
        if value.size > 25 * 1024 * 1024:
            raise serializers.ValidationError("File size exceeds 25MB limit.")
        return value


class DatasetImportHistorySerializer(serializers.ModelSerializer):
    imported_by_username = serializers.ReadOnlyField(source='imported_by.username')

    class Meta:
        model = DatasetImportHistory
        fields = [
            'id', 'dataset_name', 'dataset_type', 'uploaded_file',
            'total_rows', 'successful_rows', 'failed_rows', 'skipped_rows',
            'import_status', 'batch_id', 'column_mapping',
            'imported_by', 'imported_by_username', 'created_at'
        ]


class DatasetPreviewSerializer(serializers.Serializer):
    dataset_id = serializers.IntegerField(required=True)
    limit = serializers.IntegerField(required=False, default=15, min_value=1, max_value=100)


class DatasetExecuteImportSerializer(serializers.Serializer):
    dataset_id = serializers.IntegerField(required=True)
    column_mapping = serializers.DictField(child=serializers.CharField(), required=False)
    skip_duplicates = serializers.BooleanField(required=False, default=True)


class DatasetExportSerializer(serializers.Serializer):
    dataset_type = serializers.ChoiceField(choices=['soil', 'crop', 'crop_record', 'weather', 'fertilizer', 'disease', 'pest'])
    format = serializers.ChoiceField(choices=['csv', 'xlsx', 'json'], default='csv')
