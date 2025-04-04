import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

import Loginpage from './pages/Login'
import Signuppage from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import EditVenue from './pages/owner/EditVenue'

// Import our centralized axios configuration
import './utils/axiosConfig.jsx';
import { testCors } from './utils/testCors.jsx';

import UserLayout from './layout/User.layout'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import AdminLayout from './layout/Admin.layout'
import OwnerLayout from './layout/Owner.layout'
import { useAuth } from './hooks/auth'

// Import our role-based route component
import RoleBasedRoute from './components/RoleBasedRoute'

function AppContent() {
  const pathname = useLocation();
  const { FetchSession } = useAuth();
  const sessionFetched = useRef(false);
  
  // Test CORS configuration on mount
  useEffect(() => {
    // Test CORS configuration
    testCors()
      .then(() => console.log('CORS configuration is working'))
      .catch(error => console.error('CORS configuration test failed:', error));
  }, []);
  
  // Fetch user session only once on mount
  useEffect(() => {
    if (!sessionFetched.current) {
      FetchSession();
      sessionFetched.current = true;
    }
  }, [FetchSession]);
  
  // Scroll to top when pathname changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Routes>
        {/* Admin Routes - Requires admin role */}
        <Route element={<RoleBasedRoute requiredRole="admin" deniedMessage="Admin access required" />}>
          <Route path='/admin/*' element={<AdminLayout />}/>
        </Route>
        
        {/* Owner Routes - Requires owner role */}
        <Route element={<RoleBasedRoute requiredRole="owner" deniedMessage="Owner access required" />}>
          <Route path="/owner/*" element={<OwnerLayout />} />
        </Route>
        
        {/* Authentication Routes - Only accessible when logged out */}
        <Route element={<RoleBasedRoute requireAuth={false} />}>
          <Route path='/login' element={<Loginpage />} />
          <Route path='/signup' element={<Signuppage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>

        {/* User Routes - No specific role required */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>

      <Toaster
        position='top-center'
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#9B4619',
            color: '#fff',
            fontWeight: "500",
            height: "auto",
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App