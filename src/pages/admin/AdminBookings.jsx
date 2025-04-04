import React, { useState, useEffect } from 'react';
import { MdPerson, MdLocationOn, MdCalendarToday, MdAccessTime, MdPeopleAlt, MdCheck } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminBookings = ({ searchTerm = '' }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return (
      (booking.venue?.name || '').toLowerCase().includes(searchTermLower) ||
      (booking.user?.name || '').toLowerCase().includes(searchTermLower) ||
      (booking.user?.email || '').toLowerCase().includes(searchTermLower) ||
      (booking.venue?.city || '').toLowerCase().includes(searchTermLower)
    );
  });

  const getTimeslotLabel = (timeslot) => {
    switch (timeslot) {
      case 0: return 'Morning';
      case 1: return 'Evening';
      case 2: return 'Full Day';
      default: return 'Unknown';
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
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="bg-orange-600 text-orange-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Guests</th>
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
                      <div className="text-sm text-gray-700">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.confirmed ? (
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <MdCheck className="h-4 w-4 mr-1" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
