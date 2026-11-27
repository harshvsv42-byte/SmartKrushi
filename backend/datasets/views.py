import io
import json
import pandas as pd
from django.http import HttpResponse
from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import DatasetImportHistory
from .serializers import (
    DatasetUploadSerializer,
    DatasetImportHistorySerializer,
    DatasetPreviewSerializer,
    DatasetExecuteImportSerializer,
    DatasetExportSerializer,
)
from .importer import DatasetProcessor, MODEL_CONFIG


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = DatasetImportHistory.objects.all()
    serializer_class = DatasetImportHistorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['dataset_name', 'dataset_type', 'import_status', 'batch_id']
    ordering_fields = ['created_at', 'total_rows', 'successful_rows']

    @action(detail=False, methods=['post'], url_path='upload')
    def upload_dataset(self, request):
        serializer = DatasetUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save(imported_by=request.user if request.user.is_authenticated else None)

        # Immediately generate preview
        try:
            preview_data = DatasetProcessor.preview(instance.uploaded_file.path, instance.dataset_type)
            instance.total_rows = preview_data['total_rows']
            instance.import_status = 'PREVIEWED'
            instance.save()

            return Response({
                "message": "Dataset uploaded and parsed successfully.",
                "dataset_id": instance.id,
                "history": DatasetImportHistorySerializer(instance).data,
                "preview": preview_data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "message": "Uploaded, but failed to preview dataset.",
                "dataset_id": instance.id,
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='preview')
    def preview_dataset(self, request):
        serializer = DatasetPreviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        dataset_id = serializer.validated_data['dataset_id']
        limit = serializer.validated_data.get('limit', 15)

        try:
            history = DatasetImportHistory.objects.get(id=dataset_id)
        except DatasetImportHistory.DoesNotExist:
            return Response({"error": f"Dataset with id {dataset_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            preview_data = DatasetProcessor.preview(history.uploaded_file.path, history.dataset_type, limit=limit)
            return Response(preview_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to preview dataset: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='import')
    def execute_import(self, request):
        serializer = DatasetExecuteImportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        dataset_id = serializer.validated_data['dataset_id']
        column_mapping = serializer.validated_data.get('column_mapping')
        skip_duplicates = serializer.validated_data.get('skip_duplicates', True)

        try:
            history = DatasetImportHistory.objects.get(id=dataset_id)
        except DatasetImportHistory.DoesNotExist:
            return Response({"error": f"Dataset with id {dataset_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        if history.import_status == 'COMPLETED':
            return Response(
                {"error": "This dataset has already been imported. Please upload a new file or rollback first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            result = DatasetProcessor.process_import(
                history=history,
                column_mapping=column_mapping,
                skip_duplicates=skip_duplicates
            )
            return Response({
                "message": "Dataset processing completed.",
                "history": DatasetImportHistorySerializer(history).data,
                "result": result
            }, status=status.HTTP_200_OK)
        except Exception as e:
            history.import_status = 'FAILED'
            history.save()
            return Response({"error": f"Import failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='history')
    def history_list(self, request):
        qs = self.get_queryset()
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=True, methods=['get'], url_path='errors')
    def download_errors(self, request, pk=None):
        history = self.get_object()
        format_type = request.query_params.get('format', 'json').lower()

        if not history.error_report:
            return Response({"message": "No errors recorded for this import batch.", "error_count": 0})

        if format_type == 'csv':
            df_errors = pd.DataFrame(history.error_report)
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="import_{history.id}_errors.csv"'
            df_errors.to_csv(response, index=False)
            return response

        return Response({
            "dataset_id": history.id,
            "dataset_name": history.dataset_name,
            "total_errors": len(history.error_report),
            "errors": history.error_report
        })

    @action(detail=True, methods=['post'], url_path='rollback')
    def rollback_batch(self, request, pk=None):
        history = self.get_object()
        result = DatasetProcessor.rollback(history)
        http_status = status.HTTP_200_OK if result["success"] else status.HTTP_400_BAD_REQUEST
        return Response(result, status=http_status)

    @action(detail=False, methods=['get'], url_path='export')
    def export_data(self, request):
        serializer = DatasetExportSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        dataset_type = serializer.validated_data['dataset_type']
        export_format = serializer.validated_data['format']

        config = MODEL_CONFIG.get(dataset_type)
        if not config:
            return Response({"error": "Invalid dataset type."}, status=status.HTTP_400_BAD_REQUEST)

        model = config['model']
        qs = model.objects.all()

        # Location filtering support
        state = request.query_params.get('state')
        district = request.query_params.get('district')
        if state and hasattr(model, 'state'):
            qs = qs.filter(state__icontains=state)
        if district and hasattr(model, 'district'):
            qs = qs.filter(district__icontains=district)

        records = list(qs.values())
        if not records:
            return Response({"message": "No records found matching export criteria."}, status=status.HTTP_404_NOT_FOUND)

        df = pd.DataFrame(records)

        # Remove internal datetime timezone representation issues for excel if any
        for col in df.select_dtypes(include=['datetime', 'datetimetz']).columns:
            df[col] = df[col].astype(str)

        if export_format == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{dataset_type}_export.csv"'
            df.to_csv(response, index=False)
            return response
        elif export_format == 'xlsx':
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name=dataset_type)
            output.seek(0)
            response = HttpResponse(
                output.getvalue(),
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="{dataset_type}_export.xlsx"'
            return response
        else:  # json
            return Response(records)
