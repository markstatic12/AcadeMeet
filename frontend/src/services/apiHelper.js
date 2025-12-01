// apiHelper.js - centralized API utility to add auth headers

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Build headers with JWT token from localStorage
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object with Authorization if token exists
 */
export const buildAuthHeaders = (additionalHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Fetch wrapper that automatically includes auth headers and handles token refresh
 * @param {string} endpoint - API endpoint (relative to API_BASE_URL)
 * @param {Object} options - fetch options
 * @returns {Promise<Response>} fetch response
 */
export const authFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = buildAuthHeaders(options.headers || {});
  
  let response = await fetch(url, {
    ...options,
    headers,
  });
  
  // If 401 Unauthorized, try to refresh token and retry once
  if (response.status === 401 && !options._isRetry) {
    try {
      // Import authService dynamically to avoid circular dependency
      const { authService } = await import('./AuthService.js');
      await authService.refreshAccessToken();
      
      // Retry request with new token
      const newHeaders = buildAuthHeaders(options.headers || {});
      response = await fetch(url, {
        ...options,
        headers: newHeaders,
        _isRetry: true, // Prevent infinite retry loop
      });
    } catch (error) {
      // Refresh failed, redirect to login
      console.error('Token refresh failed:', error);
      window.location.href = '/login';
    }
  }
  
  return response;
};

/**
 * Fetch wrapper for multipart/form-data (file uploads) with auth
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - form data to send
 * @param {Object} additionalHeaders - Additional headers (do NOT include Content-Type for multipart)
 * @returns {Promise<Response>} fetch response
 */
export const authFetchMultipart = async (endpoint, formData, additionalHeaders = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = { ...additionalHeaders };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Do NOT set Content-Type - browser will set it with boundary
  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
};

export { API_BASE_URL };
