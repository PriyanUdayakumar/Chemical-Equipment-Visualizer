import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://chemical-equipment-visualizer-b4t5.onrender.com/api',
});

// Use an interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
