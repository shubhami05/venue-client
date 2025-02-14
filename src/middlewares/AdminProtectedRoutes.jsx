import React from 'react'
import { useAuth } from '../hooks/auth'
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';

const AdminProtectedRoutes = () => {
    const { userRole, userLogined, loading } = useAuth();
    if (loading) return <Loader />

    if (!userLogined) return <Navigate to={"/login"} replace/>

    if (userRole == "admin") {
        return <Outlet />
    }
    else {
        if (userRole == "owner") return <Navigate to={"/owner"} replace/>
        else return <Navigate to={"/"} replace/>
    }

}

export default AdminProtectedRoutes
