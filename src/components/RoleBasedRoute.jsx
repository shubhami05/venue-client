import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { hasRole, getRedirectPath } from '../utils/roleUtils';
import Loader from './Loader';
import toast from 'react-hot-toast';

/**
 * A reusable component for role-based route protection
 * 
 * @param {Object} props - Component props
 * @param {string|string[]} props.requiredRole - Role(s) required to access the route
 * @param {boolean} props.requireAuth - Whether authentication is required
 * @param {string} props.redirectPath - Path to redirect to if access is denied
 * @param {string} props.deniedMessage - Message to show when access is denied
 * @returns {JSX.Element} - The rendered component
 */
const RoleBasedRoute = ({ 
  requiredRole, 
  requireAuth = true,
  redirectPath,
  deniedMessage = "Access denied. You don't have permission to view this page."
}) => {
  const { userLogined, userRole, loading } = useAuth();
  const navigate = useNavigate();
  
  // Show loader while checking authentication
  if (loading) return <Loader />;
  
  // Check if authentication is required
  if (requireAuth && !userLogined) {
    // toast.error("Please login to access this page");
    return <Navigate to="/login" replace />;
  }
  
  // Special case for login page - if already logged in, redirect to appropriate dashboard
  if (!requireAuth && userLogined && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
    const redirectTo = getRedirectPath(userRole);
    return <Navigate to={redirectTo} replace />;
  }
  
  // If no role is required or user has the required role, allow access
  if (!requiredRole || hasRole(userRole, requiredRole)) {
    return <Outlet />;
  }
  
  // If access is denied, show message and redirect
  toast.error(deniedMessage);
  
  // Use provided redirect path or get default based on user role
  const redirectTo = redirectPath || getRedirectPath(userRole);
  return <Navigate to={redirectTo} replace />;
};

export default RoleBasedRoute; 