/**
 * Role-based authorization utilities
 */

/**
 * Check if user has required role
 * @param {string} userRole - The user's role
 * @param {string|string[]} requiredRole - Required role(s) for access
 * @returns {boolean} - Whether user has required role
 */
export const hasRole = (userRole, requiredRole) => {
  // If no role is required, allow access
  if (!requiredRole) return true;
  
  // If no user role, deny access
  if (!userRole) return false;
  
  // Normalize roles for comparison (trim and lowercase)
  const normalizedUserRole = userRole.toString().trim().toLowerCase();
  
  // If multiple roles are accepted
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => 
      role.toString().trim().toLowerCase() === normalizedUserRole
    );
  }
  
  // Single role check
  return requiredRole.toString().trim().toLowerCase() === normalizedUserRole;
};

/**
 * Get redirect path based on user role
 * @param {string} userRole - The user's role
 * @returns {string} - The path to redirect to
 */
export const getRedirectPath = (userRole) => {
  switch (userRole) {
    case 'admin':
      return '/admin';
    case 'owner':
      return '/owner';
    default:
      return '/';
  }
};

/**
 * Get role display name
 * @param {string} role - The role
 * @returns {string} - The display name for the role
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'owner':
      return 'Venue Owner';
    case 'user':
      return 'User';
    default:
      return 'Guest';
  }
};

/**
 * Check if user can access a specific feature
 * @param {string} userRole - The user's role
 * @param {string} feature - The feature to check access for
 * @returns {boolean} - Whether user can access the feature
 */
export const canAccessFeature = (userRole, feature) => {
  // Define feature access by role
  const featureAccess = {
    'manage-users': ['admin'],
    'manage-venues': ['admin', 'owner'],
    'manage-bookings': ['admin', 'owner'],
    'view-analytics': ['admin', 'owner'],
    'approve-venues': ['admin'],
    'book-venue': ['user', 'admin']
  };
  
  // Check if feature exists and user role has access
  return featureAccess[feature] && featureAccess[feature].includes(userRole);
};

/**
 * Check if owner can access a specific venue
 * @param {string} ownerId - The owner's ID
 * @param {string} venueOwnerId - The venue owner's ID
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether owner can access the venue
 */
export const canAccessVenue = (ownerId, venueOwnerId, userRole) => {
  // Admins can access all venues
  if (userRole === 'admin') return true;
  
  // Owners can only access their own venues
  if (userRole === 'owner') {
    return ownerId === venueOwnerId;
  }
  
  // Regular users can't access venue management
  return false;
};

/**
 * Check if owner can access a specific booking
 * @param {string} ownerId - The owner's ID
 * @param {string} venueOwnerId - The venue owner's ID
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether owner can access the booking
 */
export const canAccessBooking = (ownerId, venueOwnerId, userRole) => {
  // Admins can access all bookings
  if (userRole === 'admin') return true;
  
  // Owners can only access bookings for their venues
  if (userRole === 'owner') {
    return ownerId === venueOwnerId;
  }
  
  // Regular users can only access their own bookings (handled elsewhere)
  return false;
};

/**
 * Check if owner can access a specific review
 * @param {string} ownerId - The owner's ID
 * @param {string} venueOwnerId - The venue owner's ID
 * @param {string} userRole - The user's role
 * @returns {boolean} - Whether owner can access the review
 */
export const canAccessReview = (ownerId, venueOwnerId, userRole) => {
  // Admins can access all reviews
  if (userRole === 'admin') return true;
  
  // Owners can only access reviews for their venues
  if (userRole === 'owner') {
    return ownerId === venueOwnerId;
  }
  
  // Regular users can access public reviews
  return true;
}; 