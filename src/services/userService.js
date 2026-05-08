import api from './api';

const mapUserFromApi = (user) => ({
  ...user,
  dateCreation: user.date_creation,
  dateNaissance: user.date_naissance,
});

const mapUserToApi = (userData) => {
  if (userData instanceof FormData) {
    if (userData.has('dateNaissance')) {
      userData.append('date_naissance', userData.get('dateNaissance'));
      userData.delete('dateNaissance');
    }
    return userData;
  }
  
  return {
    ...userData,
    date_naissance: userData.dateNaissance,
  };
};

/**
 * Service for managing users.
 * Calls identity-nginx on port 8082 (baseURL: http://localhost:8082/api)
 * Full URL: http://localhost:8082/api/v1/users
 */
export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('v1/users', { params });
    // UserResource collection returns { data: [...] }
    return {
      data: response.data.data.map(mapUserFromApi),
      total: response.data.meta?.total || response.data.data.length
    };
  },

  getUser: async (id) => {
    const response = await api.get(`v1/users/${id}`);
    return mapUserFromApi(response.data.data);
  },

  createUser: async (userData) => {
    const mappedData = mapUserToApi(userData);
    const config = mappedData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
      
    const response = await api.post('v1/users', mappedData, config);
    return mapUserFromApi(response.data.data);
  },

  updateUser: async (id, userData) => {
    const mappedData = mapUserToApi(userData);
    const config = mappedData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
      
    if (mappedData instanceof FormData) {
      mappedData.append('_method', 'PUT');
      const response = await api.post(`v1/users/${id}`, mappedData, config);
      return mapUserFromApi(response.data.data);
    }

    const response = await api.put(`v1/users/${id}`, mappedData);
    return mapUserFromApi(response.data.data);
  },

  deleteUser: async (id) => {
    const response = await api.delete(`v1/users/${id}`);
    return response.data;
  }
};
