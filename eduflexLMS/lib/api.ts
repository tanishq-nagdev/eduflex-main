// eduflexlms/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend's base URL!
});

// This "interceptor" runs before every API request
api.interceptors.request.use(config => {
  try {
    console.log("🔹 Interceptor running, localStorage:", localStorage.getItem('userInfo'));
    // Get user info from local storage
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        // Add the token to the request headers
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error parsing user info from local storage", error);
  }
  
  return config;
});

export default api;