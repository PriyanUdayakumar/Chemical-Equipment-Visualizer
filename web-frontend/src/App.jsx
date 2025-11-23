import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import TableView from './pages/TableView';
import History from './pages/History';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

export const ThemeContext = createContext(null);
export const DataContext = createContext(null);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [dataUpdated, setDataUpdated] = useState(false);
  const isLoggedIn = localStorage.getItem('accessToken'); // Check authentication status

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <DataContext.Provider value={{ dataUpdated, setDataUpdated }}>
        <div className={theme}>
          <Toaster />
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Redirect authenticated users from /login to /dashboard */}
              {isLoggedIn && <Route path="/login" element={<Navigate to="/dashboard" replace />} />}

              {/* Login route for unauthenticated users */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  {/* Default dashboard route when authenticated */}
                  <Route index element={<Navigate to="/dashboard" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="upload" element={<Upload />} />
                  <Route path="table-view" element={<TableView />} />
                  <Route path="table-view/:id" element={<TableView />} />
                  <Route path="history" element={<History />} />
                </Route>
              </Route>

              {/* Catch-all for unauthenticated users trying to access unknown or protected routes */}
              {!isLoggedIn && <Route path="*" element={<Navigate to="/login" replace />} />}
            </Routes>
          </Router>
        </div>
      </DataContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
