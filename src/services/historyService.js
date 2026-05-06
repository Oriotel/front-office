import api from './api';

/**
 * Service for managing user activity history logs.
 * Calls identity-nginx directly on port 8082 (baseURL: http://localhost:8082/api)
 * Full URL: http://localhost:8082/api/v1/history
 */
const historyService = {
  getHistory: async (params = {}) => {
    const response = await api.get('/v1/history', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/v1/history/stats');
    return response.data;
  },

  getFilters: async () => {
    const response = await api.get('/v1/history/filters');
    return response.data;
  },

  getDetail: async (id) => {
    const response = await api.get(`/v1/history/${id}`);
    return response.data;
  }
};

export default historyService;
