import React, { useEffect, useState } from 'react';
import { FaStar, FaEnvelope, FaFilter, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

function OwnerReviews({ searchTerm }) {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    venue: 'all',
    rating: 'all'
  });
  const [venues, setVenues] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Fetch all reviews for owner's venues
  useEffect(() => {
    fetchVenueReviews();
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (showViewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showViewModal]);

  const fetchVenueReviews = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/owner/review/fetch`);

      if (response.data.success) {
        setReviews(response.data.reviews);
        setFilteredReviews(response.data.reviews);

        // Extract unique venues for filter dropdown
        const uniqueVenues = [...new Set(response.data.reviews.map(review => review.venue._id))];
        const venueOptions = uniqueVenues.map(venueId => {
          const venueReview = response.data.reviews.find(review => review.venue._id === venueId);
          return {
            id: venueId,
            name: venueReview.venue.name
          };
        });
        setVenues(venueOptions);
      } else {
        toast.error(response.data.message || 'Failed to fetch reviews');
        setError(response.data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch reviews');
      setError(error.response?.data?.message || 'Error fetching reviews');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters when filter options or search term changes
  useEffect(() => {
    let result = [...reviews];

    // Filter by venue
    if (filterOptions.venue !== 'all') {
      result = result.filter(review => review.venue._id === filterOptions.venue);
    }

    // Filter by rating
    if (filterOptions.rating !== 'all') {
      result = result.filter(review => review.rating === parseInt(filterOptions.rating));
    }

    // Apply search term
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(review => 
        review.message.toLowerCase().includes(searchLower) ||
        review.user.name.toLowerCase().includes(searchLower) ||
        review.venue.name.toLowerCase().includes(searchLower) ||
        review.venue.city.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredReviews(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [reviews, filterOptions, searchTerm]);

  // Handle view review details
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  // Send email to customer
  const sendEmail = (review) => {
    const subject = `Regarding your review of ${review.venue.name}`;
    const body = `Dear ${review.user.name},\n\nThank you for your review of ${review.venue.name}.\n\nWe appreciate your feedback and would like to discuss your experience further.\n\nBest regards,\nVenue Owner`;

    window.location.href = `mailto:${review.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const handleSubmitReply = async (reviewId) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsSubmittingReply(true);
    const loadingToastId = toast.loading('Submitting reply...');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/review/reply/${reviewId}`,
        { message: replyMessage }
      );

      if (response.data.success) {
        toast.success('Reply submitted successfully', { id: loadingToastId });
        // Update the reviews list with the new reply
        fetchVenueReviews();
        handleCloseModal();
        setReplyMessage(''); // Clear the reply input
      } else {
        toast.error(response.data.message || 'Failed to submit reply', { id: loadingToastId });
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error(error.response?.data?.message || 'Failed to submit reply', { id: loadingToastId });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Add this function after other utility functions
  const getReplyStatus = (review) => {
    if (review.ownerReply?.message) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Replied
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Not Replied
      </span>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="rounded-sm border border-stroke text-orange-900 bg-orange-100 shadow-default dark:border-strokedark dark:bg-boxdark px-2 sm:px-5 min-h-screen">
      <div className="py-6 px-2 sm:px-6 xl:px-7">
        <h4 className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-white">
          Reviews Management
        </h4>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'} Found
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.venue}
                onChange={(e) => setFilterOptions({...filterOptions, venue: e.target.value})}
              >
                <option value="all">All Venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>{venue.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.rating}
                onChange={(e) => setFilterOptions({...filterOptions, rating: e.target.value})}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center shadow-sm">
          <p className="text-gray-500 text-lg">No reviews found.</p>
          {reviews.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search term.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="px-4 py-3 text-left">Venue</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Reply Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((review) => (
                  <tr key={review._id} className="border-b border-gray-200 hover:bg-orange-50">
                    <td className="px-4 py-3 font-medium">
                      <div className="max-w-xs truncate">
                        {review.venue.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate">
                        {review.user.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {getReplyStatus(review)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewReview(review)}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => sendEmail(review)}
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          title="Email Customer"
                        >
                          <FaEnvelope />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden">
            {currentItems.map((review) => (
              <div key={review._id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{review.venue.name}</div>
                    <div className="text-sm text-gray-600">{formatDate(review.createdAt)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {renderStars(review.rating)}
                    {getReplyStatus(review)}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">by {review.user.name}</span>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleViewReview(review)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <FaEye /> <span>View</span>
                  </button>
                  <button
                    onClick={() => sendEmail(review)}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                  >
                    <FaEnvelope /> <span>Email</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* View Review Modal */}
      {showViewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Review Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-white bg-orange-600 hover:text-orange-200 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{selectedReview.venue.name}</h4>
                  <p className="text-sm text-gray-600">{selectedReview.venue.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{formatDate(selectedReview.createdAt)}</p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-3">
                  <div className="font-medium text-gray-900 mr-2">Customer:</div>
                  <div>{selectedReview.user.name} ({selectedReview.user.email})</div>
                </div>
                <div className="flex items-center mb-3">
                  <div className="font-medium text-gray-900 mr-2">Rating:</div>
                  <div className="flex">{renderStars(selectedReview.rating)}</div>
                </div>
                <div className="mb-3">
                  <div className="font-medium text-gray-900 mb-1">Review:</div>
                  <p className="text-gray-700 border-l-4 border-orange-300 pl-3 py-2">{selectedReview.message}</p>
                </div>
              </div>

              {/* Owner Reply Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Your Reply</h4>
                {selectedReview.ownerReply?.message ? (
                  <div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="text-gray-700">{selectedReview.ownerReply.message}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Replied on: {formatDate(selectedReview.ownerReply.createdAt)}
                        </p>
                        <button
                          onClick={() => {
                            setReplyMessage(selectedReview.ownerReply.message);
                            selectedReview.ownerReply = null; // Allow editing the reply
                          }}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          Edit Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write your reply here..."
                      className="w-full p-3 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="4"
                      disabled={isSubmittingReply}
                    ></textarea>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleSubmitReply(selectedReview._id)}
                        disabled={isSubmittingReply || !replyMessage.trim()}
                        className={`px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center ${
                          (isSubmittingReply || !replyMessage.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmittingReply ? 'Submitting...' : 'Submit Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleCloseModal();
                    sendEmail(selectedReview);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FaEnvelope className="mr-2" />
                  Email Customer
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerReviews;
