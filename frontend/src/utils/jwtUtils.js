// JWT Token Management Utility
export const jwtUtils = {
  // Get JWT token from localStorage
  getToken: () => {
    try {
      return localStorage.getItem('jwtToken');
    } catch (err) {
      console.error('Failed to retrieve JWT token:', err);
      return null;
    }
  },

  // Store JWT token in localStorage
  setToken: (token) => {
    try {
      localStorage.setItem('jwtToken', token);
    } catch (err) {
      console.error('Failed to store JWT token:', err);
    }
  },

  // Remove JWT token from localStorage
  removeToken: () => {
    try {
      localStorage.removeItem('jwtToken');
    } catch (err) {
      console.error('Failed to remove JWT token:', err);
    }
  },

  // Check if token exists
  hasToken: () => {
    return !!jwtUtils.getToken();
  },

  // Get authorization header
  getAuthHeader: () => {
    const token = jwtUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Make API call with JWT token
  fetchWithJWT: async (url, options = {}) => {
    const token = jwtUtils.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    };

    return fetch(url, {
      ...options,
      headers
    });
  },

  // Logout (clear token and user data)
  logout: () => {
    jwtUtils.removeToken();
    try {
      localStorage.removeItem('student');
    } catch (err) {
      console.error('Failed to remove student data:', err);
    }
  }
};
