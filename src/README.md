# Role-Based Authorization System

This document explains the role-based authorization system implemented in the VenueServ application.

## Components

### 1. RoleBasedRoute

A reusable component for protecting routes based on user roles.

```jsx
<Route element={<RoleBasedRoute requiredRole="admin" deniedMessage="Admin access required" />}>
  <Route path='/admin/*' element={<AdminLayout />} />
</Route>
```

**Props:**
- `requiredRole`: String or array of strings representing the required role(s)
- `requireAuth`: Boolean indicating whether authentication is required (default: true)
- `redirectPath`: Path to redirect to if access is denied (default: based on user role)
- `deniedMessage`: Message to show when access is denied

### 2. RoleBasedContent

A component that conditionally renders content based on user roles.

```jsx
<RoleBasedContent requiredRole="admin" fallback={<AccessDenied />}>
  <AdminDashboard />
</RoleBasedContent>
```

**Props:**
- `requiredRole`: String or array of strings representing the required role(s)
- `requireAuth`: Boolean indicating whether authentication is required (default: true)
- `children`: Content to render if authorized
- `fallback`: Content to render if not authorized (default: null)

### 3. OwnerResourceGuard

A specialized component for owner-specific resource access control.

```jsx
<OwnerResourceGuard 
  resourceType="venue" 
  resourceOwnerId={venue.ownerId}
  fallback={<AccessDenied message="You can only manage your own venues" />}
>
  <VenueManagementPanel venue={venue} />
</OwnerResourceGuard>
```

**Props:**
- `resourceType`: Type of resource ('venue', 'booking', 'review')
- `resourceOwnerId`: ID of the owner of the resource
- `children`: Content to render if authorized
- `fallback`: Content to render if not authorized

### 4. AccessDenied

A component to display when access is denied.

```jsx
<AccessDenied 
  message="You don't have permission to access this venue" 
  redirectPath="/owner/venues"
/>
```

**Props:**
- `message`: Custom message to display
- `redirectPath`: Custom redirect path (default: based on user role)

## Hooks

### useAuthorization

A hook that provides role-based authorization utilities.

```jsx
const { 
  isAdmin, 
  hasFeatureAccess,
  canAccessOwnerVenue 
} = useAuthorization();

// Check if user is admin
if (isAdmin()) {
  // Admin-only code
}

// Check if user can access a feature
if (hasFeatureAccess('manage-users')) {
  // Show user management UI
}

// Check if owner can access a venue
if (canAccessOwnerVenue(venue.ownerId)) {
  // Show venue management UI
}
```

**Methods:**
- `hasRequiredRole(requiredRole)`: Checks if user has required role(s)
- `hasFeatureAccess(feature)`: Checks if user can access a specific feature
- `isAuthenticated()`: Checks if user is authenticated
- `isRole(role)`: Checks if user has a specific role
- `isAdmin()`: Checks if user is an admin
- `isOwner()`: Checks if user is an owner
- `isUser()`: Checks if user is a regular user
- `canAccessOwnerVenue(venueOwnerId)`: Checks if owner can access a specific venue
- `canAccessOwnerBooking(venueOwnerId)`: Checks if owner can access a specific booking
- `canAccessOwnerReview(venueOwnerId)`: Checks if owner can access a specific review
- `userRole`: The user's role
- `userId`: The user's ID

## Utilities

### roleUtils.js

Utility functions for role-based authorization.

```jsx
import { 
  hasRole, 
  getRedirectPath,
  canAccessVenue 
} from '../utils/roleUtils';

// Check if user has required role
const canAccess = hasRole(userRole, 'admin');

// Get redirect path based on user role
const redirectPath = getRedirectPath(userRole);

// Check if owner can access a venue
const hasAccess = canAccessVenue(ownerId, venueOwnerId, userRole);
```

**Functions:**
- `hasRole(userRole, requiredRole)`: Checks if user has required role(s)
- `getRedirectPath(userRole)`: Gets the appropriate redirect path based on user role
- `getRoleDisplayName(role)`: Gets a display name for a role
- `canAccessFeature(userRole, feature)`: Checks if user can access a specific feature
- `canAccessVenue(ownerId, venueOwnerId, userRole)`: Checks if owner can access a specific venue
- `canAccessBooking(ownerId, venueOwnerId, userRole)`: Checks if owner can access a specific booking
- `canAccessReview(ownerId, venueOwnerId, userRole)`: Checks if owner can access a specific review

## Usage Examples

### Protecting Routes

```jsx
// Admin routes
<Route element={<RoleBasedRoute requiredRole="admin" />}>
  <Route path='/admin/*' element={<AdminLayout />} />
</Route>

// Owner routes
<Route element={<RoleBasedRoute requiredRole="owner" />}>
  <Route path="/owner/*" element={<OwnerLayout />} />
</Route>

// Routes that require authentication
<Route element={<RoleBasedRoute requireAuth={true} />}>
  <Route path="/profile" element={<ProfilePage />} />
</Route>

// Public routes
<Route element={<RoleBasedRoute requireAuth={false} />}>
  <Route path="/" element={<HomePage />} />
</Route>
```

### Conditional Rendering

```jsx
// Show content only to admins
<RoleBasedContent requiredRole="admin">
  <AdminControls />
</RoleBasedContent>

// Show different content based on role
<RoleBasedContent 
  requiredRole="admin" 
  fallback={<UserView />}
>
  <AdminView />
</RoleBasedContent>

// Multiple roles
<RoleBasedContent requiredRole={['admin', 'owner']}>
  <ManagementControls />
</RoleBasedContent>
```

### Owner-Specific Resource Access

```jsx
// Venue management
<OwnerResourceGuard 
  resourceType="venue" 
  resourceOwnerId={venue.ownerId}
>
  <VenueEditForm venue={venue} />
</OwnerResourceGuard>

// Booking management
<OwnerResourceGuard 
  resourceType="booking" 
  resourceOwnerId={booking.venue.ownerId}
>
  <BookingDetails booking={booking} />
</OwnerResourceGuard>

// Review management
<OwnerResourceGuard 
  resourceType="review" 
  resourceOwnerId={review.venue.ownerId}
>
  <ReviewResponse review={review} />
</OwnerResourceGuard>
```

### Using the Authorization Hook

```jsx
function VenueManagementPage() {
  const { 
    isAdmin, 
    isOwner, 
    canAccessOwnerVenue,
    userId 
  } = useAuthorization();

  // Fetch venues
  const [venues, setVenues] = useState([]);
  
  useEffect(() => {
    // Fetch venues based on role
    const fetchVenues = async () => {
      let endpoint = '/api/venues';
      
      if (isAdmin()) {
        endpoint = '/api/admin/venues';
      } else if (isOwner()) {
        endpoint = `/api/owner/venues/${userId}`;
      }
      
      const response = await axios.get(endpoint);
      setVenues(response.data.venues);
    };
    
    fetchVenues();
  }, [isAdmin, isOwner, userId]);

  return (
    <div>
      <h1>Venue Management</h1>
      
      <div className="venue-list">
        {venues.map(venue => (
          <div key={venue._id} className="venue-card">
            <h2>{venue.name}</h2>
            
            {/* Only show edit button if user can access this venue */}
            {canAccessOwnerVenue(venue.ownerId) && (
              <button>Edit Venue</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
``` 