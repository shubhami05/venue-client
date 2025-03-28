import React, { useEffect } from 'react'
import { useAuth } from '../hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';

const Header = ({ sidebarOpen, setSidebarOpen, setSearchTerm, searchTerm }) => {
    const { userLogined, LogoutSession, userRole } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Reset search term when route changes
    useEffect(() => {
        setSearchTerm('');
    }, [location.pathname, setSearchTerm]);

    return (
        <div className='z-50 '>
            <Navbar className='bg-zinc-800 py-4 content-center border-gray-200' fluid >
                <div className='flex gap-2'>
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="z-40 block border border-orange-700 rounded-md border-stroke bg-orange-600 hover:bg-orange-700 p-2 shadow-sm lg:hidden"
                    >
                        <div className="flex flex-col gap-1 rounded-md items-center">
                            <span className={`block h-0.5 w-6 rounded-sm bg-white transition-all duration-200 ease-in-out  ${sidebarOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`block h-0.5 w-6 rounded-sm bg-white transition-all duration-200 ease-in-out  ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-0.5 w-6 rounded-sm bg-white transition-all duration-200 ease-in-out  ${sidebarOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </button>
                    <Link to={"/"} className="flex lg:hidden items-center space-x-3 rtl:space-x-reverse">
                        <div className="flex gap-0 items-end ">
                            <span className="self-center text-orange-500 text-2xl font-bold orange-50 space-nowrap dark:text-orange-50 lg:hidden flex">VS</span>
                            <span className='text-orange-500 text-md text-xl content-baseline capitalize font-semibold'>{userRole}</span>
                        </div>
                    </Link>
                </div>
                <div className="hidden sm:block">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="relative">
                            <button className="absolute left-0 top-1/2 -translate-y-1/2">
                                <FaSearch className='w-6 h-6 text-zinc-300'/>
                            </button>
                            <input
                                key={location.pathname}
                                type="text"
                                value={searchTerm}
                                placeholder="Type to search..."
                                className="w-full bg-transparent pl-9 pr-4 text-gray-200 focus:outline-none dark:text-white xl:w-125"
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </form>
                </div>

                <div className="flex md:order-2">
                    <button className={`bg-orange-600 transition-colors hover:bg-orange-700 text-orange-50 font-bold py-2 px-4 rounded`} onClick={userLogined ? LogoutSession : (() => navigate('/login'))}>
                        {
                            userLogined ? 'Log out' : 'Login'
                        }
                    </button>
                </div>
            </Navbar>
        </div>
    )
}

export default Header
