import sys
from PyQt5.QtWidgets import QApplication
from login import LoginWindow

if __name__ == '__main__':
    app = QApplication(sys.argv)

    # Load and apply the stylesheet
    with open('styles.qss', 'r') as f:
        style = f.read()
        app.setStyleSheet(style)

    login_window = LoginWindow()
    login_window.show()
    sys.exit(app.exec_())
