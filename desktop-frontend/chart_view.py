import sys
from PyQt5.QtWidgets import QWidget, QVBoxLayout
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import requests

class ChartView(QWidget):
    def __init__(self, token):
        super().__init__()
        self.token = token
        self.initUI()
        self.load_charts()

    def initUI(self):
        layout = QVBoxLayout()
        self.figure = Figure()
        self.canvas = FigureCanvas(self.figure)
        layout.addWidget(self.canvas)
        self.setLayout(layout)

    def load_charts(self):
        try:
            response = requests.get('http://localhost:8000/api/summary/', headers={'Authorization': f'Basic {self.token}'})
            if response.status_code == 200:
                summary = response.json()['summary']
                
                self.figure.clear()

                # Pie chart
                ax1 = self.figure.add_subplot(121)
                types = summary['type_distribution'].keys()
                counts = summary['type_distribution'].values()
                ax1.pie(counts, labels=types, autopct='%1.1f%%')
                ax1.set_title('Equipment Type Distribution')

                # Bar chart
                ax2 = self.figure.add_subplot(122)
                metrics = ['Avg Flowrate', 'Avg Pressure', 'Avg Temperature']
                values = [summary['avg_flowrate'], summary['avg_pressure'], summary['avg_temperature']]
                ax2.bar(metrics, values)
                ax2.set_title('Average Metrics')

                self.canvas.draw()
        except requests.exceptions.RequestException as e:
            print(f"Could not load charts: {e}")

if __name__ == '__main__':
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    # This is for testing the chart view directly
    chart_view = ChartView('some-fake-token')
    chart_view.show()
    sys.exit(app.exec_())
