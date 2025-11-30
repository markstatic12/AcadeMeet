const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
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
