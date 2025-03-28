import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdBlock, MdStar, MdLocationOn, MdPerson, MdPending } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const AdminVenues = ({ searchTerm }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/venue/fetch`
      );

      if (response.data.success) {
        setVenues(response.data.venues);
      } else {
        console.log(response.status);
        setError(response.data.message);

      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || 'Failed to fetch venues');
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Failed to fetch venues');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (venue.name || '').toLowerCase().includes(searchTermLower) ||
      (venue.owner?.name || '').toLowerCase().includes(searchTermLower) ||
      (venue.address || '').toLowerCase().includes(searchTermLower) ||
      (venue.city || '').toLowerCase().includes(searchTermLower)
    );
  });

  const handleEdit = (venueId) => {
    // Implement edit functionality
    console.log('Edit venue:', venueId);
  };

  const handleDelete = (venueId) => {
    // Implement delete functionality
    console.log('Delete venue:', venueId);
  };

  const handleToggleStatus = async (venueId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/venue/toggle-status/${venueId}`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchVenues(); // Refresh the venues list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle venue status');
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loader />
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
        <h1 className="text-2xl font-bold">Venue Management</h1>
        <button
          onClick={() => navigate('/admin/venues/pending')}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <MdPending className="mr-2" />
          Pending Venues
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="bg-orange-600 text-orange-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                    {venue.owner?.name || 'N/A'}
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
                    {venue.capacity || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₹{venue.withoutFoodRent?.fullday || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${venue.status === 'active' ? 'bg-green-100 text-green-800' :
                    venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {venue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(venue._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Venue"
                    >
                      <MdEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(venue._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title={`${venue.status === 'active' ? 'Block' : 'Activate'} Venue`}
                    >
                      <MdBlock className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(venue._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Venue"
                    >
                      <MdDelete className="h-5 w-5" />
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

export default AdminVenues;
