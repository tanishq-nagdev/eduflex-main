// src/config/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // for cookies if needed
});

// Add token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → logout user
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId'); // if stored
      window.location.href = '/'; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
