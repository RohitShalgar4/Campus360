import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  role: null, // 'admin' or 'student'

  login: (userData, token, role) => set({
    user: userData,
    isAuthenticated: true,
    token,
    role
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    token: null,
    role: null
  })
}));