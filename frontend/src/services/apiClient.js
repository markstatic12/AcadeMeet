/**
 * Axios API client configured for cookie-based authentication
 * 
 * Features:
 * - Sends/receives HttpOnly cookies automatically with withCredentials: true
 * - Automatic token refresh on 401 responses
 * - Request/response interceptors for global error handling
 * - baseURL configured from environment variable
 */

import axios from 'axios';
import logger from '../utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // CRITICAL: sends cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,  // 15 second timeout
});

// Track refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  response => response,  // Pass through successful responses
  async error => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another request is already refreshing - queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token via /api/auth/refresh endpoint
        // Server will use refreshToken cookie and set new token cookie
        await api.post('/auth/refresh', {});
        
        isRefreshing = false;
        processQueue(null);
        
        // Retry original request (new token cookie will be sent automatically)
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        
        // Refresh failed - redirect to login
        logger.debug('Token refresh failed, redirecting to login');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject as normal
    return Promise.reject(error);
  }
);

// Request interceptor for logging (optional, useful for debugging)
api.interceptors.request.use(
  config => {
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

export default api;
