import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userLogined, setUserLogined] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [user, setUser] = useState({
        email: "",
        fullname: ""
    });
    const [loading, setLoading] = useState(true);
    const lastFetchTime = useRef(0);
    
    // Configure axios to include credentials in all requests
    axios.defaults.withCredentials = true;
    
    const FetchSession = useCallback(async (force = false) => {
        // Throttle API calls - only fetch once every 5 seconds unless forced
        const now = Date.now();
        if (!force && now - lastFetchTime.current < 5000) {
            return user;
        }
        
        try {
            setLoading(true);
            lastFetchTime.current = now;
            
            const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/auth/fetch-session`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setUserLogined(true);
                setUser(response.data.userdata);
                setUserRole(response.data.userdata.role);
                return response.data.userdata;
            }
            else {
                setUserLogined(false);
                setUser({
                    email: "",
                    fullname: ""
                });
                setUserRole("");
                return null;
            }
        } catch (error) {
            // Error handling is now done in axios interceptor
            setUserLogined(false);
            setUser({
                email: "",
                fullname: ""
            });
            setUserRole("");
            return null;
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    
    const LogoutSession = useCallback(async (e) => {
        if (e) e.preventDefault();
        
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/auth/logout`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setUserLogined(false);
                setUserRole("");
                setUser({
                    email: "",
                    fullname: ""
                });
                toast.success(response.data.message);
                return <Navigate to={"/login"} replace />;
            }
            else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            // Error handling is now done in axios interceptor
            // Only show specific error messages from the server if available
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            }
        }
        finally {
            setLoading(false);
        }
    }, []);
    
    // Fetch session on mount
    // useEffect(() => {
    //     FetchSession();
    // }, [FetchSession]);

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
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}