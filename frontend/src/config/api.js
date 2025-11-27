/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Environment-based API configuration
const getApiBaseUrl = () => {
  // Check for environment variable first, fallback to localhost for development
  if (import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Development fallback
  return 'http://localhost:8080/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      SIGNUP: '/auth/signup',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout'
    },
    
    // User endpoints
    USERS: '/users',
    
    // Session endpoints
    SESSIONS: '/sessions',
    
    // Note endpoints
    NOTES: '/notes',
    
    // Reminder endpoints
    REMINDERS: '/reminders',
    
    // Comment endpoints
    COMMENTS: '/comments'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to build headers with optional authentication
export const buildHeaders = (userId = null, additionalHeaders = {}) => {
  const headers = { 
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
  
  if (userId) {
    headers['X-User-Id'] = userId.toString();
  }
  
  return headers;
};

// Helper function to handle API responses consistently
export const handleApiResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || errorMessage);
  }
  return await response.json();
};