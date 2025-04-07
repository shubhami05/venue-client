import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { sidebarConfig } from '../config/sidebarConfig';

// SidebarLinkGroup component
const SidebarLinkGroup = ({
  children,
  activeCondition,
}) => {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open)}</li>;
};

// Main Sidebar component
const Sidebar = ({ sidebarOpen, setSidebarOpen, role }) => {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const isSmallDevice = useRef(window.innerWidth < 1024);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // Get menu configuration based on role
  const menuConfig = sidebarConfig[role.toLowerCase()];

  // Close sidebar on route change for mobile devices
  useEffect(() => {
    if (isSmallDevice.current && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      isSmallDevice.current = window.innerWidth < 1024;
      if (!isSmallDevice.current && sidebarOpen) {
        document.body.style.overflow = 'auto';
      } else if (isSmallDevice.current && sidebarOpen) {
        document.body.style.overflow = 'hidden';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Handle scroll locking
  useEffect(() => {
    if (isSmallDevice.current) {
      document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Handle sidebar expanded state
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <>
      {/* Overlay for small devices */}
      {isSmallDevice.current && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 pt-6 z-40 flex h-screen w-64 flex-col overflow-y-auto bg-zinc-800 text-orange-50 duration-300 ease-linear dark:bg-boxdark ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link to="/" className="flex w-full justify-center items-center space-x-3 rtl:space-x-reverse">
            <div className="flex flex-col gap-0 items-end">
              <span className="self-center text-orange-500 text-2xl font-bold orange-50 space-nowrap dark:text-orange-50">
                VenueServ
              </span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="z-40 block shadow-sm w-7 h-7 lg:hidden"
          >
            <div className="flex flex-col gap-1 rounded-md items-center">
              <span className={`block h-0.5 w-6 rounded-sm bg-orange-600 hover:bg-orange-700 transition-all duration-200 ease-in-out transform rotate-45 translate-y-1.5`}></span>
              <span className={`block h-0.5 w-6 rounded-sm bg-orange-600 hover:bg-orange-700 transition-all duration-200 ease-in-out opacity-0`}></span>
              <span className={`block h-0.5 w-6 rounded-sm bg-orange-600 hover:bg-orange-700 transition-all duration-200 ease-in-out transform -rotate-45 -translate-y-1.5`}></span>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="py-4">
            <hr />
            {/* Main Menu */}
            <div>
              <p className="my-3 text-sm font-medium uppercase px-4 text-orange-500">
                {menuConfig.title}
              </p>

              <ul className="mb-6 flex flex-col gap-1.5">
                {menuConfig.mainMenu.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 hover:text-orange-50 dark:hover:bg-meta-4 ${
                        pathname.endsWith(item.path) && 'bg-orange-600 dark:bg-meta-4'
                      }`}
                    >
                      <item.icon />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Menu */}
            <div>
              <hr />
              <p className="my-3 text-sm font-medium uppercase px-4 text-orange-500">
                Other
              </p>

              <ul className="mb-6 flex flex-col gap-1.5">
                {menuConfig.otherMenu.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${
                        pathname.includes(item.path) && 'bg-orange-600 dark:bg-meta-4'
                      }`}
                    >
                      <item.icon />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 