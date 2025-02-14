import React from 'react'
import { useAuth } from '../hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';

const UserProtectedRoutes = () => {
    const { userRole, userLogined, loading } = useAuth();
    if (loading) return <Loader />

    if (userLogined && userRole == "admin") return <Navigate to={"/admin"} replace/>
    if (userLogined && userRole == "owner") return <Navigate to={"/owner"} replace />

    return <Outlet />

}

export default UserProtectedRoutes
