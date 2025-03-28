import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdBlock, MdLocationOn, MdPhone } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminOwners = ({ searchTerm }) => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/owner/fetch`
      );

      if (response.data.success) {
        setOwners(response.data.owners);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch owners');
      toast.error(error.response?.data?.message || 'Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  };

  const filteredOwners = owners.filter(owner => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (owner.fullname || '').toLowerCase().includes(searchTermLower) ||
      (owner.email || '').toLowerCase().includes(searchTermLower) ||
      (owner.mobile || '').toString().includes(searchTermLower)
    );
  });

  const handleEdit = (ownerId) => {
    // Implement edit functionality
    console.log('Edit owner:', ownerId);
  };

  const handleDelete = (ownerId) => {
    // Implement delete functionality
    console.log('Delete owner:', ownerId);
  };

  const handleToggleStatus = async (ownerId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/owner/toggle-status/${ownerId}`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchOwners(); // Refresh the owners list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle owner status');
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
        <h1 className="text-2xl font-bold">Owner Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="bg-orange-600 text-orange-50">
              <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">Contact</th>

              <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">Venues</th>
              <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">Joined Date</th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOwners.map((owner) => (
              <tr key={owner._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{owner.fullname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{owner.email || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <MdPhone className="h-4 w-4 mr-1" />
                      {owner.mobile || 'N/A'}
                    </div>

                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{owner.venueCount || 0}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {owner.joinedDate}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(owner._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Owner"
                    >
                      <MdEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(owner._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title={`${owner.status === 'active' ? 'Block' : 'Activate'} Owner`}
                    >
                      <MdBlock className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(owner._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Owner"
                    >
                      <MdDelete className="h-5 w-5" />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOwners; 