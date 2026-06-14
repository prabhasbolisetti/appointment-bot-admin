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

  getStats: () =>
    api.get('/admin/appointments/stats/overview'),

  cancel: (appointmentId) =>
    api.put(`/admin/appointments/${appointmentId}/cancel`),

  complete: (appointmentId) =>
    api.put(`/admin/appointments/${appointmentId}/complete`),

  refund: (appointmentId) =>
    api.post(`/admin/appointments/${appointmentId}/refund`),
};

export const patientAPI = {
  list: (clinicId) =>
    api.get(`/admin/patients/?clinic_id=${clinicId}`),

  get: (patientId) =>
    api.get(`/admin/patients/${patientId}`),
};

export const slotAPI = {
  list: (clinicId, slotDate = null, status = null) => {
    let url = `/admin/slots/?clinic_id=${clinicId}`;
    if (slotDate) url += `&slot_date=${slotDate}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },

  bulkCreate: (clinicId, startDate, endDate, openTime, closeTime, duration) =>
    api.post('/admin/slots/bulk-create', {
      clinic_id: clinicId,
      start_date: startDate,
      end_date: endDate,
      open_time: openTime,
      close_time: closeTime,
      slot_duration_minutes: duration,
    }),

  delete: (slotId) =>
    api.delete(`/admin/slots/${slotId}`),

  release: (slotId) =>
    api.post(`/admin/slots/${slotId}/release`),
};

export function getApiErrorMessage(err, fallback = 'Something went wrong') {
  const status = err?.response?.status;
  if (status === 403) return 'You are not authorized to perform this action.';
  if (status === 404) return 'The requested resource was not found.';
  return err?.response?.data?.detail || fallback;
}

export default api;