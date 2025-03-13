import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { getRedirectPath } from '../utils/roleUtils';

/**
 * A component to display when access is denied
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Custom message to display
 * @param {string} props.redirectPath - Custom redirect path
 * @returns {JSX.Element} - The rendered component
 */
const AccessDenied = ({ 
  message = "Access denied. You don't have permission to view this page.",
  redirectPath
}) => {
  const { userRole } = useAuth();
  
  // Get redirect path based on user role if not provided
  const path = redirectPath || getRedirectPath(userRole);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md">
        <svg 
          className="w-16 h-16 text-red-500 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
        
        <p className="text-gray-700 mb-6">{message}</p>
        
        <Link 
          to={path} 
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied; 