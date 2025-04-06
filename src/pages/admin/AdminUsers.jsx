import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdBlock, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminUsers = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    joinDate: 'all'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/user/fetch`
      );

      if (response.data.success) {
        // Filter only users with role 'user'
        const userRoleUsers = response.data.users.filter(user => user.role === 'user');
        setUsers(userRoleUsers);
        console.log(userRoleUsers);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || 'Failed to fetch users');
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      (user.name || '').toLowerCase().includes(searchTermLower) ||
      (user.email || '').toLowerCase().includes(searchTermLower) ||
      (user.phone || '').toString().includes(searchTermLower) ||
      (user.location || '').toLowerCase().includes(searchTermLower)
    );
    
    // Apply join date filter if selected
    let matchesJoinDate = true;
    if (filterOptions.joinDate !== 'all') {
      const joinDate = new Date(user.joinedDate);
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      
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
    
    return matchesSearchTerm && matchesJoinDate;
  });

  const handleEdit = (userId) => {
    // Implement edit functionality
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    // Implement delete functionality
    console.log('Delete user:', userId);
  };

  // const handleToggleStatus = async (userId) => {
  //   try {
  //     const response = await axios.put(
  //       `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/user/toggle-status/${userId}`
  //     );

  //     if (response.data.success) {
  //       toast.success(response.data.message);
  //       fetchUsers(); // Refresh the users list
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to toggle user status');
  //   }
  // };

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
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'} Found
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
          <div className="mt-4">
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
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Joined Date</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Actions</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <MdPhone className="h-4 w-4 mr-1" />
                      {user.phone || 'N/A'}
                    </div>

                  </div>
                </td>
               
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joinedDate}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit User"
                    >
                      <MdEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title={`${user.status === 'active' ? 'Block' : 'Activate'} User`}
                    >
                      <MdBlock className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete User"
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

export default AdminUsers; 