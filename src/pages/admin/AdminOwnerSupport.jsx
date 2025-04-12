import React, { useState, useEffect } from 'react';
import { MdEmail, MdPhone, MdDelete, MdReply, MdMessage, MdCheck, MdClose } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { format } from 'date-fns';

const AdminOwnerSupport = ({ searchTerm = '' }) => {
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [processingEmail, setProcessingEmail] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        status: 'all',
        date: 'all'
    });
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);

    useEffect(() => {
        fetchSupportRequests();
    }, []);

    const fetchSupportRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/owner/support`
            );

            if (response.data.success) {
                setSupportRequests(response.data.supportRequests);
            } else {
                setError(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching support requests:', error);
            setError(error.response?.data?.message || 'Failed to fetch support requests');
            toast.error(error.response?.data?.message || 'Failed to fetch support requests');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailReply = async (request) => {
        if (processingEmail) return;

        setProcessingEmail(true);
        try {
            const subject = `Re: Support Request - ${request.subject}`;
            const message = `Dear ${request.owner.name},\n\nThank you for your support request regarding:\n\n"${request.message}"\n\n`;

            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(message);
            const mailtoUrl = `mailto:${request.owner.email}?subject=${encodedSubject}&body=${encodedBody}`;

            window.open(mailtoUrl, '_blank');
            toast.success('Email app opened with support request details');
        } catch (error) {
            console.error('Error opening email client:', error);
            toast.error('Failed to open email client');
        } finally {
            setProcessingEmail(false);
        }
    };

    const handleDeleteRequest = async (requestId) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/owner/support/${requestId}`
            );

            if (response.data.success) {
                toast.success('Support request deleted successfully');
                fetchSupportRequests();
            } else {
                toast.error(response.data.message || 'Failed to delete support request');
            }
        } catch (error) {
            console.error('Error deleting support request:', error);
            toast.error(error.response?.data?.message || 'Failed to delete support request');
        } finally {
            setShowDeleteModal(false);
            setRequestToDelete(null);
        }
    };

    const openMessageModal = (request) => {
        setSelectedMessage({
            subject: request.subject,
            message: request.message,
            owner: request.owner,
            status: request.status,
            createdAt: formatDate(request.createdAt),
            resolvedAt: request.resolvedAt ? formatDate(request.resolvedAt) : null,
            response: request.response
        });
        setShowMessageModal(true);
    };

    const handleStatusChange = async (requestId, status) => {
        try {
            const newStatus = status === 'pending' ? 'resolved' : 'pending';
            const response = await axios.put(
                `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/owner/support/${requestId}`,
                { newStatus }
            );

            if (response.data.success) {
                toast.success(`Support request marked as ${newStatus}`);
                fetchSupportRequests();
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const filteredRequests = supportRequests.filter(request => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearchTerm = (
            (request.owner.name || '').toLowerCase().includes(searchTermLower) ||
            (request.owner.email || '').toLowerCase().includes(searchTermLower) ||
            (request.owner.phone || '').toString().includes(searchTermLower) ||
            (request.subject || '').toLowerCase().includes(searchTermLower) ||
            (request.message || '').toLowerCase().includes(searchTermLower)
        );

        let matchesStatus = true;
        if (filterOptions.status !== 'all') {
            matchesStatus = request.status === filterOptions.status;
        }

        let matchesDate = true;
        if (filterOptions.date !== 'all') {
            const requestDate = new Date(request.createdAt);
            const now = new Date();
            const today = new Date(now.setHours(0, 0, 0, 0));

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);

            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            switch (filterOptions.date) {
                case 'today':
                    matchesDate = requestDate.toDateString() === today.toDateString();
                    break;
                case 'yesterday':
                    matchesDate = requestDate.toDateString() === yesterday.toDateString();
                    break;
                case 'lastWeek':
                    matchesDate = requestDate >= lastWeek && requestDate <= today;
                    break;
                case 'lastMonth':
                    matchesDate = requestDate >= lastMonth && requestDate <= today;
                    break;
                default:
                    matchesDate = true;
            }
        }

        return matchesSearchTerm && matchesStatus && matchesDate;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-4 flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Owner Support Requests</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h5 className="text-lg font-semibold text-gray-900">
                        {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'} Found
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                                value={filterOptions.status}
                                onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <select
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                                value={filterOptions.date}
                                onChange={(e) => setFilterOptions({ ...filterOptions, date: e.target.value })}
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && requestToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto">
                        <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Confirm Deletion</h3>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setRequestToDelete(null);
                                }}
                                className="text-white bg-inherit hover:text-orange-200 text-3xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to delete this support request? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setRequestToDelete(null);
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteRequest(requestToDelete)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table View (Hidden on small screens) */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr className="bg-orange-600 text-orange-50">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>

                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => (
                                <tr key={request._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openMessageModal(request)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{request.owner.name}</div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MdEmail className="h-4 w-4 mr-1 text-orange-600" />
                                            <span>{request.owner.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MdPhone className="h-4 w-4 mr-1 text-orange-600" />
                                            <span>{request.owner.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{request.subject}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'resolved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                }`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {formatDate(request.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(request._id, request.status);
                                                }}
                                                className={`p-2 rounded-full ${request.status === 'resolved'
                                                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                                    }`}
                                                title={request.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                                            >
                                                {request.status === 'resolved' ? (
                                                    <MdClose className="h-5 w-5" />
                                                ) : (
                                                    <MdCheck className="h-5 w-5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEmailReply(request);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                                                title="Reply via Email"
                                                disabled={processingEmail}
                                            >
                                                <MdReply className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRequestToDelete(request._id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                                                title="Delete Request"
                                            >
                                                <MdDelete className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No support requests found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Card View (Visible on small screens) */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => openMessageModal(request)}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{request.owner.name}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MdEmail className="h-4 w-4 mr-1 text-orange-600" />
                                            <span>{request.owner.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MdPhone className="h-4 w-4 mr-1 text-orange-600" />
                                            <span>{request.owner.phone}</span>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'resolved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                            }`}
                                    >
                                        {request.status}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <div className="flex items-center text-sm text-gray-700 mb-1">
                                                <span className="font-medium">Subject:</span>
                                            </div>
                                            <div className="text-sm text-gray-900">{request.subject}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center text-sm text-gray-700 mb-1">
                                                <MdMessage className="h-4 w-4 mr-1 text-orange-600" />
                                                <span className="font-medium">Message:</span>
                                            </div>
                                            <div className="text-sm text-gray-900">
                                                {request.message.length > 100
                                                    ? `${request.message.substring(0, 100)}...`
                                                    : request.message}
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {formatDate(request.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(request._id, request.status);
                                        }}
                                        className={`p-2 rounded-full ${request.status === 'resolved'
                                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                            }`}
                                        title={request.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                                    >
                                        {request.status === 'resolved' ? (
                                            <MdClose className="h-5 w-5" />
                                        ) : (
                                            <MdCheck className="h-5 w-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEmailReply(request);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                                        title="Reply via Email"
                                        disabled={processingEmail}
                                    >
                                        <MdReply className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setRequestToDelete(request._id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                                        title="Delete Request"
                                    >
                                        <MdDelete className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No support requests found
                    </div>
                )}
            </div>

            {/* Message Modal */}
            {showMessageModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Support Request Details</h3>
                                <p className="text-sm opacity-90">{selectedMessage.createdAt}</p>
                            </div>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="text-white bg-inherit hover:text-orange-200 text-3xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-orange-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-3">
                                    <div className="font-medium text-gray-900 mr-2">From:</div>
                                    <div>{selectedMessage.owner.name}</div>
                                </div>
                                <div className="mb-3">
                                    <div className="font-medium text-gray-900 mb-1">Subject:</div>
                                    <p className="text-gray-700">{selectedMessage.subject}</p>
                                </div>
                                <div className="mb-3">
                                    <div className="font-medium text-gray-900 mb-1">Message:</div>
                                    <p className="text-gray-700 border-l-4 border-orange-300 pl-3 py-2 whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                                {selectedMessage.response && (
                                    <div className="mb-3">
                                        <div className="font-medium text-gray-900 mb-1">Response:</div>
                                        <p className="text-gray-700 border-l-4 border-green-300 pl-3 py-2 whitespace-pre-wrap">
                                            {selectedMessage.response}
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <div className="font-medium text-gray-900 mr-2">Status:</div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${selectedMessage.status === 'resolved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                            }`}
                                    >
                                        {selectedMessage.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        const request = {
                                            owner: selectedMessage.owner,
                                            subject: selectedMessage.subject,
                                            message: selectedMessage.message
                                        };
                                        handleEmailReply(request);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <MdReply className="mr-2" />
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOwnerSupport;
