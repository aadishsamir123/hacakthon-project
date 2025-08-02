import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * PrivateRoute Component
 * 
 * A route guard that protects authenticated-only pages.
 * Redirects unauthenticated users to the welcome page while
 * allowing authenticated users to access protected content.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected content to render
 * @returns {React.ReactNode} Protected content or redirect
 */
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Redirect to welcome if not authenticated, otherwise render children
  return currentUser ? children : <Navigate to="/welcome" />;
};

export default PrivateRoute;
