from django.urls import path
from .views import (
    UploadCSVView,
    SummaryView,
    HistoryView,
    DatasetView,
    GeneratePDFView,
    ExportExcelView,
)

urlpatterns = [
    path('upload-csv/', UploadCSVView.as_view(), name='upload-csv'),
    path('summary/', SummaryView.as_view(), name='summary'),
    path('history/', HistoryView.as_view(), name='history'),
    path('dataset/<int:id>/', DatasetView.as_view(), name='dataset'),
    path('generate-pdf/<int:id>/', GeneratePDFView.as_view(), name='generate-pdf'),
    path('export-excel/<int:id>/', ExportExcelView.as_view(), name='export-excel'),
]
