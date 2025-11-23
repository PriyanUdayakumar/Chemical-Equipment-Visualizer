import sys
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QListWidget, QListWidgetItem, QPushButton, QHBoxLayout, QLabel, QMessageBox, QFileDialog
import requests

class HistoryView(QWidget):
    def __init__(self, token):
        super().__init__()
        self.token = token
        self.initUI()
        self.load_history()

    def initUI(self):
        layout = QVBoxLayout()
        self.history_list = QListWidget()
        layout.addWidget(self.history_list)
        self.setLayout(layout)

    def load_history(self):
        self.history_list.clear()
        try:
            response = requests.get('http://localhost:8000/api/history/', headers={'Authorization': f'Basic {self.token}'})
            if response.status_code == 200:
                history = response.json()
                for item in history:
                    list_item = QListWidgetItem()
                    widget = self.create_history_item_widget(item)
                    list_item.setSizeHint(widget.sizeHint())
                    self.history_list.addItem(list_item)
                    self.history_list.setItemWidget(list_item, widget)
            else:
                QMessageBox.warning(self, 'Error', f'Could not load history: {response.text}')
        except requests.exceptions.RequestException as e:
            QMessageBox.warning(self, 'Error', f'Could not load history: {e}')

    def create_history_item_widget(self, item):
        widget = QWidget()
        layout = QHBoxLayout()
        
        filename = item['file'].split('/')[-1]
        timestamp = item['uploaded_at']
        
        label = QLabel(f"{filename} - Uploaded at: {timestamp}")
        
        pdf_button = QPushButton("Download PDF")
        pdf_button.clicked.connect(lambda: self.download_file(item['id'], 'pdf'))

        excel_button = QPushButton("Export to Excel")
        excel_button.clicked.connect(lambda: self.download_file(item['id'], 'excel'))
        
        layout.addWidget(label)
        layout.addStretch()
        layout.addWidget(pdf_button)
        layout.addWidget(excel_button)
        widget.setLayout(layout)
        return widget
        
    def download_file(self, dataset_id, file_type):
        url = f"http://localhost:8000/api/generate-pdf/{dataset_id}/" if file_type == 'pdf' else f"http://localhost:8000/api/export-excel/{dataset_id}/"
        extension = 'pdf' if file_type == 'pdf' else 'xlsx'
        
        options = QFileDialog.Options()
        fileName, _ = QFileDialog.getSaveFileName(self, f"Save {file_type.upper()}", f"dataset_{dataset_id}.{extension}", f"{file_type.upper()} Files (*.{extension})", options=options)
        
        if fileName:
            try:
                response = requests.get(url, headers={'Authorization': f'Basic {self.token}'}, stream=True)
                if response.status_code == 200:
                    with open(fileName, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            f.write(chunk)
                    QMessageBox.information(self, 'Success', f'{file_type.upper()} saved as {fileName}')
                else:
                    QMessageBox.warning(self, 'Error', f'Could not download {file_type.upper()}: {response.text}')
            except requests.exceptions.RequestException as e:
                QMessageBox.warning(self, 'Error', f'Could not download {file_type.upper()}: {e}')

if __name__ == '__main__':
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    history_view = HistoryView('some-fake-token')
    history_view.show()
    sys.exit(app.exec_())
