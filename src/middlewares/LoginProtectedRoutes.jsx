import React from 'react'
import { useAuth } from '../hooks/auth'
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';

const LoginProtectedRoutes = () => {
    const { userLogined, loading } = useAuth();
    if (loading) return <Loader />

    if (!userLogined) return <Navigate to={"/login"} replace/>
    else return <Outlet />
}

export default LoginProtectedRoutes