import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing icons for the hamburger and close buttons
import { useAuth } from '../hooks/auth';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage the menu toggle
    const { userLogined, LogoutSession } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [location])

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <section className='w-100 bg-orange-50 flex justify-center'>
            <div className="flex justify-between items-center container py-3" data-aos="fade-down">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold transition-colors text-orange-600 hover:text-orange-700">
                        <Link to="/" onClick={closeMenu}>
                            VenueServ
                        </Link>
                    </h1>
                </div>
                <div className="hidden md:flex items-center font-semibold">
                    <Link to="/" className="text-gray-800 transition-colors hover:text-orange-900 mr-4">Home</Link>
                    {/* <Link to="/about" className="text-gray-800 transition-colors hover:text-orange-900 mr-4">About</Link> */}
                    <Link to="/explore" className="text-gray-800 transition-colors hover:text-orange-900 mr-4">Explore</Link>
                    {
                        userLogined ? <Link to="/bookings" className="text-gray-800 transition-colors hover:text-orange-900 mr-4" onClick={closeMenu}>Bookings</Link> : ""
                    }
                    <Link to="/contact" className="text-gray-800 transition-colors hover:text-orange-900 mr-4">Contact</Link>


                    <button className={`bg-orange-600 transition-colors hover:bg-orange-700 text-orange-50 font-bold py-2 px-4 rounded`} onClick={userLogined ? LogoutSession : (() => navigate('/login'))}>
                        {
                            userLogined ? 'Log out' : 'Login'
                        }
                    </button>
                </div>
                <div className="md:hidden flex items-center gap-3">
                    <button className={`bg-orange-600 transition-colors hover:bg-orange-700 text-orange-50 font-bold py-2 px-4 rounded`} onClick={userLogined ? LogoutSession : (() => navigate('/login'))}>
                        {
                            userLogined ? 'Log out' : 'Login'
                        }
                    </button>
                    <button onClick={toggleMenu}>
                        <FaBars className="text-orange-600 text-2xl" />
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            <div
                className={`md:hidden fixed top-0 right-0 h-full w-full bg-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}
            >
                <div className="flex justify-end p-4" data-aos="fade-down">

                    <button onClick={closeMenu}>
                        <FaTimes className="text-orange-600 text-2xl" />
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center h-full" data-aos="fade-down">
                    <Link to="/" className="text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl" onClick={closeMenu}>Home</Link>
                    {/* <Link to="/about" className="text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl" onClick={closeMenu}>About</Link> */}
                    <Link to="/explore" className="text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl" onClick={closeMenu}>Explore</Link>
                    {
                        userLogined ? <Link to="/bookings" className="text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl" onClick={closeMenu}>Bookings</Link> : ""
                    }
                    <Link to="/contact" className="text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl" onClick={closeMenu}>Contact</Link>


                </div>
            </div>
        </section>
    );
};

export default Navbar;
