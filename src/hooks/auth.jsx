import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userLogined, setUserLogined] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [user,setUser] = useState({
        email:"",
        fullname:""
    });
    const [loading, setLoading] = useState(true);
    const FetchSession = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/auth/fetch-session`);
            if (response.data.success) {
                setUserLogined(true);
                setUser(response.data.userdata.session);
                setUserRole(response.data.userdata.session.role);
                return response.data.userdata.session;
            }
            else {
                setUserLogined(false);
                return null;
            }
        } catch (error) {
            console.log("auth js error",error)
            setUserLogined(false);
        }
        finally {
            setLoading(false);
        }
    }
    const LogoutSession = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/auth/logout`);
            if (response.data.success) {
                setUserLogined(false);
                toast.success(response.data.message);
                return <Navigate to={"/login"} />
            }
            else {
                toast.error("Something Went wrong");
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        FetchSession();
        // eslint-disable-next-line
    }, []); // Run once on mount


    return (
        <AuthContext.Provider value={{
            FetchSession,
            userLogined,
            setUserLogined,
            LogoutSession,
            userRole,
            setUserRole,
            loading,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an Authprovider");
    }
    return context;
}