import api from './api';

/**
 * Service for activity history (REAL API)
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
    return response.data.data;
  }
};

export default historyService;
