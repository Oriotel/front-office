import api from './api';

export const userService = {
  getUsers: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return response.data; // UserResource collection returns data in .data
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (userData) => {
    if (userData instanceof FormData) {
      const response = await api.post('/users', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  updateUser: async (id, userData) => {
    // If userData is FormData (has files), Laravel needs POST with _method=PUT
    if (userData instanceof FormData) {
      userData.append('_method', 'PUT');
      const response = await api.post(`/users/${id}`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }

    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
    return true;
  }
};
