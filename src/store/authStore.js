import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  admin: null,
  token: localStorage.getItem('access_token') || null,
  isLoading: false,
  error: null,

  setAdmin: (admin) => set({ admin }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('access_token');
    set({ admin: null, token: null });
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
}));