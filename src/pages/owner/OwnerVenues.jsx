import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/owner/venue/fetch');

        if (response.data.success) {
          setVenues(response.data.venues);
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

  // Filter and paginate venues
  useEffect(() => {
    const filteredVenues = venues.filter(venue =>
      venue.name.toLowerCase().includes((debouncedSearchTerm || "").toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredVenues.slice(indexOfFirstItem, indexOfLastItem));
    setTotalPages(Math.ceil(filteredVenues.length / itemsPerPage));
  }, [venues, debouncedSearchTerm, currentPage]);

  // Handle delete venue
  const handleDelete = (e, venue) => {
    e.stopPropagation(); // Prevent row click event
    setVenueToDelete(venue);
    setShowDeleteModal(true);
  };

  // Add new function to handle the actual deletion
  const confirmDelete = async () => {
    if (!venueToDelete) return;

    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/owner/venue/delete/${venueToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      if (response.data.success) {
        setVenues(venues.filter(venue => venue._id !== venueToDelete._id));
        toast.success('Venue deleted successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting venue');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setVenueToDelete(null);
    }
  };

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
    <div className="rounded-sm border border-stroke text-orange-900 bg-orange-50 shadow-default dark:border-strokedark dark:bg-boxdark px-2 sm:px-5 min-h-screen">
      <div className="py-6 px-2 sm:px-6 xl:px-7 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h4 className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-white">
          All Venues
        </h4>
        <button
          className="bg-orange-600 shadow-lg transition-colors hover:bg-orange-700 text-orange-50 font-bold py-2 px-4 rounded flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={() => navigate('/owner/venues/new')}
        >
          <FaPlus />
          Add New Venue
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-orange-600 text-orange-50">
              <th className="py-4 px-2 text-left">Actions</th>
              <th className="py-4 px-2 text-left">Venue Name</th>
              <th className="py-4 px-2 text-left">Type</th>
              <th className="py-4 px-2 text-left">City</th>
              <th className="py-4 px-2 text-left">Booking Pay</th>
              <th className="py-4 px-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((venue) => (
              <tr key={venue._id} className="border-b border-orange-100 bg-zinc-50 hover:bg-orange-100 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex space-x-2">
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
                    {/* <button
                      onClick={(e) => handleDelete(e, venue)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      title="Delete Venue"
                    >
                      <FaTrash size={16} />
                    </button> */}
                  </div>
                </td>
                <td className="py-3 px-2 font-medium">{venue.name}</td>
                <td className="py-3 px-2">{venue.type}</td>
                <td className="py-3 px-2">{venue.city}</td>
                <td className="py-3 px-2">₹{venue.bookingPay}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded ${venue.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {venue.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {currentItems.map((venue) => (
          <div key={venue._id} className="bg-zinc-50 rounded-lg shadow mb-4 border border-orange-100">
            <div className="p-4 border-b border-orange-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">{venue.name}</h3>
              <div className="flex space-x-2">
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
                {/* <button
                  onClick={(e) => handleDelete(e, venue)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Delete Venue"
                >
                  <FaTrash size={16} />
                </button> */}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{venue.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">City:</span>
                <span>{venue.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Booking Pay:</span>
                <span>₹{venue.bookingPay}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded ${venue.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {venue.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`m-1 px-3 py-1 rounded ${currentPage === index + 1
                ? 'bg-orange-500 text-white'
                : 'bg-orange-200 text-orange-900'
                }`}
            >
              {index + 1}
            </button>
          ))}
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
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setVenueToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Venue"
        message={`Are you sure you want to delete "${venueToDelete?.name}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default OwnerVenues;

