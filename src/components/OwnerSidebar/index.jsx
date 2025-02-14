import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { MdDashboardCustomize, MdHome, MdNoteAdd, MdNotificationAdd, MdOutlineMessage, MdOutlineRateReview, MdPerson2, MdQuestionAnswer } from "react-icons/md";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const { userRole } = useAuth();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
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

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`fixed left-0 top-0 pt-6 z-40 flex h-screen w-64 flex-col overflow-y-auto bg-zinc-800 text-orange-50 duration-300 ease-linear dark:bg-boxdark ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link to={"/"} className="flex w-full justify-center items-center space-x-3 rtl:space-x-reverse">
          <div className="flex flex-col gap-0 items-end ">
            <span className="self-center text-orange-500  text-2xl  font-bold orange-50 space-nowrap dark:text-orange-50">VenueServ</span>
          </div>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="z-40 block  shadow-sm w-7 h-7 lg:hidden"
        >
          <div className="flex flex-col gap-1 rounded-md items-center">
            <span className={`block h-0.5 w-6 rounded-sm bg-orange-600  hover:bg-orange-700 transition-all duration-200 ease-in-out transform rotate-45 translate-y-1.5`}></span>
            <span className={`block h-0.5 w-6 rounded-sm bg-orange-600  hover:bg-orange-700 transition-all duration-200 ease-in-out opacity-0`}></span>
            <span className={`block h-0.5 w-6 rounded-sm bg-orange-600  hover:bg-orange-700 transition-all duration-200 ease-in-out transform -rotate-45 -translate-y-1.5`}></span>
          </div>
        </button>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className=" py-4 ">
          <hr />
          <div >
            <p className="my-3 text-sm font-medium uppercase px-4 text-orange-500">
              OwnerPanel
            </p>

            <ul className="mb-6 flex flex-col gap-1.5">

              <li>
                <NavLink
                  to="/owner"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600  dark:hover:bg-meta-4 ${pathname.endsWith('/owner') &&
                    'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdDashboardCustomize />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/owner/venues"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${pathname.includes('/venues') &&
                    'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdHome />
                  My Venues
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/owner/bookings"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${pathname.includes('/bookings') && 'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdNoteAdd />
                  Bookings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/owner/inquiries"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${pathname.includes('inquiries') && 'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdQuestionAnswer />
                  Inquiries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/owner/reviews"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${pathname.includes('reviews') && 'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdOutlineRateReview />
                  Reviews
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <hr />
            <p className="my-3 text-sm font-medium uppercase px-4 text-orange-500">
              Other
            </p>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/owner/profile"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${pathname.includes('profile') &&
                    'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdPerson2 />
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/owner/gethelp"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${pathname.includes('help') &&
                    'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdOutlineMessage />
                  Get Help
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/owner/notifications"
                  className={`group lg:px-10 relative flex items-center gap-2.5 rounded-sm py-2 px-8 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-orange-600 dark:hover:bg-meta-4 ${pathname.includes('notifications') &&
                    'bg-orange-600 dark:bg-meta-4'
                    }`}
                >
                  <MdNotificationAdd/>
                  Notifications
                </NavLink>
              </li> */}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;