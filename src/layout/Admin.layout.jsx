// AdminLayout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import toast from 'react-hot-toast';

import NotFoundPage from '../pages/404';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminVenues from '../pages/admin/AdminVenues';
import AdminOwners from '../pages/admin/AdminOwners';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminSettings from '../pages/admin/AdminSettings';
import PendingVenues from '../pages/admin/PendingVenues';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AdminFooter from '../components/AdminFooter';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { userRole, userLogined } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only allow admin users to access the admin panel
        if (!userLogined) {
            toast.error('Please login to access the admin panel');
            navigate('/login');
        } else if (userRole !== 'admin') {
            toast.error('You do not have permission to access the admin panel');
            if (userRole === 'owner') {
                navigate('/owner');
            } else {
                navigate('/');
            }
        }
    }, [userRole, userLogined, navigate]);

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    role="admin"
                />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex min-h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden lg:ml-64">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setSearchTerm={setSearchTerm} />
                    <main className='bg-orange-100 text-gray-900 min-h-screen'>
                        <Routes>
                            <Route index element={<AdminAnalytics />} />
                            <Route path="venues" element={<AdminVenues />} />
                            <Route path="venues/pending" element={<PendingVenues />} />
                            {/* <Route path='/' element={<AdminDashboard />} /> */}
                            <Route path='/users' element={<AdminUsers searchTerm={searchTerm} />} />
                            <Route path='/venues' element={<AdminVenues searchTerm={searchTerm} />} />
                            <Route path='/owners' element={<AdminOwners searchTerm={searchTerm} />} />
                            <Route path='/analytics' element={<AdminAnalytics />} />
                            <Route path='/profile' element={<AdminProfile />} />
                            <Route path='/settings' element={<AdminSettings />} />
                            <Route path='/pending-venues' element={<PendingVenues />} />

                            <Route path='/*' element={<NotFoundPage />} />
                        </Routes>
                    </main>
                    <AdminFooter />
                    <ScrollToTop />
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </div>
    );
};

export default AdminLayout;