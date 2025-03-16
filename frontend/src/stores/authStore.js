import { create } from 'zustand';
import axios from 'axios';

const validateToken = async (token) => {
  if (!token) return false;
  try {
    const response = await axios.get('http://localhost:8080/api/v1/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const getStoredAuth = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!user || !token || !role) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return {
        user: null,
        isAuthenticated: false,
        token: null,
        role: null
      };
    }

    return {
      user,
      isAuthenticated: true,
      token,
      role
    };
  } catch (error) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return {
      user: null,
      isAuthenticated: false,
      token: null,
      role: null
    };
  }
};

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),

  login: (userData, token, role) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({
      user: userData,
      isAuthenticated: true,
      token,
      role
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({
      user: null,
      isAuthenticated: false,
      token: null,
      role: null
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const isValid = await validateToken(token);
    
    if (!isValid) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      set({
        user: null,
        isAuthenticated: false,
        token: null,
        role: null
      });
      return false;
    }
    return true;
  }
}));