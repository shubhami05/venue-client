// OwnerLayout.js
import React, { useEffect, useState } from 'react';
import ScrollToTop from '../components/ScrollToTop';
import { Route, Routes } from 'react-router-dom';

import NotFoundPage from '../pages/404';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import OwnerVenues from '../pages/owner/OwnerVenues';
import OwnerProfile from '../pages/owner/OwnerProfile';
import Header from '../components/Header';
import Sidebar from '../components/OwnerSidebar';
import OwnerFooter from '../components/OwnerFooter';
import OwnerReviews from '../pages/owner/OwnerReviews';
import OwnerInquiries from '../pages/owner/OwnerInquiries';
import OwnerBookings from '../pages/owner/OwnerBookings';
import OwnerGethelp from '../pages/owner/OwnerGethelp';
import VenueForm from '../pages/owner/OwnerVenueForm';

const OwnerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex min-h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden lg:ml-64">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setSearchTerm={setSearchTerm} />
                    <main className='bg-orange-100 text-gray-900 min-h-screen'>
                        <Routes>
                            <Route path='/' element={<OwnerDashboard />} />
                            <Route path='/venues' element={<OwnerVenues searchTerm={searchTerm} />} />
                            <Route path='/venues/new' element={<VenueForm />} />
                            <Route path='/reviews' element={<OwnerReviews />} />
                            <Route path='/inquiries' element={<OwnerInquiries />} />
                            <Route path='/bookings' element={<OwnerBookings />} />
                            <Route path='/gethelp' element={<OwnerGethelp />} />
                            <Route path='/profile' element={<OwnerProfile />} />
                            <Route path='/*' element={<NotFoundPage />} />
                        </Routes>
                    </main>
                    <OwnerFooter />
                    <ScrollToTop />
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </div>
    );
};

export default OwnerLayout;