import api from './apiClient';
import logger from '../utils/logger';

/**
 * Authentication Service
 * 
 * ✅ SECURITY: Now uses HttpOnly cookies for token storage
 * - Tokens are sent/received automatically via cookies (withCredentials: true)
 * - No localStorage usage for tokens (prevents XSS token theft)
 * - Automatic token refresh handled by apiClient interceptor
 */

export const authService = {
  async refreshAccessToken() {
    try {
      // Server will read refreshToken from cookie and set new token cookie
      const response = await api.post('/auth/refresh', {});
      logger.debug('Token refresh successful');
      return response.data;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  },

  async signup(name, email, password, program, yearLevel) {
    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        program,
        yearLevel: parseInt(yearLevel)
      });
      
      logger.debug('Signup successful');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      logger.error('Signup error:', message);
      throw new Error(message);
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      logger.debug('Login successful');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      logger.error('Login error:', message);
      throw new Error(message);
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
      logger.debug('Logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
      // Even if server logout fails, we should clear client state
    }
  }
};
