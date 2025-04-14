import React, { useState, useEffect } from 'react';
import { MdPerson, MdLocationOn, MdCalendarToday, MdAccessTime, MdEmail, MdMessage, MdClose } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminInquiries = ({ searchTerm = '' }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    inquiryDate: 'all',
    eventType: 'all',
    venueName: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/inquiries/fetch`
      );

      if (response.data.success) {
        setInquiries(response.data.inquiries);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setError(error.response?.data?.message || 'Failed to fetch inquiries');
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Failed to fetch inquiries');
      }
    } finally {
      setLoading(false);
    }
  };

  const openMessageModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedInquiry(null);
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      (inquiry.venue?.name || '').toLowerCase().includes(searchTermLower) ||
      (inquiry.user?.name || '').toLowerCase().includes(searchTermLower) ||
      (inquiry.user?.email || '').toLowerCase().includes(searchTermLower) ||
      (inquiry.eventType || '').toLowerCase().includes(searchTermLower) ||
      (inquiry.message || '').toLowerCase().includes(searchTermLower)
    );

    // Apply inquiry date filter if selected
    let matchesInquiryDate = true;
    if (filterOptions.inquiryDate !== 'all') {
      const inquiryDate = new Date(inquiry.createdAt);
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      switch (filterOptions.inquiryDate) {
        case 'today':
          matchesInquiryDate = inquiryDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesInquiryDate = inquiryDate.toDateString() === yesterday.toDateString();
          break;
        case 'lastWeek':
          matchesInquiryDate = inquiryDate >= lastWeek && inquiryDate <= today;
          break;
        case 'lastMonth':
          matchesInquiryDate = inquiryDate >= lastMonth && inquiryDate <= today;
          break;
        default:
          matchesInquiryDate = true;
      }
    }

    // Apply event type filter if selected
    const matchesEventType = filterOptions.eventType === 'all' || 
      inquiry.eventType === filterOptions.eventType;

    // Apply venue name filter if selected
    const matchesVenue = filterOptions.venueName === 'all' || 
      inquiry.venue?.name === filterOptions.venueName;

    return matchesSearchTerm && matchesInquiryDate && matchesEventType && matchesVenue;
  });

  // Get unique venue names for the filter dropdown
  const venueNames = [...new Set(inquiries
    .map(inquiry => inquiry.venue?.name)
    .filter(Boolean))];

  // Get unique event types for the filter dropdown
  const eventTypes = [...new Set(inquiries
    .map(inquiry => inquiry.eventType)
    .filter(Boolean))];

  // Format date for display
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
  const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

   // Reset current page when filters change
   useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterOptions]);

  
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
        <h1 className="text-2xl font-bold">Inquiry Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredInquiries.length} {filteredInquiries.length === 1 ? 'Inquiry' : 'Inquiries'} Found
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Date</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.inquiryDate}
                onChange={(e) => setFilterOptions({...filterOptions, inquiryDate: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
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
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.venueName}
                onChange={(e) => setFilterOptions({...filterOptions, venueName: e.target.value})}
              >
                <option value="all">All Venues</option>
                {venueNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Table View (Hidden on small screens) */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="bg-orange-600 text-orange-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Venue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Inquiry Date</th>
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((inquiry) => (
                  <tr 
                    key={inquiry._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openMessageModal(inquiry)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inquiry.venue?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center">
                          <MdLocationOn className="h-3 w-3 mr-1" />
                          {inquiry.venue?.city || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MdPerson className="h-4 w-4 mr-1" />
                        {inquiry.user?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">{inquiry.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inquiry.eventType || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MdCalendarToday className="h-4 w-4 mr-1" />
                        {formatDate(inquiry.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {formatDate(inquiry.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card View (Visible on small screens) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {currentItems.map((inquiry) => (
              <div 
                key={inquiry._id}
                onClick={() => openMessageModal(inquiry)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{inquiry.venue?.name || 'N/A'}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MdLocationOn className="h-4 w-4 mr-1" />
                        {inquiry.venue?.city || 'N/A'}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {inquiry.eventType || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdPerson className="h-4 w-4 mr-1" />
                          <span className="font-medium">User:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">{inquiry.user?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500 ml-5">{inquiry.user?.email || 'N/A'}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdCalendarToday className="h-4 w-4 mr-1" />
                          <span className="font-medium">Event Date:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">{formatDate(inquiry.date)}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdAccessTime className="h-4 w-4 mr-1" />
                          <span className="font-medium">Inquiry Date:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">{formatDate(inquiry.createdAt)}</div>
                        <div className="text-xs text-gray-500 ml-5">
                          {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-700 mb-1">
                          <MdMessage className="h-4 w-4 mr-1" />
                          <span className="font-medium">Message:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5 truncate">
                          {inquiry.message || 'No message'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        </>
      )}

      {/* Message Modal */}
      {modalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Inquiry Details</h2>
              <button 
                onClick={closeModal}
                className="text-orange-800 hover:text-orange-700 focus:outline-none"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-1">Venue Information</h3>
                <p className="text-base font-medium text-gray-900">{selectedInquiry.venue?.name || 'N/A'}</p>
                <p className="text-sm text-gray-600">{selectedInquiry.venue?.city || 'N/A'}, {selectedInquiry.venue?.address || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-1">User Information</h3>
                <p className="text-base font-medium text-gray-900">{selectedInquiry.user?.name || 'N/A'}</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <MdEmail className="h-4 w-4 mr-1" />
                  {selectedInquiry.user?.email || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <MdPerson className="h-4 w-4 mr-1" />
                  {selectedInquiry.user?.phone || 'N/A'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-1">Event Information</h3>
                <p className="text-base font-medium text-gray-900">{selectedInquiry.eventType || 'N/A'}</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <MdCalendarToday className="h-4 w-4 mr-1" />
                  Event Date: {formatDate(selectedInquiry.date)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-1">Inquiry Date</h3>
                <p className="text-base font-medium text-gray-900">{formatDate(selectedInquiry.createdAt)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedInquiry.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-orange-600 mb-2">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-orange-600 text-gray-200 font-semibold transition-colors rounded-md hover:bg-orange-700 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
