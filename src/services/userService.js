import api from './api';

/**
 * Service for managing users.
 * Calls identity-nginx on port 8082 (baseURL: http://localhost:8082/api)
 * Full URL: http://localhost:8082/api/v1/users
 */
export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/v1/users', { params });
    return response.data; // UserResource collection returns { data: [...] }
  },

  getUser: async (id) => {
    const response = await api.get(`/v1/users/${id}`);
    return response.data.data;
  },

  createUser: async (userData) => {
    const config = userData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
      
    const response = await api.post('/v1/users', userData, config);
    return response.data.data;
  },

  updateUser: async (id, userData) => {
    const config = userData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
      
    if (userData instanceof FormData) {
      userData.append('_method', 'PUT');
      const response = await api.post(`/v1/users/${id}`, userData, config);
      return response.data.data;
    }

    const response = await api.put(`/v1/users/${id}`, userData);
    return response.data.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/v1/users/${id}`);
    return response.data;
  }
};
