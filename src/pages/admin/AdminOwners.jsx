import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdBlock, MdLocationOn, MdPhone, MdPending } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const AdminOwners = ({ searchTerm }) => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    venueCount: 'all',
    joinDate: 'all'
  });
  const navigate = useNavigate();

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
    const matchesSearchTerm = (
      (owner.fullname || '').toLowerCase().includes(searchTermLower) ||
      (owner.email || '').toLowerCase().includes(searchTermLower) ||
      (owner.mobile || '').toString().includes(searchTermLower)
    );
    
    // Apply venue count filter if selected
    let matchesVenueCount = true;
    if (filterOptions.venueCount !== 'all') {
      const count = owner.venueCount || 0;
      switch (filterOptions.venueCount) {
        case 'none':
          matchesVenueCount = count === 0;
          break;
        case 'one':
          matchesVenueCount = count === 1;
          break;
        case 'multiple':
          matchesVenueCount = count > 1;
          break;
        default:
          matchesVenueCount = true;
      }
    }
    
    // Apply join date filter if selected
    let matchesJoinDate = true;
    if (filterOptions.joinDate !== 'all') {
      const joinDate = new Date(owner.joinedDate);
      const now = new Date();
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 2)); // -3 total
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 3)); // -6 total
      
      switch (filterOptions.joinDate) {
        case 'lastMonth':
          matchesJoinDate = joinDate >= oneMonthAgo;
          break;
        case 'last3Months':
          matchesJoinDate = joinDate >= threeMonthsAgo;
          break;
        case 'last6Months':
          matchesJoinDate = joinDate >= sixMonthsAgo;
          break;
        default:
          matchesJoinDate = true;
      }
    }
    
    return matchesSearchTerm && matchesVenueCount && matchesJoinDate;
  });

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
        <button
          onClick={() => navigate('/admin/owners/pending')}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <MdPending className="mr-2" />
          Pending Applications
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredOwners.length} {filteredOwners.length === 1 ? 'Owner' : 'Owners'} Found
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Count</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.venueCount}
                onChange={(e) => setFilterOptions({...filterOptions, venueCount: e.target.value})}
              >
                <option value="all">All Owners</option>
                <option value="none">No Venues</option>
                <option value="one">One Venue</option>
                <option value="multiple">Multiple Venues</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.joinDate}
                onChange={(e) => setFilterOptions({...filterOptions, joinDate: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
              </select>
            </div>
          </div>
        )}
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