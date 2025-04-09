import React, { useState, useEffect } from 'react';
import { MdPerson, MdLocationOn, MdCalendarToday, MdAccessTime, MdPeopleAlt, MdCheck, MdPayment, MdClose } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminBookings = ({ searchTerm = '' }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    bookedOn: 'all',
    bookingDate: 'all',
    venueName: 'all'
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/bookings/fetch`
      );

      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Failed to fetch bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      (booking.venue?.name || '').toLowerCase().includes(searchTermLower) ||
      (booking.user?.name || '').toLowerCase().includes(searchTermLower) ||
      (booking.user?.email || '').toLowerCase().includes(searchTermLower) ||
      (booking.venue?.city || '').toLowerCase().includes(searchTermLower)
    );

    // Apply booked on filter if selected
    let matchesBookedOn = true;
    if (filterOptions.bookedOn !== 'all') {
      const bookedOnDate = new Date(booking.createdAt);
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      switch (filterOptions.bookedOn) {
        case 'today':
          matchesBookedOn = bookedOnDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesBookedOn = bookedOnDate.toDateString() === yesterday.toDateString();
          break;
        case 'lastWeek':
          matchesBookedOn = bookedOnDate >= lastWeek && bookedOnDate <= today;
          break;
        case 'lastMonth':
          matchesBookedOn = bookedOnDate >= lastMonth && bookedOnDate <= today;
          break;
        default:
          matchesBookedOn = true;
      }
    }

    // Apply booking date filter if selected
    let matchesBookingDate = true;
    if (filterOptions.bookingDate !== 'all') {
      const bookingDate = new Date(booking.date);
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      switch (filterOptions.bookingDate) {
        case 'today':
          matchesBookingDate = bookingDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          matchesBookingDate = bookingDate.toDateString() === tomorrow.toDateString();
          break;
        case 'thisWeek':
          matchesBookingDate = bookingDate >= today && bookingDate < nextWeek;
          break;
        case 'thisMonth':
          matchesBookingDate = bookingDate >= today && bookingDate < nextMonth;
          break;
        default:
          matchesBookingDate = true;
      }
    }

    // Apply venue name filter if selected
    const matchesVenue = filterOptions.venueName === 'all' || 
      booking.venue?.name === filterOptions.venueName;

    return matchesSearchTerm && matchesBookedOn && matchesBookingDate && matchesVenue;
  });

  // Get unique venue names for the filter dropdown
  const venueNames = [...new Set(bookings
    .map(booking => booking.venue?.name)
    .filter(Boolean))];

  const getTimeslotLabel = (timeslot) => {
    switch (timeslot) {
      case 0: return 'Morning';
      case 1: return 'Evening';
      case 2: return 'Full Day';
      default: return 'Unknown';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-600">Paid</span>;
      case 'failed':
        return <span className="text-red-600">Failed</span>;
      default:
        return <span className="text-yellow-600">Pending</span>;
    }
  };

  const getBookingStatusBadge = (cancelled) => {
    if (!cancelled) {
      return (
        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <MdCheck className="h-5 w-5 mr-1" />
          Confirmed
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <MdClose className="h-5 w-5 mr-1" />
          Cancelled
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Booking Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'} Found
          </h5>
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booked On</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.bookedOn}
                onChange={(e) => setFilterOptions({...filterOptions, bookedOn: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.bookingDate}
                onChange={(e) => setFilterOptions({...filterOptions, bookingDate: e.target.value})}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.venueName}
                onChange={(e) => setFilterOptions({...filterOptions, venueName: e.target.value})}
              >
                <option value="all">All Venues</option>
                {venueNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Table View (Hidden on small screens) */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr className="bg-orange-600 text-orange-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Venue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Booked On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr 
                        key={booking._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.venue?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">
                            <div className="flex items-center">
                              <MdLocationOn className="h-3 w-3 mr-1" />
                              {booking.venue?.city || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MdPerson className="h-4 w-4 mr-1" />
                            {booking.user?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MdCalendarToday className="h-4 w-4 mr-1" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <MdAccessTime className="h-3 w-3 mr-1" />
                            {getTimeslotLabel(booking.timeslot)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MdPeopleAlt className="h-4 w-4 mr-1" />
                            {booking.numberOfGuest}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{booking.amount?.toLocaleString() || '0'}
                          </div>
                          <div className="text-xs text-gray-500">
                            <div className="flex items-center">
                              <MdPayment className="h-3 w-3 mr-1" />
                              {getPaymentStatusBadge(booking.paymentStatus)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getBookingStatusBadge(booking.isCancelled)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card View (Visible on small screens) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div 
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.venue?.name || 'N/A'}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <MdLocationOn className="h-4 w-4 mr-1" />
                          {booking.venue?.city || 'N/A'}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                          {getBookingStatusBadge(booking.isCancelled)}
                        <div className="mt-2 text-sm font-medium text-gray-900">
                          ₹{booking.amount?.toLocaleString() || '0'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center text-sm text-gray-700 mb-1">
                            <MdPerson className="h-4 w-4 mr-1" />
                            <span className="font-medium">User:</span>
                          </div>
                          <div className="text-sm text-gray-900 ml-5">{booking.user?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500 ml-5">{booking.user?.email || 'N/A'}</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-700 mb-1">
                            <MdCalendarToday className="h-4 w-4 mr-1" />
                            <span className="font-medium">Event Date:</span>
                          </div>
                          <div className="text-sm text-gray-900 ml-5">{new Date(booking.date).toLocaleDateString()}</div>
                          <div className="flex items-center text-xs text-gray-500 ml-5">
                            <MdAccessTime className="h-3 w-3 mr-1" />
                            {getTimeslotLabel(booking.timeslot)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-700 mb-1">
                            <MdPeopleAlt className="h-4 w-4 mr-1" />
                            <span className="font-medium">Guests:</span>
                          </div>
                          <div className="text-sm text-gray-900 ml-5">{booking.numberOfGuest}</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-700 mb-1">
                            <MdPayment className="h-4 w-4 mr-1" />
                            <span className="font-medium">Booked On:</span>
                          </div>
                          <div className="text-sm text-gray-900 ml-5">{new Date(booking.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500 ml-5">
                            {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No bookings found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBookings;
