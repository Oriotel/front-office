/**
 * API Client Configuration
 * 
 * Centralized HTTP client with interceptors for auth tokens,
 * error handling, and request/response transformation.
 * 
 * When the backend is ready, update BASE_URL and remove mock logic.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Get stored auth token
 */
const getToken = () => {
  try {
    const persistedState = localStorage.getItem('auth_token');
    return persistedState || null;
  } catch {
    return null;
  }
};

/**
 * Make an HTTP request with auth headers
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
    }
    throw error;
  }
};

/**
 * API client methods
 */
const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, data, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (endpoint, data, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
