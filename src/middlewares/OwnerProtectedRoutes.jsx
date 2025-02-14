import React from 'react'
import { useAuth } from '../hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';

const OwnerProtectedRoutes = () => {
    const { userLogined, userRole, loading } = useAuth();
    if (loading) return <Loader />

    if (!userLogined) return <Navigate to={"/login"} replace/>
    if (userRole == "admin") return <Navigate to={"/admin"} replace />
    if (userRole == "owner") return <Outlet />

    return <Navigate to={'/'} replace/>

}

export default OwnerProtectedRoutes
