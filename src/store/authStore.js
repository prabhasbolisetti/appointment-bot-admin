import { create } from 'zustand';

const ADMIN_KEY = 'admin_user';

function loadAdmin() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  admin: loadAdmin(),
  token: localStorage.getItem('access_token') || null,
  isLoading: false,
  error: null,

  setAdmin: (admin) => {
    if (admin) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_KEY);
    }
    set({ admin });
  },
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
    localStorage.removeItem(ADMIN_KEY);
    set({ admin: null, token: null });
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
}));
