// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from '../services/auth';

function ProtectedRoute({ children }) {
  const user = getUserInfo();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
