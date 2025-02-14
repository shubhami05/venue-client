// AdminLayout.js
import React from 'react';
import ScrollToTop from '../components/ScrollToTop';
import { Route, Routes } from 'react-router-dom';

import NotFoundPage from '../pages/404';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import Header from '../components/Header';

const AdminLayout = () => {

    return (
        <div className='content-wrapper'>

            <Header />
            <main>
                <Routes>
                    <Route path='/' element={<AdminDashboard />} />
                    <Route path='/profile' element={<AdminProfile/>}/>                        

                    <Route path='/*' element={<NotFoundPage />} />
                </Routes>
            </main>
            <ScrollToTop />
        </div>
    );
};

export default AdminLayout;