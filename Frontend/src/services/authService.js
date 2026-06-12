import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Expected { token, user: { id, name, email } }
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data; // Expected { token, user: { id, name, email } }
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data; // Expected { user: { id, name, email } }
  }
};

export default authService;
