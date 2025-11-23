from django.db import models

class Dataset(models.Model):
    file = models.FileField(upload_to='csv_files/')
    summary = models.JSONField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name