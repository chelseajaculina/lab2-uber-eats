// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      // Handle token refresh or logout here
    }
    return Promise.reject(error);
  }
);

const apiMethods = {
  // Customer endpoints
  loginCustomer: (data) => api.post('/customers/login/', data),
  registerCustomer: (data) => api.post('/customers/signup/', data),

  // Restaurant endpoints
  loginRestaurant: (data) => api.post('/restaurant/login/', data),
  registerRestaurant: (data) => api.post('/restaurant/signup/', data),

  // Add more API methods as needed
};

export { api, apiMethods };