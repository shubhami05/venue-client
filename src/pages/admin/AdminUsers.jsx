import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdBlock, MdPhone, MdLocationOn } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminUsers = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return (
      (user.name || '').toLowerCase().includes(searchTermLower) ||
      (user.email || '').toLowerCase().includes(searchTermLower) ||
      (user.phone || '').toString().includes(searchTermLower) ||
      (user.location || '').toLowerCase().includes(searchTermLower)
    );
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