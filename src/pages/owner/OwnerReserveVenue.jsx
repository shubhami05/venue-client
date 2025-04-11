import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FaCalendarAlt, FaClock, FaTrash, FaFilter } from 'react-icons/fa';
import { Modal, Button } from 'flowbite-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const OwnerReserveVenue = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [timeslot, setTimeslot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({
    venueName: '',
    date: null,
    timeslot: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [pastReservations, setPastReservations] = useState([]);
  const [loadingPastReservations, setLoadingPastReservations] = useState(true);

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
      setLoadingPastReservations(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/reservation/fetch`,
      );

      if (response.data.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Split reservations into upcoming and past
        const upcoming = [];
        const past = [];
        
        response.data.reservations.forEach(reservation => {
          const reservationDate = new Date(reservation.date);
          if (reservationDate >= today) {
            upcoming.push(reservation);
          } else {
            past.push(reservation);
          }
        });

        // Sort upcoming by date ascending (nearest first)
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Sort past by date descending (most recent first)
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setReservations(upcoming);
        setPastReservations(past);
      } else {
        // toast.error(response.data.message || 'Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // toast.error(error.response?.data?.message || 'Failed to fetch reservations');
    } finally {
      setLoadingReservations(false);
      setLoadingPastReservations(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedVenue || !selectedDate || !timeslot) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Reserving venue...');

    try {
      // First check availability
      const availabilityResponse = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/user/venue/check-availability`,
        {
          venueId: selectedVenue,
          date: selectedDate,
          timeslot: parseInt(timeslot)
        }
      );

      if (!availabilityResponse.data.isAvailable) {
        toast.error(availabilityResponse.data.message || 'Venue is not available for the selected date and time slot', { id: loadingToastId });
        setIsSubmitting(false);
        return;
      }

      // If available, proceed with reservation
      const bookingData = {
        venueId: selectedVenue,
        date: selectedDate,
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
        setTimeslot('');
        setSelectedDate(null); // Reset the date picker
      } else {
        toast.error(response.data.message || 'Failed to reserve venue', { id: loadingToastId });
      }
    } catch (error) {
      console.error('Error reserving venue:', error);
      if (error.response?.status === 409) {
        // Handle conflict (venue not available)
        toast.error(error.response?.data?.message || 'Venue is not available for the selected date and time slot', { id: loadingToastId });
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to reserve venue. Please try again.',
          { id: loadingToastId }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveReservation = async (reservationId) => {
    setReservationToDelete(reservationId);
    setShowDeleteModal(true);
  };

  const confirmDeleteReservation = async () => {
    if (!reservationToDelete) return;

    const loadingToastId = toast.loading('Removing reservation...');

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/reservation/${reservationToDelete}`
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
    } finally {
      setShowDeleteModal(false);
      setReservationToDelete(null);
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

  const getFilteredReservations = (reservationList) => {
    return reservationList.filter(reservation => {
      const venueNameMatch = filters.venueName === '' || reservation.venue.name === filters.venueName;

      let dateMatch = true;
      if (filters.date) {
        const filterDate = new Date(filters.date);
        const reservationDate = new Date(reservation.date);
        dateMatch = filterDate.toDateString() === reservationDate.toDateString();
      }

      const timeslotMatch = filters.timeslot === '' || reservation.timeslot.toString() === filters.timeslot;

      return venueNameMatch && dateMatch && timeslotMatch;
    });
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
                  className="w-full p-2 border bg-white  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                <label className="block text-gray-700  font-semibold mb-2">
                    Select Date
                </label>
                <div className="relative">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                        }}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="w-100 p-2 pl-10 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholderText="Select a date"
                        
                    />
                    <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Time Slot</label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={timeslot}
                    onChange={(e) => setTimeslot(e.target.value)}
                    className="w-full p-2 pl-10 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className={`bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? 'Reserving Venue...' : 'Reserve Venue'}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-lg  ">
          {/* Tabs */}
          <div className="inline-flex border-b border-gray-200 mb-6 rounded-md relative">
            <button
              className={`py-2 px-6 font-medium text-base rounded-md transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'text-white bg-orange-600 shadow-md'
                  : 'text-gray-500 bg-white hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Reservations
            </button>
            <button
              className={`py-2 px-6 font-medium text-base rounded-md transition-all duration-300 ${
                activeTab === 'past'
                  ? 'text-white bg-orange-600 shadow-md'
                  : 'text-gray-500 bg-white hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Reservations
            </button>
          </div>

          {/* Filters Header */}
          <div className="bg-white p-4 rounded-lg  mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h5 className="text-lg font-semibold text-gray-900">
                {activeTab === 'upcoming' 
                  ? `${getFilteredReservations(reservations).length} Upcoming ${getFilteredReservations(reservations).length === 1 ? 'Reservation' : 'Reservations'}`
                  : `${getFilteredReservations(pastReservations).length} Past ${getFilteredReservations(pastReservations).length === 1 ? 'Reservation' : 'Reservations'}`
                }
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
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                  <div className="relative">
                    <select
                      value={filters.venueName}
                      onChange={(e) => setFilters(prev => ({ ...prev, venueName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                    >
                      <option value="">All Venues</option>
                      {venues.map((venue) => (
                        <option key={venue._id} value={venue.name}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <DatePicker
                      selected={filters.date}
                      onChange={(date) => setFilters(prev => ({ ...prev, date }))}
                      className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                      placeholderText="Select date"
                      isClearable
                      dateFormat="yyyy-MM-dd"
                    />
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <div className="relative">
                    <select
                      value={filters.timeslot}
                      onChange={(e) => setFilters(prev => ({ ...prev, timeslot: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                    >
                      <option value="">All Time Slots</option>
                      <option value="0">Morning</option>
                      <option value="1">Evening</option>
                      <option value="2">Full Day</option>
                    </select>
                    <FaClock className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end mt-2">
                  <button
                    onClick={() => setFilters({
                      venueName: '',
                      date: null,
                      timeslot: ''
                    })}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'upcoming' ? (
            loadingReservations ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : getFilteredReservations(reservations).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming reservations found.</p>
            ) : (
              <>
                {/* Table view for larger screens */}
                <div className="hidden md:block rounded-lg overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead >
                      <tr className="bg-orange-600 text-white">
                        <th className="px-4 py-3 text-left">Venue</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Time Slot</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredReservations(reservations).map((reservation) => (
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

                {/* Card view for smaller screens - update to use filteredReservations */}
                <div className="md:hidden grid gap-4">
                  {getFilteredReservations(reservations).map((reservation) => (
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
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {reservation.confirmed ? 'Confirmed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : (
            // Past Reservations Tab
            loadingPastReservations ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : getFilteredReservations(pastReservations).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No past reservations found.</p>
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredReservations(pastReservations).map((reservation) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view for past reservations */}
                <div className="md:hidden grid gap-4">
                  {getFilteredReservations(pastReservations).map((reservation) => (
                    <div key={reservation._id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reservation.venue.name}</h3>
                          <p className="text-sm text-gray-600">{reservation.venue.city}</p>
                        </div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setReservationToDelete(null);
        }}
        onConfirm={confirmDeleteReservation}
        title="Confirm Deletion"
        message="Are you sure you want to delete this reservation? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default OwnerReserveVenue; 