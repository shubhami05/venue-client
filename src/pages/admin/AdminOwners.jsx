import React, { useState } from 'react';
import { MdEdit, MdDelete, MdBlock, MdLocationOn, MdPhone } from 'react-icons/md';

const AdminOwners = ({ searchTerm }) => {
  // Sample data - replace with actual API call
  const [owners] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      location: 'New York, NY',
      venueCount: 3,
      status: 'active',
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8901',
      location: 'Los Angeles, CA',
      venueCount: 2,
      status: 'pending',
      joinedDate: '2024-02-20'
    },
    // Add more sample owners
  ]);

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (ownerId) => {
    // Implement edit functionality
    console.log('Edit owner:', ownerId);
  };

  const handleDelete = (ownerId) => {
    // Implement delete functionality
    console.log('Delete owner:', ownerId);
  };

  const handleToggleStatus = (ownerId) => {
    // Implement status toggle functionality
    console.log('Toggle status for owner:', ownerId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Owner Management</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          Add New Owner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOwners.map((owner) => (
          <div key={owner.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{owner.name}</h2>
                <p className="text-gray-600">{owner.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                owner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {owner.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <MdPhone className="h-5 w-5 mr-2" />
                {owner.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <MdLocationOn className="h-5 w-5 mr-2" />
                {owner.location}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span>Venues: {owner.venueCount}</span>
              <span>Joined: {owner.joinedDate}</span>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={() => handleEdit(owner.id)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <MdEdit className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleToggleStatus(owner.id)}
                className="text-yellow-600 hover:text-yellow-900"
              >
                <MdBlock className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleDelete(owner.id)}
                className="text-red-600 hover:text-red-900"
              >
                <MdDelete className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOwners; 