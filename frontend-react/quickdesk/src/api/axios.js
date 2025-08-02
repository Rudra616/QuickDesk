import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Added /api/ prefix
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,  // Global timeout
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config._retryCount = config._retryCount || 0;  // Initialize retry count
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        originalRequest._retryCount < 1) {
      
      originalRequest._retry = true;
      originalRequest._retryCount++;
      
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) throw new Error('No refresh token');
        
        // Refresh token with timeout
        const source = axios.CancelToken.source();
        const timeout = setTimeout(
          () => source.cancel('Token refresh timed out'), 
          5000
        );

        const response = await axios.post(
          `${originalRequest.baseURL}auth/jwt/refresh/`,
          { refresh: refreshToken },
          { cancelToken: source.token }
        );
        
        clearTimeout(timeout);
        localStorage.setItem('access', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return API(originalRequest);
        
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session_expired=1';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Forbidden access:', error);
          break;
        case 404:
          console.error('Resource not found:', error);
          break;
        case 500:
          console.error('Server error:', error);
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;