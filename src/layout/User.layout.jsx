// UserLayout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import UserFooter from '../components/UserFooter';
import { Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Home';
import Explorepage from '../pages/Explore';
import Contactpage from '../pages/Contact';
import VenueDetails from '../pages/VenueDetails';
import Aboutpage from '../pages/About';
import Bookingspage from '../pages/Bookings';
import ListYourVenue from '../pages/OwnerRegisterPage';
import NotFoundPage from '../pages/404';
import LoginProtectedRoutes from '../middlewares/LoginProtectedRoutes';
import { useAuth } from '../hooks/auth';
import toast from 'react-hot-toast';

const UserLayout = () => {
    const { userRole, userLogined } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect admin and owner users to their respective dashboards
        if (userLogined) {
            if (userRole === 'admin') {
                // toast.error('Admin users should use the admin panel');
                navigate('/admin');
            } else if (userRole === 'owner') {
                // toast.error('Venue owners should use the owner panel');
                navigate('/owner');
            }
        }
    }, [userRole, userLogined, navigate]);

    return (
        <div className='content-wrapper bg-gray-900'>
            <Navbar />
            <main>
                <Routes>
                    <Route path='/' element={<Homepage />} />
                    <Route path='/explore' element={<Explorepage />} />
                    <Route path='/explore/venue/:venueId' element={<VenueDetails />} />
                    <Route path='/contact' element={<Contactpage />} />
                    <Route path='/about' element={<Aboutpage />} />

                    {/* Login required pages*/}
                    <Route element={<LoginProtectedRoutes />}>
                        <Route path='/bookings' element={<Bookingspage />} />
                        <Route path='/list-your-venue' element={<ListYourVenue />} />
                    </Route>
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </main>
            <UserFooter />
            <ScrollToTop />
        </div>
    );
};

export default UserLayout;