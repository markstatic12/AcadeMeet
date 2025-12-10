import { API_BASE_URL } from './apiHelper';

export const authService = {
  async refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }
      
      // Update access token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data.token;
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  },

  async signup(name, email, password, program, yearLevel) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, program, yearLevel: parseInt(yearLevel) }),
      });

      // Check if response has content before parsing JSON
      const text = await response.text();
      if (!text) {
        throw new Error(`Signup failed: Empty response (Status: ${response.status})`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Signup failed: Invalid JSON response (Status: ${response.status})`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response has content before parsing JSON
      const text = await response.text();
      if (!text) {
        throw new Error(`Login failed: Empty response (Status: ${response.status})`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Login failed: Invalid JSON response (Status: ${response.status})`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};
