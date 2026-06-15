import axios from 'axios';
import storage from '../utils/storage';

const API_URL = process.env.REACT_APP_API_URL || '';

const getBaseURL = () => {
  if (!API_URL) return '/api';
  return API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = storage.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
