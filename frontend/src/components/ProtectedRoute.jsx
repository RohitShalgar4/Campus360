import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function ProtectedRoute({ children, allowedRoles = ['admin', 'student','doctor'] }) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute