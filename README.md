# Chemical Equipment Parameter Visualizer

This project is a hybrid web and desktop application for visualizing chemical equipment parameters from CSV files. It features a Django backend, a React web frontend, and a PyQt5 desktop frontend.

## Architecture

The application is built with a 3-layer architecture:

- **Backend:** Django + Django REST Framework
- **Web Frontend:** React + Chart.js + TailwindCSS
- **Desktop Frontend:** PyQt5 + Matplotlib

Both frontends communicate with the backend via a REST API.

## Tech Stack

- **Backend:** Python, Django, Django REST Framework, Pandas, ReportLab
- **Web Frontend:** JavaScript, React, Vite, Axios, Chart.js, TailwindCSS, Material UI
- **Desktop Frontend:** Python, PyQt5, Matplotlib, Requests

## Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd chemical-equipment-visualizer/backend
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run database migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

4.  **Create a superuser:**
    ```bash
    python manage.py createsuperuser
    ```

5.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```

The backend will be available at `http://localhost:8000`.

## React Web-Frontend Setup

1.  **Navigate to the web-frontend directory:**
    ```bash
    cd chemical-equipment-visualizer/web-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

The web frontend will be available at `http://localhost:5173`.

## PyQt5 Desktop-Frontend Setup

1.  **Navigate to the desktop-frontend directory:**
    ```bash
    cd chemical-equipment-visualizer/desktop-frontend
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the application:**
    ```bash
    python main.py
    ```

## API Documentation

| Route                  | Method | Description                               |
| ---------------------- | ------ | ----------------------------------------- |
| `/api/login/`          | POST   | BasicAuth validation                      |
| `/api/upload-csv/`     | POST   | Upload CSV → parse with pandas            |
| `/api/summary/`        | GET    | Return summary of latest dataset          |
| `/api/history/`        | GET    | Get last 5 datasets                       |
| `/api/dataset/<id>/`   | GET    | Retrieve full dataset                     |
| `/api/generate-pdf/<id>/`| GET    | Download PDF                              |

## Screenshots

*(Screenshots would be added here after running the application)*

## Demo Video

*(A link to a demo video would be added here)*
