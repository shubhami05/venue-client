import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

import Loginpage from './pages/Login'
import Signuppage from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'

import axios from 'axios'
import UserLayout from './layout/User.layout'
import { useEffect, useLayoutEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import LogoutProtectedRoutes from './middlewares/LogoutProtectedRoutes'
import AdminLayout from './layout/Admin.layout'
import AdminProtectedRoutes from './middlewares/AdminProtectedRoutes'
import UserProtectedRoutes from './middlewares/UserProtectedRoutes'
import OwnerProtectedRoutes from './middlewares/OwnerProtectedRoutes'
import OwnerLayout from './layout/Owner.layout'
import { useAuth } from './hooks/auth'

function AppContent() {

  const pathname = useLocation();
  const { userRole, FetchSession } = useAuth()
  useEffect(() => {
    FetchSession();
  }, [])
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  axios.defaults.withCredentials = true;
  return (
    <div>
      <Routes>

        <Route element={<AdminProtectedRoutes />}>
          <Route path='/admin/*' element={<AdminLayout />} />
        </Route>
        <Route element={<OwnerProtectedRoutes />}>
          <Route path="/owner/*" element={<OwnerLayout />} />
        </Route>
        <Route element={<LogoutProtectedRoutes />}>
          <Route path='/login' element={<Loginpage />} />
          <Route path='/signup' element={<Signuppage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>

        <Route element={<UserProtectedRoutes />}>
          <Route path="/*" element={<UserLayout />} />
        </Route>
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