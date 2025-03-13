import React, { useState } from 'react';
import { MdEdit, MdDelete, MdBlock, MdStar } from 'react-icons/md';

const AdminVenues = ({ searchTerm }) => {
  // Sample data - replace with actual API call
  const [venues] = useState([
    {
      id: 1,
      name: 'Grand Ballroom',
      owner: 'John Smith',
      location: 'New York, NY',
      capacity: 500,
      status: 'active',
      rating: 4.5,
      price: 1000
    },
    {
      id: 2,
      name: 'Garden Paradise',
      owner: 'Sarah Johnson',
      location: 'Los Angeles, CA',
      capacity: 200,
      status: 'pending',
      rating: 4.8,
      price: 800
    },
    // Add more sample venues
  ]);

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (venueId) => {
    // Implement edit functionality
    console.log('Edit venue:', venueId);
  };

  const handleDelete = (venueId) => {
    // Implement delete functionality
    console.log('Delete venue:', venueId);
  };

  const handleToggleStatus = (venueId) => {
    // Implement status toggle functionality
    console.log('Toggle status for venue:', venueId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Venue Management</h1>
        <div className="flex space-x-2">
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
            Add New Venue
          </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVenues.map((venue) => (
              <tr key={venue.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{venue.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{venue.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap">{venue.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{venue.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap">${venue.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MdStar className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1">{venue.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    venue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(venue.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <MdEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(venue.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <MdBlock className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="text-red-600 hover:text-red-900"
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
