import { 
  MdDashboardCustomize, 
  MdHome, 
  MdNoteAdd, 
  MdQuestionAnswer, 
  MdOutlineRateReview,
  MdPerson2,
  MdOutlineMessage,
  MdPeople,
  MdSettings,
  MdSupervisorAccount,
  MdAnalytics,
  MdBookOnline
} from "react-icons/md";

export const sidebarConfig = {
  owner: {
    title: 'Owner Panel',
    mainMenu: [
      {
        path: '/owner',
        icon: MdDashboardCustomize,
        label: 'Dashboard'
      },
      {
        path: '/owner/venues',
        icon: MdHome,
        label: 'My Venues'
      },
      {
        path: '/owner/bookings',
        icon: MdNoteAdd,
        label: 'Bookings'
      },
      {
        path: '/owner/inquiries',
        icon: MdQuestionAnswer,
        label: 'Inquiries'
      },
      {
        path: '/owner/reviews',
        icon: MdOutlineRateReview,
        label: 'Reviews'
      }
    ],
    otherMenu: [
      {
        path: '/owner/profile',
        icon: MdPerson2,
        label: 'Profile'
      },
      {
        path: '/owner/gethelp',
        icon: MdOutlineMessage,
        label: 'Get Help'
      }
    ]
  },
  admin: {
    title: 'Admin Panel',
    mainMenu: [
      {
        path: '/admin',
        icon: MdDashboardCustomize,
        label: 'Dashboard'
      },
      {
        path: '/admin/owners',
        icon: MdSupervisorAccount,
        label: 'Owners'
      },
      {
        path: '/admin/venues',
        icon: MdHome,
        label: 'Venues'
      },
      {
        path: '/admin/bookings',
        icon: MdBookOnline,
        label: 'Bookings'
      },
      {
        path: '/admin/users',
        icon: MdPeople,
        label: 'Users'
      },
    
    ],
    otherMenu: [
      {
        path: '/admin/profile',
        icon: MdPerson2,
        label: 'Profile'
      },
      {
        path: '/admin/settings',
        icon: MdSettings,
        label: 'Settings'
      }
    ]
  }
}; 