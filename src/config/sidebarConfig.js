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
  MdBookOnline,
  MdReviews,
  MdEmail,
  MdContactSupport,
  MdSupportAgent
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
        path: '/owner/reserve-venue',
        icon: MdBookOnline,
        label: 'Reserve Venue'
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
      },
      {
        path: '/owner/support',
        icon: MdContactSupport,
        label: 'Support'
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
        path: '/admin/reviews',
        icon: MdReviews,
        label: 'Reviews'
      },
      {
        path: '/admin/inquiries',
        icon: MdQuestionAnswer,
        label: 'Inquiries'
      },
      {
        path: '/admin/owners',
        icon: MdSupervisorAccount,
        label: 'Owners'
      },
      {
        path: '/admin/users',
        icon: MdPeople,
        label: 'Users'
      },
      {
        path: '/admin/contact',
        icon: MdEmail,
        label: 'Contact'
      },
      {
        path: '/admin/ownersupport',
        icon: MdSupportAgent,
        label: 'Owner Support'
      }

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