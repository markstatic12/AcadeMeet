/**
 * API Helper - Backward compatibility wrapper for axios-based requests
 * 
 * This file provides compatibility shims for legacy code using authFetch/authFetchMultipart.
 * New code should use the api client from apiClient.js directly.
 */

import api from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export { API_BASE_URL };

/**
 * Legacy authFetch wrapper - now uses axios with cookies
 * @deprecated Use api from './apiClient' directly for new code
 */
export const authFetch = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : endpoint;
    const method = options.method || 'GET';
    const config = {
      method,
      url,
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers,
    };
    
    const response = await api(config);
    
    // Return fetch-like response object for backward compatibility
    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
    };
  } catch (error) {
    // Return fetch-like error response
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        statusText: error.response.statusText,
        json: async () => error.response.data,
        text: async () => JSON.stringify(error.response.data),
      };
    }
    throw error;
  }
};

/**
 * Legacy authFetchMultipart wrapper - now uses axios with cookies
 * @deprecated Use api.post() with FormData directly for new code
 */
export const authFetchMultipart = async (endpoint, formData, additionalHeaders = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : endpoint;
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...additionalHeaders,
      },
    });
    
    return {
      ok: true,
      status: response.status,
      json: async () => response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        json: async () => error.response.data,
      };
    }
    throw error;
  }
};

/**
 * @deprecated Not needed with cookie-based auth
 */
export const buildAuthHeaders = (additionalHeaders = {}) => {
  console.warn('buildAuthHeaders is deprecated - tokens are now in HttpOnly cookies');
  return {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
};
