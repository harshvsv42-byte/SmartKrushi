from django.contrib import admin, messages
from .models import DatasetImportHistory
from .importer import DatasetProcessor


@admin.register(DatasetImportHistory)
class DatasetImportHistoryAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'dataset_name', 'dataset_type',
        'import_status', 'total_rows', 'successful_rows',
        'failed_rows', 'skipped_rows', 'batch_id', 'created_at'
    )
    list_filter = ('dataset_type', 'import_status', 'created_at')
    search_fields = ('dataset_name', 'batch_id')
    ordering = ('-created_at',)
    readonly_fields = ('total_rows', 'successful_rows', 'failed_rows', 'skipped_rows', 'batch_id', 'created_at')

    actions = ['process_selected_imports', 'rollback_selected_imports']

    @admin.action(description="Process selected pending dataset imports")
    def process_selected_imports(self, request, queryset):
        count = 0
        for history in queryset:
            if history.import_status in ['PENDING', 'PREVIEWED']:
                try:
                    DatasetProcessor.process_import(history)
                    count += 1
                except Exception as e:
                    self.message_user(request, f"Error processing {history.dataset_name}: {str(e)}", level=messages.ERROR)
        if count:
            self.message_user(request, f"Successfully processed {count} dataset import(s).", level=messages.SUCCESS)

    @admin.action(description="Rollback selected completed dataset imports")
    def rollback_selected_imports(self, request, queryset):
        count = 0
        for history in queryset:
            if history.import_status in ['COMPLETED', 'PARTIAL']:
                res = DatasetProcessor.rollback(history)
                if res.get('success'):
                    count += 1
                else:
                    self.message_user(request, f"Could not rollback {history.dataset_name}: {res.get('message')}", level=messages.WARNING)
        if count:
            self.message_user(request, f"Successfully rolled back {count} dataset import(s).", level=messages.SUCCESS)
