import api from './apiClient';

/**
 * Search Service
 * Handles all search-related API calls
 */

const SearchService = {
  /**
   * Search for both users and sessions
   * @param {string} query - Search keyword
   * @param {string} sortBy - Sort order: 'relevance', 'name', 'newest', 'oldest'
   * @returns {Promise<{users: Array, sessions: Array}>}
   */
  searchAll: async (query, sortBy = 'relevance') => {
    try {
      const params = { sortBy };
      if (query) params.q = query;

      const response = await api.get('/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching all:', error);
      throw error;
    }
  },

  /**
   * Search for users only
   * @param {string} query - Search keyword
   * @param {Object} filters - Filter options
   * @param {string} filters.program - Program filter (e.g., 'BSIT', 'BSCS')
   * @param {number} filters.yearLevel - Year level filter (1-4)
   * @param {string} filters.sortBy - Sort order: 'relevance', 'name'
   * @returns {Promise<Array>} Array of user objects
   */
  searchUsers: async (query, filters = {}) => {
    try {
      const params = { sortBy: filters.sortBy || 'relevance' };
      if (query) params.q = query;
      if (filters.program && filters.program !== 'All Programs') {
        params.program = filters.program;
      }
      if (filters.yearLevel && filters.yearLevel !== 'All Year Levels') {
        params.yearLevel = filters.yearLevel;
      }

      const response = await api.get('/search/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  /**
   * Search for sessions only
   * @param {string} query - Search keyword
   * @param {Object} filters - Filter options
   * @param {string} filters.date - Date filter (format: 'yyyy-MM-dd')
   * @param {string} filters.timeOfDay - Time filter: 'morning', 'afternoon', 'evening', 'Any Time'
   * @param {string} filters.privacy - Privacy filter: 'public', 'private', 'All Sessions'
   * @param {string} filters.sortBy - Sort order: 'relevance', 'newest', 'oldest'
   * @returns {Promise<Array>} Array of session objects
   */
  searchSessions: async (query, filters = {}) => {
    try {
      const params = { sortBy: filters.sortBy || 'relevance' };
      if (query) params.q = query;
      if (filters.date) {
        params.date = filters.date;
      }
      if (filters.timeOfDay && filters.timeOfDay !== 'Any Time') {
        params.timeOfDay = filters.timeOfDay;
      }
      if (filters.privacy && filters.privacy !== 'All Sessions') {
        params.privacy = filters.privacy.toLowerCase();
      }

      const response = await api.get('/search/sessions', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching sessions:', error);
      throw error;
    }
  },
};

export default SearchService;
