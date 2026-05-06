import api from './api';

const mapUserFromApi = (user) => ({
  ...user,
  dateCreation: user.date_creation,
  dateNaissance: user.date_naissance,
});

const mapUserToApi = (userData) => {
  if (userData instanceof FormData) {
    // If it's FormData, we need to map the keys manually or handle them in the drawer
    // However, the drawer already uses 'nom', 'prenom', etc.
    // We only need to worry about 'dateNaissance' -> 'date_naissance'
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


export const userService = {
  getUsers: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    // Laravel JsonResource wraps data in a 'data' key
    return {
      data: response.data.data.map(mapUserFromApi),
      total: response.data.meta?.total || response.data.data.length
    };
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return mapUserFromApi(response.data.data);
  },

  createUser: async (userData) => {
    const mappedData = mapUserToApi(userData);
    const response = await api.post('/users', mappedData, {
      headers: userData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return mapUserFromApi(response.data.data);
  },

  updateUser: async (id, userData) => {
    const mappedData = mapUserToApi(userData);
    
    // Laravel doesn't handle multipart/form-data with PUT/PATCH easily
    // We use POST with _method=PUT as a common workaround
    if (userData instanceof FormData) {
      mappedData.append('_method', 'PUT');
      const response = await api.post(`/users/${id}`, mappedData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return mapUserFromApi(response.data.data);
    } else {
      const response = await api.put(`/users/${id}`, mappedData);
      return mapUserFromApi(response.data.data);
    }
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
    return true;
  }
};
