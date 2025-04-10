import React, { useEffect, useState } from 'react';
import { FaEye, FaUser, FaBuilding, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUserFriends, FaFilter, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

function OwnerBookings({ searchTerm = '' }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    venue: 'all',
    paymentStatus: 'all',
    isCancelled: 'all',
    dateRange: 'all',
    timeslot: 'all'
  });
  const [venues, setVenues] = useState([]);

  // Add a useEffect to handle body scroll locking
  useEffect(() => {
    if (showModal) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Debounce search term
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Filter and paginate bookings
  useEffect(() => {
    let filtered = bookings;

    // Filter by venue
    if (filterOptions.venue !== 'all') {
      filtered = filtered.filter(booking => booking.venue._id === filterOptions.venue);
    }
    
    // Filter by payment status and cancellation status
    if (filterOptions.paymentStatus !== 'all' || filterOptions.isCancelled !== 'all') {
      filtered = filtered.filter(booking => {
        let matchesPaymentStatus = true;
        let matchesCancelledStatus = true;

        if (filterOptions.paymentStatus !== 'all') {
          matchesPaymentStatus = booking.paymentStatus === filterOptions.paymentStatus;
        }

        if (filterOptions.isCancelled !== 'all') {
          const isCancelled = filterOptions.isCancelled === 'true';
          matchesCancelledStatus = booking.isCancelled === isCancelled;
        }

        return matchesPaymentStatus && matchesCancelledStatus;
      });
    }
    
    // Filter by timeslot
    if (filterOptions.timeslot !== 'all') {
      filtered = filtered.filter(booking => booking.timeslot === parseInt(filterOptions.timeslot));
    }
    
    // Filter by date range
    const currentDate = new Date();
    if (filterOptions.dateRange === 'upcoming') {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= currentDate;
      });
    } else if (filterOptions.dateRange === 'past') {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate < currentDate;
      });
    } else if (filterOptions.dateRange === 'today') {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.toDateString() === currentDate.toDateString();
      });
    } else if (filterOptions.dateRange === 'week') {
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= currentDate && bookingDate <= oneWeekLater;
      });
    }

    // Apply search term
    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        (booking.user?.name?.toLowerCase() || '').includes(searchLower) ||
        (booking.venue?.name?.toLowerCase() || '').includes(searchLower) ||
        (booking.venue?.city?.toLowerCase() || '').includes(searchLower)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filtered.slice(indexOfFirstItem, indexOfLastItem));
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [bookings, debouncedSearchTerm, currentPage, filterOptions]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/owner/booking/fetch`);

      if (response.data.success) {
        setBookings(response.data.bookings);
        
        // Extract unique venues for filter dropdown
        const uniqueVenues = [...new Set(response.data.bookings.map(booking => booking.venue._id))];
        const venueOptions = uniqueVenues.map(venueId => {
          const venueBooking = response.data.bookings.find(booking => booking.venue._id === venueId);
          return {
            id: venueId,
            name: venueBooking.venue.name
          };
        });
        
        setVenues(venueOptions);
        
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      setError(error.response?.data?.message || 'Error fetching bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatDateSimple = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTimeslotText = (timeslot) => {
    switch(timeslot) {
      case 0:
        return 'Morning';
      case 1:
        return 'Evening';
      case 2:
        return 'Full Day';
      default:
        return 'Unknown';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaTimesCircle className="mr-1" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke text-orange-900 bg-orange-100 shadow-default dark:border-strokedark dark:bg-boxdark px-2 sm:px-5 min-h-screen">
      <div className="py-6 px-2 sm:px-6 xl:px-7">
        <h4 className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-white">
          Venue Bookings
        </h4>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {currentItems.length} {currentItems.length === 1 ? 'Booking' : 'Bookings'} Found
          </h5>
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.venue}
                onChange={(e) => setFilterOptions({...filterOptions, venue: e.target.value})}
              >
                <option value="all">All Venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>{venue.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.paymentStatus}
                onChange={(e) => setFilterOptions({...filterOptions, paymentStatus: e.target.value})}
              >
                <option value="all">All Payment Status</option>
                <option value="completed">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Status</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.isCancelled}
                onChange={(e) => setFilterOptions({...filterOptions, isCancelled: e.target.value})}
              >
                <option value="all">All Booking Status</option>
                <option value="false">Active</option>
                <option value="true">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.timeslot}
                onChange={(e) => setFilterOptions({...filterOptions, timeslot: e.target.value})}
              >
                <option value="all">All Time Slots</option>
                <option value="0">Morning</option>
                <option value="1">Evening</option>
                <option value="2">Full Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.dateRange}
                onChange={(e) => setFilterOptions({...filterOptions, dateRange: e.target.value})}
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="today">Today</option>
                <option value="week">Next 7 Days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Venue</th>
                <th className="px-4 py-3 text-left">Booking Date</th>
                <th className="px-4 py-3 text-left">Time Slot</th>
                <th className="px-4 py-3 text-left">Guests</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-200 hover:bg-orange-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{booking.user.name}</span>
                       
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{booking.venue.name}</span>
                        <span className="text-xs text-gray-500">{booking.venue.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{formatDateSimple(booking.date)}</td>
                    <td className="px-4 py-3">{getTimeslotText(booking.timeslot)}</td>
                    <td className="px-4 py-3">{booking.numberOfGuest}</td>
                    <td className="px-4 py-3">₹{booking.amount}</td>
                    <td className="px-4 py-3">
                      {booking.isCancelled ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      ) : (
                        getPaymentStatusBadge(booking.paymentStatus)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                        >
                          <FaEye size={14} className="mr-1" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {currentItems.length > 0 ? (
            currentItems.map((booking) => (
              <div key={booking._id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{booking.venue.name}</div>
                    <div className="text-sm text-gray-600">{booking.venue.city}</div>
                  </div>
                  <div>
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                </div>
                <div className="flex flex-col space-y-2 mb-3">
                  <div className="flex items-start space-x-2">
                    <FaUser className="mt-1 text-orange-600" />
                    <div>
                      <p className="font-medium">{booking.user.name}</p>
                      <p className="text-xs text-gray-500">{booking.user.email}</p>
                      <p className="text-xs text-gray-500">{booking.user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FaCalendarAlt className="mt-1 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Date:</span> {formatDateSimple(booking.date)}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Time:</span> {getTimeslotText(booking.timeslot)}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Guests:</span> {booking.numberOfGuest}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Amount:</span> ₹{booking.amount}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleViewBooking(booking)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <FaEye /> <span>View</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No bookings found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 mb-6">
          <div className="flex flex-wrap space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 rounded-md ${currentPage === index + 1
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking View Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Booking Details</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white bg-orange-600 hover:text-orange-200 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <FaUser className="mr-2" /> Customer Information
                  </h4>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Name:</span> {selectedBooking.user.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.user.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.user.phone}</p>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <FaBuilding className="mr-2" /> Venue Information
                  </h4>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Name:</span> {selectedBooking.venue.name}</p>
                    <p><span className="font-medium">Type:</span> {selectedBooking.venue.type}</p>
                    <p><span className="font-medium">City:</span> {selectedBooking.venue.city}</p>
                    <p><span className="font-medium">Address:</span> {selectedBooking.venue.address}</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2" /> Booking Details
                </h4>
                <div className="space-y-1 text-gray-700">
                  <p><span className="font-medium">Date:</span> {formatDateSimple(selectedBooking.date)}</p>
                  <p><span className="font-medium">Time Slot:</span> {getTimeslotText(selectedBooking.timeslot)}</p>
                  <p><span className="font-medium">Number of Guests:</span> {selectedBooking.numberOfGuest}</p>
                  <p><span className="font-medium">Amount Paid:</span> ₹{selectedBooking.amount}</p>
                  <p><span className="font-medium">Status:</span> {selectedBooking.confirmed ? 'Confirmed' : 'Pending Confirmation'}</p>
                  <p><span className="font-medium">Booking Created:</span> {formatDate(selectedBooking.createdAt)}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaTimesCircle className="mr-2" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerBookings;
