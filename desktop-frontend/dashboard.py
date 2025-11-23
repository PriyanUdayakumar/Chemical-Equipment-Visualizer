import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QStackedWidget
from table_view import TableView
from chart_view import ChartView
from history_view import HistoryView

class DashboardWindow(QMainWindow):
    def __init__(self, token):
        super().__init__()
        self.token = token
        self.setWindowTitle('Dashboard')
        self.initUI()

    def initUI(self):
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        
        main_layout = QHBoxLayout()

        # Sidebar
        sidebar_layout = QVBoxLayout()
        self.table_button = QPushButton('Table View')
        self.chart_button = QPushButton('Chart View')
        self.history_button = QPushButton('History')
        
        self.table_button.clicked.connect(lambda: self.stacked_widget.setCurrentIndex(0))
        self.chart_button.clicked.connect(lambda: self.stacked_widget.setCurrentIndex(1))
        self.history_button.clicked.connect(lambda: self.stacked_widget.setCurrentIndex(2))

        sidebar_layout.addWidget(self.table_button)
        sidebar_layout.addWidget(self.chart_button)
        sidebar_layout.addWidget(self.history_button)
        sidebar_layout.addStretch()

        # Main content area
        self.stacked_widget = QStackedWidget()
        self.table_view = TableView(self.token)
        self.chart_view = ChartView(self.token)
        self.history_view = HistoryView(self.token)
        
        self.stacked_widget.addWidget(self.table_view)
        self.stacked_widget.addWidget(self.chart_view)
        self.stacked_widget.addWidget(self.history_view)
        
        main_layout.addLayout(sidebar_layout)
        main_layout.addWidget(self.stacked_widget)
        
        self.central_widget.setLayout(main_layout)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    # This is for testing the dashboard directly
    # You would normally run main.py and log in
    dashboard_window = DashboardWindow('some-fake-token')
    dashboard_window.show()
    sys.exit(app.exec_())
