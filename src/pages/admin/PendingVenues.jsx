import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdPerson, MdCheck, MdClose, MdArrowBack } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const PendingVenues = ({ searchTerm }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingVenues();
  }, []);

  const fetchPendingVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/venue/pending`
      );

      if (response.data.success) {
        setVenues(response.data.venues);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || 'Failed to fetch pending venues');
      toast.error(error.response?.data?.message || 'Failed to fetch pending venues');
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (venue.name || '').toLowerCase().includes(searchTermLower) ||
      (venue.ownerId?.fullname || '').toLowerCase().includes(searchTermLower) ||
      (venue.address || '').toLowerCase().includes(searchTermLower) ||
      (venue.city || '').toLowerCase().includes(searchTermLower)
    );
  });

  const handleStatusChange = async (venueId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/venue/status/${venueId}`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchPendingVenues(); // Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update venue status');
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/venues')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <MdArrowBack className="mr-1" />
            Back to Venues
          </button>
          <h1 className="text-2xl font-bold">Pending Venues</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVenues.map((venue) => (
              <tr key={venue._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MdPerson className="h-4 w-4 mr-1" />
                    {venue.ownerId?.fullname || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <MdLocationOn className="h-4 w-4 mr-1" />
                      {venue.address || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {venue.city || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {venue.rooms + venue.halls || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₹{venue.withoutFoodRent?.fullday || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(venue.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(venue._id, 'accepted')}
                      className="text-green-600 hover:text-green-900"
                      title="Accept Venue"
                    >
                      <MdCheck className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(venue._id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                      title="Reject Venue"
                    >
                      <MdClose className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingVenues; 