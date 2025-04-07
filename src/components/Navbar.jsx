import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa'; // Added FaSignOutAlt for logout icon
import { useAuth } from '../hooks/auth';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ConfirmationModal from './ConfirmationModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage the menu toggle
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for user dropdown
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { userLogined, LogoutSession, user } = useAuth(); // Get user data from auth context
    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);
    const [underlineStyle, setUnderlineStyle] = useState({});

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

    const handleLogoutClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        LogoutSession();
        setDropdownOpen(false);
        setShowLogoutModal(false);
        navigate('/login');
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    // Update underline position when route changes
    useEffect(() => {
        if (navRef.current) {
            // Check if we're on the register owner page

            // Normal navigation link underline
            const activeLink = navRef.current.querySelector('.nav-link.active');
            if (activeLink) {
                const { offsetLeft, offsetWidth } = activeLink;
                setUnderlineStyle({
                    left: `${offsetLeft}px`,
                    width: `${offsetWidth}px`,
                    transition: 'all 0.3s ease-in-out'
                });

            }
        }
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.user-dropdown') && !event.target.closest('.logout-button')) {
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

    return (
        <section className='flex justify-center bg-orange-100 relative top-0 left-0 right-0 z-[9999]'>
            <div className="flex justify-between px-2 items-center w-full container py-3" data-aos="fade-down">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">
                        <Link to="/" onClick={closeMenu} className='text-orange-600 hover:text-orange-700 transition-colors '>
                            VenueServ
                        </Link>
                    </h1>
                </div>
                <div className="hidden md:flex items-center font-semibold relative" ref={navRef}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `nav-link text-gray-800 transition-colors hover:text-orange-900 mr-4 ${isActive ? 'active' : ''}`
                        }
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/explore"
                        className={({ isActive }) =>
                            `nav-link text-gray-800 transition-colors hover:text-orange-900 mr-4 ${isActive ? 'active' : ''}`
                        }
                        onClick={closeMenu}
                    >
                        Explore
                    </NavLink>
                    {
                        userLogined ?
                            <NavLink
                                to="/bookings"
                                className={({ isActive }) =>
                                    `nav-link text-gray-800 transition-colors hover:text-orange-900 mr-4 ${isActive ? 'active' : ''}`
                                }
                                onClick={closeMenu}
                            >
                                Bookings
                            </NavLink> : ""
                    }
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `nav-link text-gray-800 transition-colors hover:text-orange-900 mr-4 ${isActive ? 'active' : ''}`
                        }
                        onClick={closeMenu}
                    >
                        Contact
                    </NavLink>

                    {/* Single animated underline */}
                    <div
                        className="absolute bottom-0 h-0.5 bg-orange-600"
                        style={underlineStyle}
                    ></div>

                    {userLogined ? (
                        <div className="relative user-dropdown">
                            <button
                                className="user-dropdown-btn flex items-center text-gray-800 transition-colors bg-orange-100 hover:text-orange-900 mr-4"
                                onClick={toggleDropdown}
                            >
                                <FaUserCircle className="mr-1 text-xl text-orange-600" />
                                <span className="mr-1">{user?.fullname || 'User'}</span>
                                <FaChevronDown className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-[9999] overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${dropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                            >
                                <div className="">
                                    <div className="px-4 py-2">
                                        <p className="font-semibold text-orange-800">{user?.fullname || 'User'}</p>
                                        <p className="text-sm text-gray-600">{user?.email || ''}</p>
                                    </div>
                                    <p
                                        href="#"
                                        onClick={handleLogoutClick}
                                        className="logout-button flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300 cursor-pointer"
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Logout
                                    </p>
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
                                className="user-dropdown-btn flex items-center text-gray-800 transition-colors bg-orange-100 hover:text-orange-900 mr-4"
                                onClick={toggleDropdown}
                            >
                                <FaUserCircle className="mr-1  text-xl text-orange-600" />
                                <span className="mr-1 font-semibold">{user?.fullname || 'User'}</span>
                                <FaChevronDown className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                className={`absolute right-0 mt-2 w-48  rounded-lg bg-white shadow-lg z-[9999] overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${dropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                            >
                                <div className="">
                                    <div className="px-4 py-2">
                                        <p className="font-semibold text-orange-800">{user?.fullname || 'User'}</p>
                                        <p className="text-sm text-gray-600">{user?.email || ''}</p>
                                    </div>
                                    <p
                                        href="#"
                                        onClick={handleLogoutClick}
                                        className="logout-button flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300 cursor-pointer"
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Logout
                                    </p>
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
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl ${isActive ? 'text-orange-600 font-bold' : ''}`
                        }
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/explore"
                        className={({ isActive }) =>
                            `text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl ${isActive ? 'text-orange-600 font-bold' : ''}`
                        }
                        onClick={closeMenu}
                    >
                        Explore
                    </NavLink>
                    {
                        userLogined ?
                            <NavLink
                                to="/bookings"
                                className={({ isActive }) =>
                                    `text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl ${isActive ? 'text-orange-600 font-bold' : ''}`
                                }
                                onClick={closeMenu}
                            >
                                Bookings
                            </NavLink> : ""
                    }
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `text-gray-800 transition-colors hover:text-orange-900 py-2 text-xl ${isActive ? 'text-orange-600 font-bold' : ''}`
                        }
                        onClick={closeMenu}
                    >
                        Contact
                    </NavLink>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                type="logout"
            />
        </section>
    );
};

export default Navbar;
