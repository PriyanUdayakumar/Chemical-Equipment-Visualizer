import sys
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout, QMessageBox
import requests
import base64
from dashboard import DashboardWindow

class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Login')
        self.initUI()

    def initUI(self):
        layout = QVBoxLayout()

        self.username_label = QLabel('Username:')
        self.username_input = QLineEdit()
        layout.addWidget(self.username_label)
        layout.addWidget(self.username_input)

        self.password_label = QLabel('Password:')
        self.password_input = QLineEdit()
        self.password_input.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.password_label)
        layout.addWidget(self.password_input)

        self.login_button = QPushButton('Login')
        self.login_button.clicked.connect(self.handle_login)
        layout.addWidget(self.login_button)

        self.setLayout(layout)

    def handle_login(self):
        username = self.username_input.text()
        password = self.password_input.text()
        
        try:
            token = base64.b64encode(f"{username}:{password}".encode('utf-8')).decode('utf-8')
            response = requests.post('http://localhost:8000/api/login/', headers={'Authorization': f'Basic {token}'})

            if response.status_code == 200:
                self.dashboard_window = DashboardWindow(token)
                self.dashboard_window.show()
                self.close()
            else:
                QMessageBox.warning(self, 'Error', 'Invalid credentials')
        except requests.exceptions.ConnectionError:
            QMessageBox.critical(self, 'Error', 'Could not connect to the server.')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    login_window = LoginWindow()
    login_window.show()
    sys.exit(app.exec_())
