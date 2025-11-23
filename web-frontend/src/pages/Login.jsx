import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 2. Initialize the hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // The README mentions /api/login/ with BasicAuth, but JWT with /api/token/ is more common.
      // Adjust the URL and payload as needed for your backend.
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      if (response.data.access) {
        toast.success('Login successful!');

        // Store the token so the apiClient can use it
        localStorage.setItem('accessToken', response.data.access);

        // 3. Navigate to the dashboard on success
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white rounded-lg shadow-md w-96 dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Login</h2>
        <form onSubmit={handleLogin} className="mt-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
