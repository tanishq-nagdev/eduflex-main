// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

// Usage example:
// <ProtectedRoute allowedRoles={['professor']}><ProfessorDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading } = useApp();
  const location = useLocation();

  if (loading) {
    // Optionally, replace this div with a spinner component
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Logged in, but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/dashboard" replace />;
    if (user.role === 'professor') return <Navigate to="/professor/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // Allowed, render child route
  return <>{children}</>;
}
