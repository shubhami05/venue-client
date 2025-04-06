import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa'; // Added FaSignOutAlt for logout icon
import { useAuth } from '../hooks/auth';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage the menu toggle
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for user dropdown
    const { userLogined, LogoutSession, user } = useAuth(); // Get user data from auth context
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
        setDropdownOpen(false); // Close dropdown when menu is closed
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.user-dropdown')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    useEffect(() => {
        setIsOpen(false);
        setDropdownOpen(false); // Close dropdown on location change
    }, [location]);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    // Handle logout with confirmation
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            LogoutSession();
        }
    };

    return (
        <section className='flex justify-center bg-orange-100 '>
            <div className="flex justify-between px-2 items-center w-full container py-3" data-aos="fade-down">
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

                    {userLogined ? (
                        <div className="relative user-dropdown">
                            <button 
                                className="flex items-center text-gray-800 transition-colors hover:text-orange-900 mr-4"
                                onClick={toggleDropdown}
                            >
                                <FaUserCircle className="mr-1 text-xl text-orange-600" />
                                <span className="mr-1">{user?.fullname || 'User'}</span>
                                <FaChevronDown className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div 
                                className={`absolute right-0 mt-2 w-48 bg-white border border-orange-200 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${dropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                            >
                                <div className="py-2">
                                    <div className="px-4 py-2 border-b border-orange-100 bg-orange-50">
                                        <p className="font-semibold text-orange-800">{user?.fullname || 'User'}</p>
                                        <p className="text-sm text-gray-600">{user?.email || ''}</p>
                                    </div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300"
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            className={`bg-orange-600 transition-colors hover:bg-orange-700 text-orange-50 font-bold py-2 px-4 rounded`} 
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    )}
                </div>
                <div className="md:hidden flex items-center gap-3">
                    {userLogined ? (
                        <div className="relative user-dropdown">
                            <button 
                                className="flex items-center text-gray-800 transition-colors hover:text-orange-900 mr-4"
                                onClick={toggleDropdown}
                            >
                                <FaUserCircle className="mr-1 text-xl text-orange-600" />
                                <span className="mr-1">{user?.fullName || 'User'}</span>
                                <FaChevronDown className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div 
                                className={`absolute right-0 mt-2 w-48 bg-white border border-orange-200 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${dropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                            >
                                <div className="py-2">
                                    <div className="px-4 py-2 border-b border-orange-100 bg-orange-50">
                                        <p className="font-semibold text-orange-800">{user?.fullname || 'User'}</p>
                                        <p className="text-sm text-gray-600">{user?.email || ''}</p>
                                    </div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300"
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            className={`bg-orange-600 transition-colors hover:bg-orange-700 text-orange-50 font-bold py-2 px-4 rounded`} 
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    )}
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
                    {userLogined && (
                        <div className="mt-4 text-center">
                            <div className="mb-2">
                                <FaUserCircle className="text-4xl text-orange-600 mx-auto" />
                            </div>
                            <p className="font-semibold text-orange-800">{user?.fullName || 'User'}</p>
                            <p className="text-sm text-gray-600 mb-4">{user?.email || ''}</p>
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center justify-center mx-auto bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700 transition-colors duration-300"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Navbar;
