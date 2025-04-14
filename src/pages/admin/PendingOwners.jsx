import React, { useState, useEffect } from 'react';
import { MdPerson, MdCheck, MdClose, MdArrowBack, MdEmail, MdPhone, MdAccessTime, MdBadge, MdLocationOn } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

const PendingOwners = ({ searchTerm = '' }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    submissionDate: 'all',
    city: 'all',
    status: 'all'
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => { }
  });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const fetchPendingOwners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/owner/pending`
      );

      if (response.data.success) {
        setApplications(response.data.applications);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      setError(error.response?.data?.message || 'Failed to fetch pending applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    const application = applications.find(a => a._id === applicationId);
    const action = newStatus === 'accepted' ? 'accept' : 'reject';
    const type = newStatus === 'accepted' ? 'success' : 'danger';
    const title = newStatus === 'accepted' ? 'Accept Application' : 'Reject Application';
    const message = newStatus === 'accepted'
      ? `Are you sure you want to accept the application from "${application.name}"? This will grant them owner privileges.`
      : `Are you sure you want to reject the application from "${application.name}"? This action cannot be undone.`;

    setConfirmationModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await axios.put(
            `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/owner/status/${applicationId}`,
            { status: newStatus }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            fetchPendingOwners(); // Refresh the list
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || `Failed to ${action} application`);
        } finally {
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setLoading(false);
        }
      }
    });
  };

  const filteredApplications = applications.filter(application => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearchTerm = (
      (application.name || '').toLowerCase().includes(searchTermLower) ||
      (application.email || '').toLowerCase().includes(searchTermLower) ||
      (application.phone || '').toLowerCase().includes(searchTermLower) ||
      (application.city || '').toLowerCase().includes(searchTermLower)
    );

    // Apply submission date filter if selected
    let matchesSubmissionDate = true;
    if (filterOptions.submissionDate !== 'all') {
      const submissionDate = new Date(application.submittedAt);
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

    // Apply city filter if selected
    let matchesCity = true;
    if (filterOptions.city !== 'all') {
      matchesCity = application.city.toLowerCase() === filterOptions.city.toLowerCase();
    }

    // Apply status filter if selected
    let matchesStatus = true;
    if (filterOptions.status !== 'all') {
      matchesStatus = application.status.toLowerCase() === filterOptions.status.toLowerCase();
    }

    return matchesSearchTerm && matchesSubmissionDate && matchesCity && matchesStatus;
  });

  // Get unique cities for filter dropdown
  const uniqueCities = [...new Set(applications.map(application => application.city))].filter(Boolean);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
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

  if (error) {
    return (
      <div className="p-4 text-center   text-red-600">
        <button
          onClick={() => navigate('/admin/owners')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <MdArrowBack className="mr-1" />
          Back to Owners
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
            onClick={() => navigate('/admin/owners')}
            className="flex items-center bg-inherit font-semibold text-orange-600 hover:text-orange-900 transition-all "
          >
            <MdArrowBack className="mr-1" />
            Back to Owners
          </button>
          <h1 className="text-2xl font-bold">Pending Owner Applications</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'Application' : 'Applications'} Found
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.submissionDate}
                onChange={(e) => setFilterOptions({ ...filterOptions, submissionDate: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.city}
                onChange={(e) => setFilterOptions({ ...filterOptions, city: e.target.value })}
              >
                <option value="all">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.status}
                onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table View - Hidden on small screens */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-orange-600 text-orange-50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aadhar Card</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((application) => (
                <tr
                  key={application._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MdPerson className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{application.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <MdEmail className="h-4 w-4 mr-1" />
                        {application.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <MdPhone className="h-4 w-4 mr-1" />
                        {application.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={application.adharCard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-orange-600 hover:text-orange-900"
                    >
                      <MdBadge className="h-4 w-4 mr-1" />
                      View Aadhar Card
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MdAccessTime className="h-4 w-4 mr-1" />
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(application._id, 'accepted')}
                        className="text-green-600 hover:text-green-900"
                        title="Accept Application"
                      >
                        <MdCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(application._id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                        title="Reject Application"
                      >
                        <MdClose className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No pending applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View - Visible only on small screens */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentItems.length > 0 ? (
          currentItems.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center">
                      <MdPerson className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MdAccessTime className="h-4 w-4 mr-1" />
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Pending
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <MdEmail className="h-4 w-4 mr-1" />
                        <span className="font-medium">Email:</span>
                      </div>
                      <div className="text-sm text-gray-900 ml-5">{application.email}</div>
                    </div>

                    <div>
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <MdPhone className="h-4 w-4 mr-1" />
                        <span className="font-medium">Phone:</span>
                      </div>
                      <div className="text-sm text-gray-900 ml-5">{application.phone}</div>
                    </div>

                    <div>
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <MdBadge className="h-4 w-4 mr-1" />
                        <span className="font-medium">Aadhar Card:</span>
                      </div>
                      <a
                        href={application.adharCard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 hover:text-orange-900 ml-5"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleStatusChange(application._id, 'accepted')}
                    className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full"
                    title="Accept Application"
                  >
                    <MdCheck className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(application._id, 'rejected')}
                    className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                    title="Reject Application"
                  >
                    <MdClose className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            No pending applications found
          </div>
        )}
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

export default PendingOwners;
