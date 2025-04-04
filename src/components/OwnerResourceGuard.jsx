import React from 'react';
import { useAuth } from '../hooks/auth';
import { canAccessVenue, canAccessBooking, canAccessReview } from '../utils/roleUtils.jsx';
import AccessDenied from './AccessDenied';

/**
 * A component that guards access to owner-specific resources
 * 
 * @param {Object} props - Component props
 * @param {string} props.resourceType - Type of resource ('venue', 'booking', 'review')
 * @param {string} props.resourceOwnerId - ID of the owner of the resource
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} props.fallback - Content to render if not authorized
 * @returns {JSX.Element|null} - The rendered component
 */
const OwnerResourceGuard = ({ 
  resourceType,
  resourceOwnerId,
  children,
  fallback = <AccessDenied message="You don't have permission to access this resource" />
}) => {
  const { user, userRole } = useAuth();
  
  // If user is not logged in or no user data is available
  if (!user || !user._id) {
    return fallback;
  }
  
  const ownerId = user._id;
  
  // Check access based on resource type
  let hasAccess = false;
  
  switch (resourceType) {
    case 'venue':
      hasAccess = canAccessVenue(ownerId, resourceOwnerId, userRole);
      break;
    case 'booking':
      hasAccess = canAccessBooking(ownerId, resourceOwnerId, userRole);
      break;
    case 'review':
      hasAccess = canAccessReview(ownerId, resourceOwnerId, userRole);
      break;
    default:
      hasAccess = false;
  }
  
  // Render children if user has access, otherwise render fallback
  return hasAccess ? children : fallback;
};

export default OwnerResourceGuard; 