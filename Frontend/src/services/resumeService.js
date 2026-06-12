import api from './api';

const resumeService = {
  create: async (resumeData) => {
    const response = await api.post('/resume/create', resumeData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/resume/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },

  update: async (id, resumeData) => {
    const response = await api.put(`/resume/${id}`, resumeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  }
};

export default resumeService;
