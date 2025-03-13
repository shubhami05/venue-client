import { useAuth } from './auth';
import { 
  hasRole, 
  canAccessFeature, 
  canAccessVenue, 
  canAccessBooking, 
  canAccessReview 
} from '../utils/roleUtils';

/**
 * Hook for role-based authorization
 * 
 * @returns {Object} Authorization utilities
 */
const useAuthorization = () => {
  const { userLogined, userRole, user } = useAuth();
  
  /**
   * Check if user has required role
   * @param {string|string[]} requiredRole - Required role(s) for access
   * @returns {boolean} - Whether user has required role
   */
  const hasRequiredRole = (requiredRole) => {
    if (!userLogined) return false;
    return hasRole(userRole, requiredRole);
  };
  
  /**
   * Check if user can access a specific feature
   * @param {string} feature - The feature to check access for
   * @returns {boolean} - Whether user can access the feature
   */
  const hasFeatureAccess = (feature) => {
    if (!userLogined) return false;
    return canAccessFeature(userRole, feature);
  };
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  const isAuthenticated = () => {
    return userLogined;
  };
  
  /**
   * Check if user has a specific role
   * @param {string} role - The role to check
   * @returns {boolean} - Whether user has the role
   */
  const isRole = (role) => {
    if (!userLogined) return false;
    return userRole === role;
  };
  
  /**
   * Check if owner can access a specific venue
   * @param {string} venueOwnerId - The venue owner's ID
   * @returns {boolean} - Whether owner can access the venue
   */
  const canAccessOwnerVenue = (venueOwnerId) => {
    if (!userLogined || !user || !user._id) return false;
    return canAccessVenue(user._id, venueOwnerId, userRole);
  };
  
  /**
   * Check if owner can access a specific booking
   * @param {string} venueOwnerId - The venue owner's ID
   * @returns {boolean} - Whether owner can access the booking
   */
  const canAccessOwnerBooking = (venueOwnerId) => {
    if (!userLogined || !user || !user._id) return false;
    return canAccessBooking(user._id, venueOwnerId, userRole);
  };
  
  /**
   * Check if owner can access a specific review
   * @param {string} venueOwnerId - The venue owner's ID
   * @returns {boolean} - Whether owner can access the review
   */
  const canAccessOwnerReview = (venueOwnerId) => {
    if (!userLogined || !user || !user._id) return false;
    return canAccessReview(user._id, venueOwnerId, userRole);
  };
  
  return {
    hasRequiredRole,
    hasFeatureAccess,
    isAuthenticated,
    isRole,
    isAdmin: () => isRole('admin'),
    isOwner: () => isRole('owner'),
    isUser: () => isRole('user'),
    canAccessOwnerVenue,
    canAccessOwnerBooking,
    canAccessOwnerReview,
    userRole,
    userId: user?._id
  };
};

export default useAuthorization; 