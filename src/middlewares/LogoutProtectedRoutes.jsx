import React from 'react'
import { useAuth } from '../hooks/auth'
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';

const LogoutProtectedRoutes = () => {
    const { userLogined, userRole, loading } = useAuth();
    if (loading) return <Loader />;

    if (userLogined) {
        if (userRole == "admin") return <Navigate to={"/admin"} replace/>
        else if (userRole == "owner") return <Navigate to={"/owner"} replace/>
        else return <Navigate to={"/"} replace/>
    }
    else {
        return <Outlet />
    }
}

export default LogoutProtectedRoutes
