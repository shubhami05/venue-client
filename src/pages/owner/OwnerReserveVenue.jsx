import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FaCalendarAlt, FaClock, FaTrash } from 'react-icons/fa';

const OwnerReserveVenue = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timeslot, setTimeslot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
    fetchReservations();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/owner/venue/fetch`);
      
      if (response.data.success) {
        setVenues(response.data.venues);
        if (response.data.venues.length > 0) {
          setSelectedVenue(response.data.venues[0]._id);
        }
      } else {
        setError(response.data.message || 'Failed to fetch venues');
        toast.error(response.data.message || 'Failed to fetch venues');
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      setError(error.response?.data?.message || 'Failed to fetch venues');
      toast.error(error.response?.data?.message || 'Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/reservation/fetch`,
       
      );
      
      if (response.data.success) {
        // Filter out past reservations and sort by date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingReservations = response.data.reservations
          .filter(reservation => new Date(reservation.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setReservations(upcomingReservations);
      } else {

        toast.error(response.data.message || 'Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch reservations');
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedVenue || !bookingDate || !timeslot) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Reserving venue...');

    try {
      const bookingData = {
        venueId: selectedVenue,
        date: bookingDate,
        timeslot: parseInt(timeslot), // 0-morning, 1-evening, 2-fullday
        isOwnerBooking: true
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/reservation/create`,
        bookingData
      );

      if (response.data.success) {
        toast.success('Venue reserved successfully!', { id: loadingToastId });
        // Refresh reservations list
        fetchReservations();
        // Reset form
        setBookingDate('');
        setTimeslot('');
      } else {
        toast.error(response.data.message || 'Failed to reserve venue', { id: loadingToastId });
      }
    } catch (error) {
      console.error('Error reserving venue:', error);
      toast.error(
        error.response?.data?.message || 'Failed to reserve venue. Please try again.',
        { id: loadingToastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to remove this reservation?')) {
      return;
    }

    const loadingToastId = toast.loading('Removing reservation...');

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/reservation/${reservationId}`
      );

      if (response.data.success) {
        toast.success('Reservation removed successfully!', { id: loadingToastId });
        // Refresh reservations list
        fetchReservations();
      } else {
        toast.error(response.data.message || 'Failed to remove reservation', { id: loadingToastId });
      }
    } catch (error) {
      console.error('Error removing reservation:', error);
      toast.error(
        error.response?.data?.message || 'Failed to remove reservation. Please try again.',
        { id: loadingToastId }
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTimeslotLabel = (timeslot) => {
    switch (timeslot) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-100">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-orange-100">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-orange-100">
        <p className="text-gray-500 mb-4">You don't have any venues to reserve</p>
        <button
          onClick={() => navigate('/owner/venues')}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Add a Venue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-100 py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
         
          <h1 className="text-3xl font-bold text-orange-900">Reserve Your Venue</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-orange-800">Make a New Reservation</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Select Venue</label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  {venues.map((venue) => (
                    <option key={venue._id} value={venue._id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Reservation Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Time Slot</label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={timeslot}
                    onChange={(e) => setTimeslot(e.target.value)}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Time Slot</option>
                    <option value="0">Morning</option>
                    <option value="1">Evening</option>
                    <option value="2">Full Day</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Reserving Venue...' : 'Reserve Venue'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-800">Upcoming Reservations</h2>
          
          {loadingReservations ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : reservations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming reservations found.</p>
          ) : (
            <>
              {/* Table view for larger screens */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Venue</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Time Slot</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <tr key={reservation._id} className="hover:bg-orange-50">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reservation.venue.name}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(reservation.date)}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getTimeslotLabel(reservation.timeslot)}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reservation.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.confirmed ? 'Confirmed' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveReservation(reservation._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view for smaller screens */}
              <div className="md:hidden grid gap-4">
                {reservations.map((reservation) => (
                  <div key={reservation._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{reservation.venue.name}</h3>
                        <p className="text-sm text-gray-600">{reservation.venue.city}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveReservation(reservation._id)}
                        className="text-red-600 hover:text-red-900 p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formatDate(reservation.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="mr-2" />
                        <span>{getTimeslotLabel(reservation.timeslot)}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerReserveVenue; 