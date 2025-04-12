import React, { useEffect, useState } from 'react';
import { MdLocationOn, MdCalendarToday, MdAccessTime, MdPeopleAlt, MdCheck, MdSearchOff, MdClose, MdCancel } from 'react-icons/md';
import { FaBuilding, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Bookingspage = () => {
  const { FetchSession, user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    // Fetch user bookings when component mounts
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/user/booking/fetch`
      );
      console.log(response.data.bookings);
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeslotLabel = (timeslot) => {
    switch (timeslot) {
      case 0: return 'Morning';
      case 1: return 'Evening';
      case 2: return 'Full Day';
      default: return 'Unknown';
    }
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setSelectedBooking(null);
    setShowCancelModal(false);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/user/booking/cancel/${selectedBooking._id}`
      );

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        closeCancelModal();
        fetchUserBookings();
      } else {
        toast.error(response.data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-100 to-orange-50 pt-8 pb-16' style={{ paddingTop: '80px' }}>
      <div className='container mx-auto px-4'>
        {error ? (
          <div className='flex flex-col items-center justify-center rounded-lg p-8 text-center'>
            <FaExclamationTriangle className="w-24 h-24 text-red-500 mb-4" />
            <h2 className='text-2xl font-semibold text-red-600 mb-2'>Oops! Something went wrong</h2>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>{error || "We couldn't load your bookings. Please try again later."}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchUserBookings}
                className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors'
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/explore')}
                className='bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors'
              >
                Explore Venues
              </button>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className='flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8 text-center'>
            <MdSearchOff className="w-32 h-32 text-orange-300 mb-4" />
            <h2 className='text-2xl font-semibold text-gray-700 mb-2'>No Bookings Found</h2>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>You haven't made any bookings yet. Explore our collection of beautiful venues and book one for your next event!</p>
            <button
              onClick={() => navigate('/explore')}
              className='bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg'
            >
              Explore Venues
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center'>
              My Bookings
            </h1>
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className='bg-white rounded-xl shadow-md overflow-hidden'
              >
                <div className='md:flex'>
                  <div className='md:flex-shrink-0 bg-orange-600 md:w-1/4 p-6 flex flex-col justify-center items-center text-white'>
                    <div className='text-center'>
                      <h3 className='text-xl font-bold mb-2 truncate'>{booking.venue.name}</h3>
                      <div className='flex items-center justify-center mb-3'>
                        <MdLocationOn className='h-4 w-4 mr-1' />
                        <span className='text-sm'>{booking.venue.city}</span>
                      </div>
                      <div className='inline-block px-3 py-1 rounded-full bg-white/20 text-sm'>
                        <FaBuilding className='inline h-3 w-3 mr-1' />
                        {booking.venue.type}
                      </div>
                    </div>
                  </div>

                  <div className='p-6 md:flex-1'>
                    <div className='md:flex justify-between items-start'>
                      <div className='space-y-4 mb-4 md:mb-0'>
                        <div className='flex items-start'>
                          <MdCalendarToday className='h-5 w-5 text-orange-600 mr-2 mt-0.5' />
                          <div>
                            <p className='text-xs text-gray-500'>EVENT DATE</p>
                            <p className='text-gray-800 font-medium'>{formatDate(booking.date)}</p>
                          </div>
                        </div>

                        <div className='flex items-start'>
                          <MdAccessTime className='h-5 w-5 text-orange-600 mr-2 mt-0.5' />
                          <div>
                            <p className='text-xs text-gray-500'>TIME SLOT</p>
                            <p className='text-gray-800 font-medium'>{getTimeslotLabel(booking.timeslot)}</p>
                          </div>
                        </div>

                        <div className='flex items-start'>
                          <MdPeopleAlt className='h-5 w-5 text-orange-600 mr-2 mt-0.5' />
                          <div>
                            <p className='text-xs text-gray-500'>GUESTS</p>
                            <p className='text-gray-800 font-medium'>{booking.numberOfGuest} people</p>
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-col items-end space-y-4'>
                        <div className='text-right'>
                          <p className='text-xs text-gray-500'>BOOKING DATE</p>
                          <p className='text-gray-700 text-sm'>{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>

                        {booking.isCancelled ? (
                          <span className='px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                            <MdClose className='h-5 w-5 mr-1' />
                            Cancelled
                          </span>
                        ) : (
                          <span className='px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                            <MdCheck className='h-5 w-5 mr-1' />
                            Confirmed
                          </span>
                        )}
                        {booking.venue.cancellation && !booking.isCancelled && (
                          <button
                            onClick={() => openCancelModal(booking)}
                            className='mt-2 text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center'
                          >
                            Cancel Booking
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/explore/venue/${booking.venue._id}`)}
                          className='mt-2 text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center'
                        >
                          View Venue
                          <svg className='ml-1 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Booking Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Booking Confirmation</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to cancel your booking for <span className="font-semibold">{selectedBooking.venue.name}</span> on {formatDate(selectedBooking.date)}?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-left">
                <p className="text-sm text-red-700 font-medium">Important Notice:</p>
                <p className="text-sm text-red-600">
                  Please note that cancellation is non-refundable. The booking amount will not be returned.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookingspage;
