import React, { useState, useEffect } from 'react';
import { MdEmail, MdPhone, MdDelete, MdReply, MdMessage } from 'react-icons/md';
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
      toast.success('Email app opened with contact details');
    } catch (error) {
      console.error('Error opening email client:', error);
      toast.error('Failed to open email client');
    } finally {
      setProcessingEmail(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

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
    }
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

  // Format date for display
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
                onChange={(e) => setFilterOptions({...filterOptions, contactDate: e.target.value})}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50">
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
                    <div className="flex items-center">
                      <MdMessage className="h-4 w-4 mr-1 mt-1 text-orange-600" />
                      <div className="text-sm text-gray-900 max-w-xs truncate px-3 py-2 rounded">
                        {contact.message.length > 100 
                          ? `${contact.message.substring(0, 100)}...` 
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
                        onClick={() => handleDeleteContact(contact._id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                        title="Delete Contact"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContact;
