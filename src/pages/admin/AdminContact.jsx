import React, { useState, useEffect } from 'react';
import { MdEmail, MdPhone, MdDelete, MdReply, MdMessage, MdClose } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminContact = ({ searchTerm = '' }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [processingEmail, setProcessingEmail] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    contactDate: 'all'
  });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/contact/fetch`
      );

      if (response.data.success) {
        setContacts(response.data.contacts);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(error.response?.data?.message || 'Failed to fetch contacts');
      toast.error(error.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailReply = async (contact) => {
    if (processingEmail) return;

    setProcessingEmail(true);
    try {
      // Prepare default subject and message
      const subject = `Re: Contact from ${contact.fullname}`;
      const message = `Dear ${contact.fullname},\n\nThank you for contacting us regarding:\n\n"${contact.message}"\n\n`;

      // Create mailto URL directly
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(message);
      const mailtoUrl = `mailto:${contact.email}?subject=${encodedSubject}&body=${encodedBody}`;

      // Open default mail client
      window.open(mailtoUrl, '_blank');
    } catch (error) {
      console.error('Error opening email client:', error);
      toast.error('Failed to open email client');
    } finally {
      setProcessingEmail(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/contact/delete/${contactId}`
      );

      if (response.data.success) {
        toast.success('Contact deleted successfully');
        fetchContacts(); // Refresh the contacts list
      } else {
        toast.error(response.data.message || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error(error.response?.data?.message || 'Failed to delete contact');
    } finally {
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const openDeleteModal = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const openMessageModal = (contact) => {
    setSelectedMessage({
      message: contact.message,
      fullname: contact.fullname,
      email: contact.email,
      date: formatDate(contact.createdAt)
    });
    setShowMessageModal(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      (contact.fullname || '').toLowerCase().includes(searchTermLower) ||
      (contact.email || '').toLowerCase().includes(searchTermLower) ||
      (contact.mobile || '').toString().includes(searchTermLower) ||
      (contact.message || '').toLowerCase().includes(searchTermLower)
    );

    // Apply contact date filter if selected
    let matchesContactDate = true;
    if (filterOptions.contactDate !== 'all') {
      const contactDate = new Date(contact.createdAt);
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      switch (filterOptions.contactDate) {
        case 'today':
          matchesContactDate = contactDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesContactDate = contactDate.toDateString() === yesterday.toDateString();
          break;
        case 'lastWeek':
          matchesContactDate = contactDate >= lastWeek && contactDate <= today;
          break;
        case 'lastMonth':
          matchesContactDate = contactDate >= lastMonth && contactDate <= today;
          break;
        default:
          matchesContactDate = true;
      }
    }

    return matchesSearchTerm && matchesContactDate;
  });

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
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
      <div className="p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contact Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {filteredContacts.length} {filteredContacts.length === 1 ? 'Contact' : 'Contacts'} Found
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
          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Date</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                value={filterOptions.contactDate}
                onChange={(e) => setFilterOptions({ ...filterOptions, contactDate: e.target.value })}
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-50 ">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{contact.fullname}</div>
                  {contact.user && (
                    <div className="text-xs text-gray-500">
                      Registered User
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <MdEmail className="h-4 w-4 mr-1 text-orange-600" />
                      <span className=" px-2 py-1 rounded">{contact.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-900">
                      <MdPhone className="h-4 w-4 mr-1 text-orange-600" />
                      <span className=" px-2 py-1 rounded">{contact.mobile}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className="flex items-center  hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                    onClick={() => openMessageModal(contact)}
                  >
                    <MdMessage className="h-4 w-4 mr-1 mt-1 text-orange-600" />
                    <div className="text-sm text-gray-900 max-w-xs truncate px-3 py-2 rounded"
                    >
                      {contact.message.length > 30
                        ? `${contact.message.substring(0, 30)}... `
                        : contact.message}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700  rounded mx-2">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEmailReply(contact)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                      title="Reply via Email"
                      disabled={processingEmail}
                    >
                      <MdReply className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(contact)}
                      className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                      title="Delete Contact"
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

      {/* Card View (Visible on small screens) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentItems.map((contact) => (
          <div
            key={contact._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{contact.fullname}</h3>
                  {contact.user && (
                    <div className="text-xs text-gray-500">
                      Registered User
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(contact.createdAt)}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <MdEmail className="h-4 w-4 mr-1 text-orange-600" />
                      <span className="font-medium">Email:</span>
                    </div>
                    <div className="text-sm text-gray-900 ml-5">{contact.email}</div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <MdPhone className="h-4 w-4 mr-1 text-orange-600" />
                      <span className="font-medium">Phone:</span>
                    </div>
                    <div className="text-sm text-gray-900 ml-5">{contact.mobile}</div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <MdMessage className="h-4 w-4 mr-1 text-orange-600" />
                      <span className="font-medium">Message:</span>
                    </div>
                    <div
                      className="text-sm text-gray-900 ml-5 cursor-pointer hover:text-orange-600"
                      onClick={() => openMessageModal(contact)}
                    >
                      {contact.message.length > 30
                        ? `${contact.message.substring(0, 30)}...`
                        : contact.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEmailReply(contact)}
                  className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                  title="Reply via Email"
                  disabled={processingEmail}
                >
                  <MdReply className="h-5 w-5" />
                </button>
                <button
                  onClick={() => openDeleteModal(contact)}
                  className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                  title="Delete Contact"
                >
                  <MdDelete className="h-5 w-5" />
                </button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contactToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete the contact from {contactToDelete.fullname}?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteContact(contactToDelete._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center"
              >
                <MdDelete className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Message Details</h3>
                <p className="text-sm opacity-90">{selectedMessage.date}</p>
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
                  <div>{selectedMessage.fullname}</div>
                </div>
                <div className="mb-3">
                  <div className="font-medium text-gray-900 mb-1">Message:</div>
                  <p className="text-gray-700 border-l-4 border-orange-300 pl-3 py-2 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
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
                    const contact = {
                      fullname: selectedMessage.fullname,
                      email: selectedMessage.email,
                      message: selectedMessage.message
                    };
                    handleEmailReply(contact);
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

export default AdminContact;
