import { buildApiUrl, handleApiResponse, API_CONFIG } from '../config/api';

export const authService = {
  /**
   * Creates a new user account
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} program - User's academic program
   * @param {string|number} yearLevel - User's year level
   * @returns {Promise<object>} User data and authentication token
   */
  async signup(name, email, password, program, yearLevel) {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        program, 
        yearLevel: parseInt(yearLevel) 
      }),
    });

    return await handleApiResponse(response, 'Signup failed');
  },

  /**
   * Authenticates a user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<object>} User data and authentication token
   */
  async login(email, password) {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return await handleApiResponse(response, 'Login failed');
  },
};
