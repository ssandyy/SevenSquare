import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  // Debug logging
  console.log('AdminProtectedRoute Debug:', {
    currentUser,
    userRole: currentUser?.role,
    isAdminResult: isAdmin(),
    loading
  });

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    console.log('Redirecting to login - no current user');
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin()) {
    console.log('Redirecting to home - not admin, role:', currentUser?.role);
    return <Navigate to="/" replace />;
  }

  console.log('Admin access granted');
  return children;
};

export default ProtectedRoute; 