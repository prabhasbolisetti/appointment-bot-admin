import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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

export const clinicAPI = {
  getClinic: (clinicId) =>
    api.get(`/admin/clinic/${clinicId}`),

  updateClinic: (clinicId, data) =>
    api.put(`/admin/clinic/${clinicId}`, data),
};

export const appointmentAPI = {
  list: (status = null) => {
    let url = '/admin/appointments/';
    if (status) url += `?status=${status}`;
    return api.get(url);
  },

  get: (appointmentId) =>
    api.get(`/admin/appointments/${appointmentId}`),

  cancel: (appointmentId) =>
    api.put(`/admin/appointments/${appointmentId}/cancel`),

  complete: (appointmentId) =>
    api.put(`/admin/appointments/${appointmentId}/complete`),
};

export const patientAPI = {
  list: (clinicId) =>
    api.get(`/admin/patients/?clinic_id=${clinicId}`),

  get: (patientId) =>
    api.get(`/admin/patients/${patientId}`),
};

export default api;