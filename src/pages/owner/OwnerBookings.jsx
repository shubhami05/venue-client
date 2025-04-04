import React, { useEffect, useState } from 'react';
import { FaEye, FaUser, FaBuilding, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUserFriends } from 'react-icons/fa';
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
    const filteredBookings = bookings.filter(booking => 
      (booking.user?.name?.toLowerCase() || '').includes((debouncedSearchTerm || '').toLowerCase()) ||
      (booking.venue?.name?.toLowerCase() || '').includes((debouncedSearchTerm || '').toLowerCase()) ||
      (booking.venue?.city?.toLowerCase() || '').includes((debouncedSearchTerm || '').toLowerCase())
    );
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredBookings.slice(indexOfFirstItem, indexOfLastItem));
    setTotalPages(Math.ceil(filteredBookings.length / itemsPerPage));
  }, [bookings, debouncedSearchTerm, currentPage]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/owner/bookings/fetch`);

      if (response.data.success) {
        setBookings(response.data.bookings);
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

  const handleConfirmBooking = async (bookingId) => {
    try {
      const response = await axios.patch(`/api/owner/bookings/${bookingId}/confirm`);
      
      if (response.data.success) {
        toast.success('Booking confirmed successfully!');
        // Update the bookings list
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId ? { ...booking, confirmed: true } : booking
          )
        );
        // Update the selected booking if modal is open
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, confirmed: true });
        }
      } else {
        toast.error(response.data.message || 'Failed to confirm booking');
      }
    } catch (error) {
      console.error('Confirm booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm booking. Please try again.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await axios.delete(`/api/owner/bookings/${bookingId}`);
      
      if (response.data.success) {
        toast.success('Booking deleted successfully!');
        // Remove the booking from the list
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        // Close the modal if the deleted booking was being viewed
        if (selectedBooking && selectedBooking._id === bookingId) {
          setShowModal(false);
        }
      } else {
        toast.error(response.data.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Delete booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete booking. Please try again.');
    }
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
    <div className="rounded-sm border border-stroke text-orange-900 bg-orange-50 shadow-default dark:border-strokedark dark:bg-boxdark px-2 sm:px-5 min-h-screen">
      <div className="py-6 px-2 sm:px-6 xl:px-7">
        <h4 className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-white">
          Venue Bookings
        </h4>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-orange-600 text-orange-50">
              <th className="py-4 px-2 text-left">Customer</th>
              <th className="py-4 px-2 text-left">Venue</th>
              <th className="py-4 px-2 text-left">Booking Date</th>
              <th className="py-4 px-2 text-left">Time Slot</th>
              <th className="py-4 px-2 text-left">Guests</th>
              <th className="py-4 px-2 text-left">Status</th>
              <th className="py-4 px-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((booking) => (
                <tr key={booking._id} className="border-b border-orange-100 bg-zinc-50 hover:bg-orange-100 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.user.name}</span>
                      <span className="text-xs text-gray-500">{booking.user.email}</span>
                      <span className="text-xs text-gray-500">{booking.user.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.venue.name}</span>
                      <span className="text-xs text-gray-500">{booking.venue.city}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">{formatDateSimple(booking.date)}</td>
                  <td className="py-3 px-2">{getTimeslotText(booking.timeslot)}</td>
                  <td className="py-3 px-2">{booking.numberOfGuest}</td>
                  <td className="py-3 px-2">
                    {booking.confirmed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FaTimesCircle className="mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                      >
                        <FaEye size={14} className="mr-1" />
                        <span>View</span>
                      </button>
                      {!booking.confirmed && (
                        <button
                          onClick={() => handleConfirmBooking(booking._id)}
                          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                        >
                          <FaCheckCircle size={14} className="mr-1" />
                          <span>Confirm</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
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
            <div key={booking._id} className="bg-zinc-50 rounded-lg shadow mb-4 border border-orange-100">
              <div className="p-4 border-b border-orange-100 flex justify-between items-center">
                <h3 className="font-bold text-lg truncate">{booking.venue.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewBooking(booking)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    <FaEye size={14} className="mr-1" />
                    <span>View</span>
                  </button>
                  {!booking.confirmed && (
                    <button
                      onClick={() => handleConfirmBooking(booking._id)}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    >
                      <FaCheckCircle size={14} className="mr-1" />
                      <span>Confirm</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start space-x-2">
                  <FaUser className="mt-1 text-orange-600" />
                  <div>
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-sm text-gray-500">{booking.user.email}</p>
                    <p className="text-sm text-gray-500">{booking.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FaCalendarAlt className="mt-1 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Date: {formatDateSimple(booking.date)}</p>
                    <p className="text-sm font-medium">Time: {getTimeslotText(booking.timeslot)}</p>
                    <p className="text-sm text-gray-500">Booked on: {formatDate(booking.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FaUserFriends className="mt-1 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Guests: {booking.numberOfGuest}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {booking.confirmed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaCheckCircle className="mr-1" />
                      Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FaTimesCircle className="mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-zinc-50 rounded-lg shadow p-4 text-center text-gray-500">
            No bookings found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`m-1 px-3 py-1 rounded ${currentPage === index + 1
                ? 'bg-orange-500 text-white'
                : 'bg-orange-200 text-orange-900'
                }`}
            >
              {index + 1}
            </button>
          ))}
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
                className="text-white hover:text-orange-200 text-2xl leading-none"
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
                  <p><span className="font-medium">Status:</span> {selectedBooking.confirmed ? 'Confirmed' : 'Pending Confirmation'}</p>
                  <p><span className="font-medium">Booking Created:</span> {formatDate(selectedBooking.createdAt)}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                {!selectedBooking.confirmed && (
                  <button
                    onClick={() => handleConfirmBooking(selectedBooking._id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaCheckCircle className="mr-2" />
                    Confirm Booking
                  </button>
                )}
                <button
                  onClick={() => handleDeleteBooking(selectedBooking._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaTimesCircle className="mr-2" />
                  Cancel Booking
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
