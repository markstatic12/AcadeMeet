import api from './apiClient';

const SearchService = {
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
