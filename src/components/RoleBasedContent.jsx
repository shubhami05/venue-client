import React from 'react';
import { useAuth } from '../hooks/auth';
import { hasRole } from '../utils/roleUtils.jsx';

/**
 * A component that conditionally renders content based on user role
 * 
 * @param {Object} props - Component props
 * @param {string|string[]} props.requiredRole - Role(s) required to view the content
 * @param {boolean} props.requireAuth - Whether authentication is required
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} props.fallback - Content to render if not authorized
 * @returns {JSX.Element|null} - The rendered component
 */
const RoleBasedContent = ({ 
  requiredRole, 
  requireAuth = true,
  children,
  fallback = null
}) => {
  const { userLogined, userRole } = useAuth();
  
  // Check if authentication is required
  if (requireAuth && !userLogined) {
    return fallback;
  }
  
  // If no role is required or user has the required role, show content
  if (!requiredRole || hasRole(userRole, requiredRole)) {
    return children;
  }
  
  // Otherwise, show fallback content
  return fallback;
};

export default RoleBasedContent; 