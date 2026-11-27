import os
import json
import uuid
import pandas as pd
from typing import Dict, Any, List, Tuple
from django.db import transaction
from django.core.files.base import ContentFile
from .models import DatasetImportHistory
from soil.models import SoilRecord
from crops.models import Crop, CropRecord
from weather.models import WeatherRecord
from fertilizers.models import Fertilizer
from plant_health.models import PlantDisease, Pest

# Mapping configuration: target model and default fields for each dataset type
MODEL_CONFIG = {
    'soil': {
        'model': SoilRecord,
        'unique_check': ['state', 'district', 'sample_date'],
        'required_fields': ['state', 'district', 'soil_ph'],
        'field_types': {
            'soil_ph': float, 'nitrogen': float, 'phosphorus': float,
            'potassium': float, 'organic_carbon': float, 'electrical_conductivity': float,
            'sand_percentage': float, 'silt_percentage': float, 'clay_percentage': float,
            'sulphur': float, 'zinc': float, 'iron': float, 'boron': float
        }
    },
    'crop': {
        'model': Crop,
        'unique_check': ['crop_name'],
        'required_fields': ['crop_name'],
        'field_types': {
            'crop_duration_days': int, 'suitable_ph_min': float, 'suitable_ph_max': float,
            'temperature_min': float, 'temperature_max': float
        }
    },
    'crop_record': {
        'model': CropRecord,
        'unique_check': ['state', 'district', 'crop_name', 'year', 'growing_season'],
        'required_fields': ['state', 'district', 'crop_name'],
        'field_types': {
            'crop_duration_days': int, 'area_hectares': float,
            'production_tonnes': float, 'yield_kg_per_hectare': float, 'year': int
        }
    },
    'weather': {
        'model': WeatherRecord,
        'unique_check': ['latitude', 'longitude', 'recorded_at'],
        'required_fields': ['latitude', 'longitude', 'temperature', 'humidity', 'recorded_at'],
        'field_types': {
            'latitude': float, 'longitude': float, 'temperature': float,
            'feels_like': float, 'humidity': float, 'rainfall': float,
            'wind_speed': float, 'wind_direction': float, 'pressure': float
        }
    },
    'fertilizer': {
        'model': Fertilizer,
        'unique_check': ['fertilizer_name'],
        'required_fields': ['fertilizer_name'],
        'field_types': {
            'nitrogen_percentage': float, 'phosphorus_percentage': float,
            'potassium_percentage': float, 'sulphur_percentage': float
        }
    },
    'disease': {
        'model': PlantDisease,
        'unique_check': ['crop_name', 'disease_name'],
        'required_fields': ['crop_name', 'disease_name', 'symptoms'],
        'field_types': {}
    },
    'pest': {
        'model': Pest,
        'unique_check': ['pest_name'],
        'required_fields': ['pest_name', 'symptoms'],
        'field_types': {}
    }
}


class DatasetProcessor:

    @classmethod
    def load_dataframe(cls, file_path: str) -> pd.DataFrame:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.csv':
            # Try utf-8, fallback to latin-1
            try:
                df = pd.read_csv(file_path, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(file_path, encoding='latin-1')
        elif ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file_path)
        elif ext == '.json':
            df = pd.read_json(file_path)
        else:
            raise ValueError(f"Unsupported file format '{ext}'. Supported formats: CSV, XLSX, JSON.")
        return df

    @classmethod
    def preview(cls, file_path: str, dataset_type: str, limit: int = 15) -> Dict[str, Any]:
        df = cls.load_dataframe(file_path)
        total_rows = len(df)
        detected_columns = list(df.columns)

        # Sanitize NaN for JSON serialization
        preview_df = df.head(limit).fillna("")
        records = preview_df.to_dict(orient='records')

        # Auto suggest column mapping to model fields
        config = MODEL_CONFIG.get(dataset_type, {})
        model = config.get('model')
        model_fields = []
        if model:
            model_fields = [f.name for f in model._meta.get_fields() if not f.is_relation and f.name not in ['id', 'created_at', 'updated_at']]

        suggested_mapping = {}
        for col in detected_columns:
            clean_col = col.strip().lower().replace(" ", "_").replace("-", "_")
            for mf in model_fields:
                if clean_col == mf or clean_col in mf or mf in clean_col:
                    suggested_mapping[col] = mf
                    break

        return {
            "total_rows": total_rows,
            "preview_limit": limit,
            "detected_columns": detected_columns,
            "suggested_mapping": suggested_mapping,
            "available_model_fields": model_fields,
            "required_fields": config.get('required_fields', []),
            "preview_data": records
        }

    @classmethod
    def process_import(cls, history: DatasetImportHistory, column_mapping: Dict[str, str] = None, skip_duplicates: bool = True) -> Dict[str, Any]:
        file_path = history.uploaded_file.path
        df = cls.load_dataframe(file_path)
        total_rows = len(df)

        config = MODEL_CONFIG.get(history.dataset_type)
        if not config:
            raise ValueError(f"Unknown dataset type: {history.dataset_type}")

        model = config['model']
        required_fields = config['required_fields']
        field_types = config.get('field_types', {})
        unique_check = config.get('unique_check', [])

        # Default mapping if none supplied: column name lower-case underscored
        if not column_mapping:
            column_mapping = {}
            for col in df.columns:
                clean = col.strip().lower().replace(" ", "_").replace("-", "_")
                column_mapping[col] = clean

        history.column_mapping = column_mapping
        history.total_rows = total_rows
        history.import_status = 'PROCESSING'
        history.save()

        # Rename dataframe columns per mapping
        valid_records = []
        error_report = []
        skipped_count = 0
        imported_ids = []

        batch_id = str(uuid.uuid4())
        history.batch_id = batch_id

        for idx, row in df.iterrows():
            row_num = int(idx) + 1
            record_dict = {}
            has_error = False

            # Map columns
            for file_col, model_field in column_mapping.items():
                if file_col in row and model_field:
                    val = row[file_col]
                    if pd.isna(val):
                        val = None
                    record_dict[model_field] = val

            # 1. Validate required fields
            for rf in required_fields:
                val = record_dict.get(rf)
                if val is None or str(val).strip() == "":
                    error_report.append({
                        "row": row_num,
                        "field": rf,
                        "error": f"Missing mandatory field '{rf}'",
                        "data": {k: str(v) for k, v in record_dict.items() if v is not None}
                    })
                    has_error = True
                    break

            if has_error:
                continue

            # 2. Type conversions & range validations
            for field, f_type in field_types.items():
                if field in record_dict and record_dict[field] is not None:
                    try:
                        record_dict[field] = f_type(record_dict[field])
                    except (ValueError, TypeError):
                        error_report.append({
                            "row": row_num,
                            "field": field,
                            "error": f"Value '{record_dict[field]}' cannot be converted to {f_type.__name__}",
                            "data": {k: str(v) for k, v in record_dict.items() if v is not None}
                        })
                        has_error = True
                        break

            if has_error:
                continue

            # Special validation for soil pH
            if 'soil_ph' in record_dict and record_dict['soil_ph'] is not None:
                ph = record_dict['soil_ph']
                if ph < 0.0 or ph > 14.0:
                    error_report.append({
                        "row": row_num,
                        "field": "soil_ph",
                        "error": f"Soil pH {ph} is invalid; must be between 0.0 and 14.0",
                        "data": record_dict
                    })
                    continue

            # Special validation for weather recorded_at
            if history.dataset_type == 'weather' and 'recorded_at' in record_dict:
                try:
                    record_dict['recorded_at'] = pd.to_datetime(record_dict['recorded_at']).to_pydatetime()
                except Exception:
                    error_report.append({
                        "row": row_num,
                        "field": "recorded_at",
                        "error": f"Invalid datetime string for recorded_at: {record_dict['recorded_at']}",
                        "data": record_dict
                    })
                    continue

            # 3. Duplicate detection
            if unique_check and skip_duplicates:
                filter_kwargs = {}
                for uf in unique_check:
                    if uf in record_dict and record_dict[uf] is not None:
                        filter_kwargs[uf] = record_dict[uf]

                if len(filter_kwargs) == len(unique_check):
                    if model.objects.filter(**filter_kwargs).exists():
                        skipped_count += 1
                        continue

            # Valid instance prepared
            valid_records.append(model(**record_dict))

        # Perform bulk database insert in chunks with transactions
        successful_count = 0
        if valid_records:
            with transaction.atomic():
                # In Django 4.2+, bulk_create returns instances with primary keys populated
                created_objs = model.objects.bulk_create(valid_records, batch_size=500)
                imported_ids = [obj.pk for obj in created_objs if obj.pk]
                successful_count = len(created_objs)

        failed_count = len(error_report)
        status_val = 'COMPLETED' if failed_count == 0 and skipped_count == 0 else ('PARTIAL' if successful_count > 0 else 'FAILED')

        history.successful_rows = successful_count
        history.failed_rows = failed_count
        history.skipped_rows = skipped_count
        history.error_report = error_report
        history.imported_record_ids = imported_ids
        history.import_status = status_val
        history.save()

        return {
            "batch_id": batch_id,
            "status": status_val,
            "total_rows": total_rows,
            "successful_rows": successful_count,
            "skipped_rows": skipped_count,
            "failed_rows": failed_count,
            "error_count": len(error_report),
            "errors": error_report[:50]  # First 50 errors in response
        }

    @classmethod
    def rollback(cls, history: DatasetImportHistory) -> Dict[str, Any]:
        if history.import_status == 'ROLLED_BACK':
            return {"success": False, "message": "This import has already been rolled back."}

        record_ids = history.imported_record_ids
        if not record_ids:
            return {"success": False, "message": "No tracked record IDs found for this import batch."}

        config = MODEL_CONFIG.get(history.dataset_type)
        if not config:
            return {"success": False, "message": f"Unknown dataset type: {history.dataset_type}"}

        model = config['model']
        with transaction.atomic():
            deleted_count, _ = model.objects.filter(pk__in=record_ids).delete()
            history.import_status = 'ROLLED_BACK'
            history.imported_record_ids = []
            history.save()

        return {
            "success": True,
            "deleted_records": deleted_count,
            "message": f"Successfully rolled back batch {history.batch_id} ({deleted_count} records removed)."
        }
