import sys
import pandas as pd
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QTableView, QPushButton, QFileDialog, QMessageBox
from PyQt5.QtCore import QAbstractTableModel, Qt
import requests

class PandasModel(QAbstractTableModel):
    def __init__(self, data):
        super().__init__()
        self._data = data

    def rowCount(self, parent=None):
        return self._data.shape[0]

    def columnCount(self, parent=None):
        return self._data.shape[1]

    def data(self, index, role=Qt.DisplayRole):
        if index.isValid() and role == Qt.DisplayRole:
            return str(self._data.iloc[index.row(), index.column()])
        return None

    def headerData(self, section, orientation, role=Qt.DisplayRole):
        if role == Qt.DisplayRole and orientation == Qt.Horizontal:
            return str(self._data.columns[section])
        return None

class TableView(QWidget):
    def __init__(self, token):
        super().__init__()
        self.token = token
        self.initUI()
        self.load_data()

    def initUI(self):
        layout = QVBoxLayout()
        self.table = QTableView()
        self.upload_button = QPushButton('Upload CSV')
        self.upload_button.clicked.connect(self.upload_csv)
        
        layout.addWidget(self.upload_button)
        layout.addWidget(self.table)
        self.setLayout(layout)
        
    def load_data(self):
        try:
            summary_response = requests.get('http://localhost:8000/api/summary/', headers={'Authorization': f'Basic {self.token}'})
            if summary_response.status_code == 200:
                latest_id = summary_response.json()['id']
                dataset_response = requests.get(f'http://localhost:8000/api/dataset/{latest_id}/', headers={'Authorization': f'Basic {self.token}'})
                if dataset_response.status_code == 200:
                    df = pd.DataFrame(dataset_response.json())
                    self.model = PandasModel(df)
                    self.table.setModel(self.model)
        except requests.exceptions.RequestException as e:
            QMessageBox.warning(self, 'Error', f'Could not load data: {e}')
            
    def upload_csv(self):
        options = QFileDialog.Options()
        fileName, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)", options=options)
        if fileName:
            with open(fileName, 'rb') as f:
                files = {'file': (fileName, f)}
                try:
                    response = requests.post('http://localhost:8000/api/upload-csv/', files=files, headers={'Authorization': f'Basic {self.token}'})
                    if response.status_code == 201:
                        QMessageBox.information(self, 'Success', 'File uploaded successfully.')
                        self.load_data() # Refresh the table
                    else:
                        QMessageBox.warning(self, 'Error', f'Could not upload file: {response.text}')
                except requests.exceptions.RequestException as e:
                    QMessageBox.warning(self, 'Error', f'Could not upload file: {e}')
