import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdPerson, MdCheck, MdClose, MdArrowBack, MdInfo, MdPhone, MdEmail, MdAccessTime, MdEvent, MdCategory, MdHouse } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import VenueDetailsModal from '../../components/VenueDetailsModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';


const PendingVenues = ({ searchTerm = '' }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    submissionDate: 'all',
    city: 'all'
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
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || 'Failed to fetch pending venues');
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
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      (venue.name || '').toLowerCase().includes(searchTermLower) ||
      (venue.owner?.name || '').toLowerCase().includes(searchTermLower) ||
      (venue.city || '').toLowerCase().includes(searchTermLower)
    );

    // Apply city filter if selected
    const matchesCity = filterOptions.city === 'all' || venue.city === filterOptions.city;

    // Apply submission date filter if selected
    let matchesSubmissionDate = true;
    if (filterOptions.submissionDate !== 'all') {
      const submissionDate = new Date(venue.submittedAt);
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      switch (filterOptions.submissionDate) {
        case 'today':
          matchesSubmissionDate = submissionDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesSubmissionDate = submissionDate.toDateString() === yesterday.toDateString();
          break;
        case 'lastWeek':
          matchesSubmissionDate = submissionDate >= lastWeek && submissionDate <= today;
          break;
        case 'lastMonth':
          matchesSubmissionDate = submissionDate >= lastMonth && submissionDate <= today;
          break;
        default:
          matchesSubmissionDate = true;
      }
    }
    
    return matchesSearchTerm && matchesCity && matchesSubmissionDate;
  });

  // Get unique cities for filter dropdown
  const cities = [...new Set(venues.map(venue => venue.city).filter(Boolean))];

  const handleStatusChange = async (venueId, newStatus) => {
    const venue = venues.find(v => v._id === venueId);
    const action = newStatus === 'accepted' ? 'accept' : 'reject';
    const type = newStatus === 'accepted' ? 'success' : 'danger';
    const title = newStatus === 'accepted' ? 'Accept Venue' : 'Reject Venue';
    const message = newStatus === 'accepted'
      ? `Are you sure you want to accept "${venue.name}"? This will make the venue visible to users.`
      : `Are you sure you want to reject "${venue.name}"? This action cannot be undone.`;

    setConfirmationModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: async () => {
        try {
          setLoading(true);
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
          toast.error(error.response?.data?.message || `Failed to ${action} venue`);
        } finally {
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setLoading(false);
        }
      }
    });
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
        <button
            onClick={() => navigate('/admin/venues')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <MdArrowBack className="mr-1" />
            Back to Venues
          </button>
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start justify-center space-x-4">
          <button
            onClick={() => navigate('/admin/venues')}
            className="flex items-center bg-inherit font-semibold text-orange-600 hover:text-orange-900 transition-all "
          >
            <MdArrowBack className="mr-1" />
            Back to Venues
          </button>
          <h1 className="text-2xl font-bold">Pending Venues</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredVenues.length} {filteredVenues.length === 1 ? 'Venue' : 'Venues'} Found
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.submissionDate}
                onChange={(e) => setFilterOptions({...filterOptions, submissionDate: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table View (Hidden on small screens) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
          <tr className="bg-orange-600 text-orange-50">
              <th className="px-6 py-3 text-left text-xs font-medium     uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium     uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium     uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium     uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium     uppercase tracking-wider">Submitted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium     uppercase tracking-wider">Actions</th>
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
                    {venue.owner.name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    
                    <div className="text-sm flex items-center ">
                      <MdLocationOn className="h-4 w-4 mr-1" />
                      {venue.city || 'N/A'}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₹{venue.bookingPay || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(venue.submittedAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(venue._id, 'accepted');
                      }}
                      className="text-green-600 hover:text-green-900"
                      title="Accept Venue"
                    >
                      <MdCheck className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(venue._id, 'rejected');
                      }}
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
                    <MdPerson className="h-4 w-4 mr-1" />
                    {venue.owner.name || 'N/A'}
                  </div>
                </div>
                <div className="text-sm text-gray-900">
                  ₹{venue.bookingPay || 'N/A'}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <MdLocationOn className="h-4 w-4 mr-1" />
                      <span className="font-medium">Location:</span>
                    </div>
                    <div className="text-sm text-gray-900 ml-5">{venue.address || 'N/A'}</div>
                    <div className="text-sm text-gray-700 ml-5">{venue.city || 'N/A'}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <MdAccessTime className="h-4 w-4 mr-1" />
                      <span className="font-medium">Submitted:</span>
                    </div>
                    <div className="text-sm text-gray-900 ml-5">
                      {new Date(venue.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(venue._id, 'accepted');
                  }}
                  className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full"
                  title="Accept Venue"
                >
                  <MdCheck className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(venue._id, 'rejected');
                  }}
                  className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                  title="Reject Venue"
                >
                  <MdClose className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default PendingVenues; 