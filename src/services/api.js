import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, password, fullName, clinicId) =>
    api.post('/admin/auth/register', {
      email,
      password,
      full_name: fullName,
      clinic_id: clinicId,
    }),

  login: (email, password) =>
    api.post('/admin/auth/login', {
      email,
      password,
    }),
};

export default api;