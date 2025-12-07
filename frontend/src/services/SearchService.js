import { authFetch } from './apiHelper';

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
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      params.append('sortBy', sortBy);

      const response = await authFetch(`/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search');
      }
      return await response.json();
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
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.program && filters.program !== 'All Programs') {
        params.append('program', filters.program);
      }
      if (filters.yearLevel && filters.yearLevel !== 'All Year Levels') {
        params.append('yearLevel', filters.yearLevel);
      }
      params.append('sortBy', filters.sortBy || 'relevance');

      const response = await authFetch(`/search/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      return await response.json();
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
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.date) {
        params.append('date', filters.date);
      }
      if (filters.timeOfDay && filters.timeOfDay !== 'Any Time') {
        params.append('timeOfDay', filters.timeOfDay);
      }
      if (filters.privacy && filters.privacy !== 'All Sessions') {
        params.append('privacy', filters.privacy.toLowerCase());
      }
      params.append('sortBy', filters.sortBy || 'relevance');

      const response = await authFetch(`/search/sessions?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search sessions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching sessions:', error);
      throw error;
    }
  },
};

export default SearchService;
