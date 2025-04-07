import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaUser, FaBuilding, FaCalendarAlt, FaReply, FaComment, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { FaCommentSms } from 'react-icons/fa6';

function OwnerInquiries({ searchTerm = '' }) {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    venue: 'all',
    eventType: 'all',
    dateRange: 'all'
  });
  const [venues, setVenues] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  // Add a useEffect to handle body scroll locking
  useEffect(() => {
    if (showModal) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // Fetch inquiries on component mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Debounce search term
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Filter and paginate inquiries
  useEffect(() => {
    let filtered = inquiries;

    // Filter by venue
    if (filterOptions.venue !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.venue._id === filterOptions.venue);
    }
    
    // Filter by event type
    if (filterOptions.eventType !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.eventType === filterOptions.eventType);
    }
    
    // Filter by date range
    const currentDate = new Date();
    if (filterOptions.dateRange === 'today') {
      filtered = filtered.filter(inquiry => {
        const inquiryDate = new Date(inquiry.date);
        return inquiryDate.toDateString() === currentDate.toDateString();
      });
    } else if (filterOptions.dateRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(inquiry => {
        const inquiryDate = new Date(inquiry.date);
        return inquiryDate >= oneWeekAgo;
      });
    } else if (filterOptions.dateRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(inquiry => {
        const inquiryDate = new Date(inquiry.date);
        return inquiryDate >= oneMonthAgo;
      });
    }

    // Apply search term
    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(inquiry =>
        (inquiry.user?.name?.toLowerCase() || '').includes(searchLower) ||
        (inquiry.venue?.name?.toLowerCase() || '').includes(searchLower) ||
        (inquiry.message?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filtered.slice(indexOfFirstItem, indexOfLastItem));
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [inquiries, debouncedSearchTerm, currentPage, filterOptions]);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/owner/inquiry/fetch');

      if (response.data.success) {
        setInquiries(response.data.formattedInquiries);
        
        // Extract unique venues and event types for filter dropdowns
        const uniqueVenues = [...new Set(response.data.formattedInquiries.map(inquiry => inquiry.venue._id))];
        const venueOptions = uniqueVenues.map(venueId => {
          const venueInquiry = response.data.formattedInquiries.find(inquiry => inquiry.venue._id === venueId);
          return {
            id: venueId,
            name: venueInquiry.venue.name
          };
        });
        
        const uniqueEventTypes = [...new Set(response.data.formattedInquiries.map(inquiry => inquiry.eventType))];
        
        setVenues(venueOptions);
        setEventTypes(uniqueEventTypes);
        
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch inquiries');
        toast.error(response.data.message || 'Failed to fetch inquiries');
      }
    } catch (error) {
      console.error('Fetch inquiries error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch inquiries. Please try again.');
      setError(error.response?.data?.message || 'Error fetching inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  const formatDate2 = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
    <div className="rounded-sm border border-stroke text-orange-900 bg-orange-100 shadow-default dark:border-strokedark dark:bg-boxdark px-2 sm:px-5 min-h-screen">
      <div className="py-6 px-2 sm:px-6 xl:px-7">
        <h4 className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-white">
          Customer Inquiries
        </h4>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {currentItems.length} {currentItems.length === 1 ? 'Inquiry' : 'Inquiries'} Found
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.eventType}
                onChange={(e) => setFilterOptions({...filterOptions, eventType: e.target.value})}
              >
                <option value="all">All Event Types</option>
                {eventTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.dateRange}
                onChange={(e) => setFilterOptions({...filterOptions, dateRange: e.target.value})}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
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
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Venue</th>
                <th className="px-4 py-3 text-left">Event Type</th>
                <th className="px-4 py-3 text-left">Event Date</th>
                <th className="px-4 py-3 text-left">Received On</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((inquiry) => (
                  <tr key={inquiry._id} className="border-b border-gray-200 hover:bg-orange-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{inquiry.user.name}</span>
                        <span className="text-xs text-gray-500">{inquiry.user.email}</span>
                        <span className="text-xs text-gray-500">{inquiry.user.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{inquiry.venue.name}</span>
                        <span className="text-xs text-gray-500">{inquiry.venue.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{inquiry.eventType}</td>
                    <td className="px-4 py-3">{formatDate2(inquiry.date)}</td>
                    <td className="px-4 py-3">{formatDate(inquiry.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewInquiry(inquiry)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
                      >
                        <FaEnvelope size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No inquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {currentItems.length > 0 ? (
            currentItems.map((inquiry) => (
              <div key={inquiry._id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{inquiry.venue.name}</div>
                    <div className="text-sm text-gray-600">{inquiry.venue.city}</div>
                  </div>
                  <button
                    onClick={() => handleViewInquiry(inquiry)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
                  >
                    <FaEnvelope size={14} />
                    <span>View</span>
                  </button>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-start space-x-2">
                    <FaUser className="mt-1 text-orange-600" />
                    <div>
                      <p className="font-medium">{inquiry.user.name}</p>
                      <p className="text-xs text-gray-500">{inquiry.user.email}</p>
                      <p className="text-xs text-gray-500">{inquiry.user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FaCalendarAlt className="mt-1 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Event:</span> {inquiry.eventType}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Date:</span> {formatDate2(inquiry.date)}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium">Received:</span> {formatDate(inquiry.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No inquiries found
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

      {/* Inquiry View Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Inquiry Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white bg-orange-600 hover:text-orange-200 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <FaUser className="mr-2" /> Customer Information
                  </h4>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Name:</span> {selectedInquiry.user.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedInquiry.user.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedInquiry.user.phone}</p>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <FaBuilding className="mr-2" /> Venue Information
                  </h4>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Name:</span> {selectedInquiry.venue.name}</p>
                    <p><span className="font-medium">Type:</span> {selectedInquiry.venue.type}</p>
                    <p><span className="font-medium">City:</span> {selectedInquiry.venue.city}</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2" /> Event Details
                </h4>
                <div className="space-y-1 text-gray-700">
                  <p><span className="font-medium">Event Type:</span> {selectedInquiry.eventType}</p>
                  <p><span className="font-medium">Date:</span> {formatDate2(selectedInquiry.date)}</p>
                  <p><span className="font-medium">Inquiry Received:</span> {formatDate(selectedInquiry.createdAt)}</p>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <FaComment className="mr-2" /> Message
                </h4>
                <div className=" p-1 rounded border border-gray-200 min-h-[80px] text-gray-800">
                  {selectedInquiry.message}
                </div>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                {selectedInquiry.user.phone && (
                  <a 
                    href={`https://wa.me/${selectedInquiry.user.phone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(selectedInquiry.user.name)}, thank you for your inquiry about ${encodeURIComponent(selectedInquiry.venue.name)} for your ${encodeURIComponent(selectedInquiry.eventType)} event on ${encodeURIComponent(new Date(selectedInquiry.date).toLocaleDateString())}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaCommentSms className="mr-2" />
                    Reply via WhatsApp
                  </a>
                )}
                <a 
                  href={`mailto:${selectedInquiry.user.email}?subject=Re: Inquiry for ${selectedInquiry.venue.name}&body=Dear ${selectedInquiry.user.name},%0D%0A%0D%0AThank you for your inquiry about ${selectedInquiry.venue.name} for your ${selectedInquiry.eventType} event on ${new Date(selectedInquiry.date).toLocaleDateString()}.%0D%0A%0D%0A`}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaReply className="mr-2" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerInquiries;
