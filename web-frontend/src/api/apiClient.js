import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Your backend API base URL
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
