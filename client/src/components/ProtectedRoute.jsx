/**
 * ProtectedRoute Component
 * 
 * This component wraps routes that should only be accessible to authenticated users.
 * If a user is not authenticated, they will be redirected to the login page.
 * A "returnTo" query parameter is added to redirect back after successful login.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while auth status is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Create a returnTo parameter to redirect back after login
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
