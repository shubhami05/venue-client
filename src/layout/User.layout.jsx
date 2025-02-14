// UserLayout.js
import React from 'react';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
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

const UserLayout = () => {

    return (
        <div className='content-wrapper'>

            <Navbar />
            <main>
                <Routes>
                    <Route path='/' element={<Homepage />} />
                    <Route path='/explore' element={<Explorepage />} />
                    <Route path='/explore/venue/:id' element={<VenueDetails />} />
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
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default UserLayout;