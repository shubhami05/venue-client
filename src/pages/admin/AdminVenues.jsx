import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdBlock, MdStar, MdLocationOn, MdPerson, MdPending, MdViewCozy, MdHideImage, MdMail, MdPhone, MdEvent } from 'react-icons/md';
import { FaFilter, FaStar } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import VenueDetailsModal from '../../components/VenueDetailsModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

const AdminVenues = ({ searchTerm }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    city: 'all',
    ownerEmail: 'all'
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  });
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

  const fetchVenueDetails = async (venueId) => {
    try {
      setModalLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/venue/fetch/${venueId}`
      );

      if (response.data.success) {
        setSelectedVenue(response.data.venue);
      } else {
        toast.error(response.data.message || 'Failed to fetch venue details');
        setSelectedVenue(null);
      }
    } catch (error) {
      console.error('Error fetching venue details:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch venue details');
      setSelectedVenue(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleRowClick = (venueId) => {
    // Only reset if clicking on a different venue
    if (selectedVenue?._id !== venueId) {
      fetchVenueDetails(venueId);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      (venue.name || '').toLowerCase().includes(searchTermLower) ||
      (venue.owner?.name || '').toLowerCase().includes(searchTermLower) ||
      (venue.owner?.email || '').toLowerCase().includes(searchTermLower) ||
      (venue.owner?.phone || '').toLowerCase().includes(searchTermLower) ||
      (venue.city || '').toLowerCase().includes(searchTermLower)
    );

    // Apply city filter if selected
    const matchesCity = filterOptions.city === 'all' || venue.city === filterOptions.city;

    // Apply owner email filter if selected
    const matchesOwnerEmail = filterOptions.ownerEmail === 'all' || 
      venue.owner?.email === filterOptions.ownerEmail;

    return matchesSearchTerm && matchesCity && matchesOwnerEmail;
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
    const venue = venues.find(v => v._id === venueId);
    setConfirmationModal({
      isOpen: true,
      title: 'Move to Pending',
      message: `Are you sure you want to move "${venue.name}" to pending status? This will hide the venue from users.`,
      type: 'warning',
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await axios.put(
            `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/venue/status/${venueId}`,
            { status: 'pending' }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            fetchVenues(); // Refresh the venues list
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to update venue status');
        } finally {
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setLoading(false);
        }
      }
    });
  };

  // Get unique cities for filter dropdown
  const cities = [...new Set(venues.map(venue => venue.city).filter(Boolean))];

  // Get unique owner emails for filter dropdown
  const ownerEmails = [...new Set(venues.map(venue => venue.owner?.email).filter(Boolean))];

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex text-orange-500">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? "text-orange-500" : "text-gray-300"} />
        ))}
      </div>
    );
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
        <h1 className="text-2xl font-bold">Venue Management</h1>
        <button
          onClick={() => navigate('/admin/venues/pending')}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <MdPending className="mr-2" />
          Pending Venues
        </button>
      </div>
      
      {error ? (<p>{error}</p> 
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h5 className="text-lg font-semibold text-gray-900">
                {filteredVenues.length} {filteredVenues.length === 1 ? 'Venue' : 'Venues'} Found
              </h5>
              <div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  <FaFilter />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                    value={filterOptions.city}
                    onChange={(e) => setFilterOptions({...filterOptions, city: e.target.value})}
                  >
                    <option value="all">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                  <select
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                    value={filterOptions.ownerEmail}
                    onChange={(e) => setFilterOptions({...filterOptions, ownerEmail: e.target.value})}
                  >
                    <option value="all">All Owner Emails</option>
                    {ownerEmails.map(email => (
                      <option key={email} value={email}>{email}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Table View (Hidden on small screens) */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr className="bg-orange-600 text-orange-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                   
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Booking Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Remove</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVenues.map((venue) => (
                    <tr 
                      key={venue._id}
                      onClick={() => handleRowClick(venue._id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
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
                            {venue.city || 'N/A'}
                          </div>
                        </div>
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        {venue.rating ? (
                          <div className="flex items-center">
                            {renderStars(venue.rating)}
                            <span className="ml-1 text-sm text-gray-700">({venue.rating.toFixed(1)})</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No ratings</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{venue.bookingPay || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(venue._id);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Remove Venue"
                          >
                            <MdHideImage className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card View (Visible on small screens) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredVenues.map((venue) => (
              <div 
                key={venue._id}
                onClick={() => handleRowClick(venue._id)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MdLocationOn className="h-4 w-4 mr-1" />
                        {venue.city || 'N/A'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{venue.withoutFoodRent?.fullday || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Full Day Rate</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdPerson className="h-4 w-4 mr-1" />
                          <span className="font-medium">Owner:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">{venue.owner?.name || 'N/A'}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdMail className="h-4 w-4 mr-1" />
                          <span className="font-medium">Email:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">{venue.owner?.email || 'N/A'}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdPhone className="h-4 w-4 mr-1" />
                          <span className="font-medium">Phone:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">{venue.owner?.phone || 'N/A'}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdStar className="h-4 w-4 mr-1" />
                          <span className="font-medium">Rating:</span>
                        </div>
                        <div className="ml-5">
                          {venue.rating ? (
                            <div className="flex items-center">
                              {renderStars(venue.rating)}
                              <span className="ml-1 text-sm text-gray-700">({venue.rating.toFixed(1)})</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No ratings</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(venue._id);
                      }}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      title="Remove Venue"
                    >
                      <MdHideImage className="h-5 w-5 mr-1" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Venue Details Modal */}
      {(selectedVenue || modalLoading) && (
        <VenueDetailsModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          loading={modalLoading}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
      />
    </div>
  );
};

export default AdminVenues;
