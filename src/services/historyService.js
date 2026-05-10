import api from './api';

/**
 * Service for activity history (REAL API)
 */
const historyService = {
  getHistory: async (params = {}) => {
    // api.js interceptor returns response.data
    const response = await api.get('api/v1/history', { params });
    // If response is { data: [...] }, return response.data
    return response.data ?? response;
  },

  getStats: async () => {
    const response = await api.get('api/v1/history/stats');
    return response.data ?? response;
  },

  getFilters: async () => {
    const response = await api.get('api/v1/history/filters');
    return response.data ?? response;
  },

  getDetail: async (id) => {
    const response = await api.get(`api/v1/history/${id}`);
    const data = response.data ?? response;
    return data.data ?? data;
  }
};

export default historyService;
