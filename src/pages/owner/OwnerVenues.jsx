import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import { useAuth } from '../../hooks/auth';
import toast from 'react-hot-toast';
import VenueDetailsModal from '../../components/VenueDetailsModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const OwnerVenues = ({ searchTerm }) => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const { userToken } = useAuth();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    type: 'all',
    city: 'all',
    status: 'all'
  });
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/owner/venue/fetch');

        if (response.data.success) {
          setVenues(response.data.venues);
          
          // Extract unique cities and types for filter dropdowns
          const uniqueCities = [...new Set(response.data.venues.map(venue => venue.city))];
          const uniqueTypes = [...new Set(response.data.venues.map(venue => venue.type))];
          
          setCities(uniqueCities);
          setTypes(uniqueTypes);
          
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch venues');
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch venue. Please try again.'
        );
        setError(error.response?.data?.message || 'Error fetching venues');

        console.error('Fetch venues error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Fetch venue details
  const fetchVenueDetails = async (venueId) => {
    try {
      setModalLoading(true);
      const response = await axios.get(`/api/owner/venue/fetch/${venueId}`);

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

  // Handle view button click
  const handleViewClick = (e, venueId) => {
    e.stopPropagation(); // Prevent row click event
    fetchVenueDetails(venueId);
  };

  // Handle edit venue
  const handleEdit = (e, venueId) => {
    e.stopPropagation(); // Prevent row click event
    navigate(`/owner/venues/edit/${venueId}`, {
      state: { venueId }
    });
  };

  // Filter venues based on search term and update pagination
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    let filteredVenues = venues;
    
    // Apply filters
    if (filterOptions.type !== 'all') {
      filteredVenues = filteredVenues.filter(venue => venue.type === filterOptions.type);
    }
    
    if (filterOptions.city !== 'all') {
      filteredVenues = filteredVenues.filter(venue => venue.city === filterOptions.city);
    }
    
    if (filterOptions.status !== 'all') {
      filteredVenues = filteredVenues.filter(venue => venue.status === filterOptions.status);
    }
    
    // Apply search term
    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filteredVenues = filteredVenues.filter(venue =>
        venue.name.toLowerCase().includes(searchLower) ||
        venue.city.toLowerCase().includes(searchLower) ||
        venue.type.toLowerCase().includes(searchLower)
      );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredVenues.slice(indexOfFirstItem, indexOfLastItem));
    setTotalPages(Math.ceil(filteredVenues.length / itemsPerPage));
  }, [venues, debouncedSearchTerm, currentPage, filterOptions]);




  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke text-orange-900 bg-orange-100 shadow-default dark:border-strokedark dark:bg-boxdark px-2 sm:px-5 min-h-screen">
      <div className="py-6 px-2 sm:px-6 xl:px-7 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h4 className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-white">
          All Venues
        </h4>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/owner/venues/new')}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Venue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {currentItems.length} {currentItems.length === 1 ? 'Venue' : 'Venues'} Found
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Type</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.type}
                onChange={(e) => setFilterOptions({...filterOptions, type: e.target.value})}
              >
                <option value="all">All Types</option>
                {types.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.city}
                onChange={(e) => setFilterOptions({...filterOptions, city: e.target.value})}
              >
                <option value="all">All Cities</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.status}
                onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
              >
                <option value="all">All Statuses</option>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="px-4 py-3 text-center">Actions</th>
                <th className="px-4 py-3 text-left">Venue Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Booking Pay</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((venue) => (
                  <tr key={venue._id} className="border-b border-gray-200 hover:bg-orange-50">
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={(e) => handleViewClick(e, venue._id)}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={(e) => handleEdit(e, venue._id)}
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          title="Edit Venue"
                        >
                          <FaEdit size={16} />
                        </button>
                        
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{venue.name}</td>
                    <td className="px-4 py-3">{venue.type}</td>
                    <td className="px-4 py-3">{venue.city}</td>
                    <td className="px-4 py-3">₹{venue.bookingPay}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        venue.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {venue.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No venues found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {currentItems.length > 0 ? (
            currentItems.map((venue) => (
              <div key={venue._id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{venue.name}</div>
                    <div className="text-sm text-gray-600">{venue.city}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    venue.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {venue.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">Type: {venue.type}</span>
                  <span className="text-sm text-gray-600">|</span>
                  <span className="text-sm text-gray-600">₹{venue.bookingPay}</span>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={(e) => handleViewClick(e, venue._id)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <FaEye /> <span>View</span>
                  </button>
                  <button
                    onClick={(e) => handleEdit(e, venue._id)}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                  >
                    <FaEdit /> <span>Edit</span>
                  </button>
                
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No venues found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 mb-6">
          <div className="flex flex-wrap space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 rounded-md ${currentPage === index + 1
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Venue Details Modal */}
      {(selectedVenue || modalLoading) && (
        <VenueDetailsModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          loading={modalLoading}
        />
      )}

      {/* Add the ConfirmationModal */}
     
    </div>
  );
};

export default OwnerVenues;

