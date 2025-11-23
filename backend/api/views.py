from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import DatasetSerializer
from .models import Dataset
import pandas as pd



class UploadCSVView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']

        try:
            df = pd.read_csv(file)
            
            summary = {
                'total_equipment': len(df),
                'avg_flowrate': df["Flowrate"].mean(),
                'avg_pressure': df["Pressure"].mean(),
                'avg_temperature': df["Temperature"].mean(),
                'type_distribution': df["Type"].value_counts().to_dict()
            }

            dataset = Dataset.objects.create(file=file, summary=summary)
            
            # Keep only the last 5 entries
            all_datasets = Dataset.objects.all().order_by('-uploaded_at')
            if all_datasets.count() > 5:
                oldest_dataset = all_datasets.last()
                oldest_dataset.delete()

            serializer = DatasetSerializer(dataset)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            latest_dataset = Dataset.objects.latest('uploaded_at')
            return Response(latest_dataset.summary)
        except Dataset.DoesNotExist:
            return Response({
                'total_equipment': 0,
                'avg_flowrate': 0.0,
                'avg_pressure': 0.0,
                'avg_temperature': 0.0,
                'type_distribution': {}
            }, status=status.HTTP_200_OK)

class HistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            history = Dataset.objects.all().order_by('-uploaded_at')[:5]
            serializer = DatasetSerializer(history, many=True)
            return Response(serializer.data)
        except Dataset.DoesNotExist:
            return Response({'error': 'No dataset found'}, status=status.HTTP_404_NOT_FOUND)

class DatasetView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        try:
            dataset = Dataset.objects.get(id=id)
            
            # Read the csv and return as json
            df = pd.read_csv(dataset.file.path)
            
            return Response(df.to_dict('records'))

        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

from django.http import HttpResponse
import io
from django.http import HttpResponse

class ExportExcelView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        try:
            dataset = Dataset.objects.get(id=id)
            df = pd.read_csv(dataset.file.path)

            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Data')
                
                # Create a summary sheet
                summary_df = pd.DataFrame([dataset.summary])
                summary_df.to_excel(writer, index=False, sheet_name='Summary')

            output.seek(0)
            
            response = HttpResponse(
                output,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="dataset_{id}.xlsx"'
            
            return response

        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

class GeneratePDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        try:
            dataset = Dataset.objects.get(id=id)
            summary = dataset.summary

            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="summary_{id}.pdf"'

            doc = SimpleDocTemplate(response, pagesize=letter)
            elements = []
            styles = getSampleStyleSheet()

            # Title
            elements.append(Paragraph("Chemical Equipment Analysis Report", styles['Title']))
            elements.append(Spacer(1, 12))

            # Summary Table
            summary_data = [
                ['Metric', 'Value'],
                ['Total Equipment', summary['total_equipment']],
                ['Avg. Flowrate', f"{summary['avg_flowrate']:.2f}"],
                ['Avg. Pressure', f"{summary['avg_pressure']:.2f}"],
                ['Avg. Temperature', f"{summary['avg_temperature']:.2f}"],
            ]
            
            summary_table = Table(summary_data)
            summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0,0), (-1,-1), 1, colors.black)
            ]))
            elements.append(summary_table)
            elements.append(Spacer(1, 12))

            # Type Distribution
            elements.append(Paragraph("Equipment Type Distribution", styles['h2']))
            type_data = [['Type', 'Count']]
            for key, value in summary['type_distribution'].items():
                type_data.append([key, value])

            type_table = Table(type_data)
            type_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0,0), (-1,-1), 1, colors.black)
            ]))
            elements.append(type_table)
            elements.append(Spacer(1, 12))
            
            # Timestamp and Footer
            elements.append(Paragraph(f"Report generated on: {dataset.uploaded_at}", styles['Normal']))
            elements.append(Spacer(1, 24))
            elements.append(Paragraph("Generated by Chemical Equipment Visualizer", styles['Italic']))

            doc.build(elements)

            return response

        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)