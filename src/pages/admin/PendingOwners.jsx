import React, { useState, useEffect } from 'react';
import { MdPerson, MdCheck, MdClose, MdArrowBack, MdEmail, MdPhone, MdAccessTime, MdBadge } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

const PendingOwners = ({ searchTerm = '' }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  });
  const navigate = useNavigate();

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
    return (
      (application.name || '').toLowerCase().includes(searchTermLower) ||
      (application.email || '').toLowerCase().includes(searchTermLower) ||
      (application.phone || '').toLowerCase().includes(searchTermLower)
    );
  });

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
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <MdArrowBack className="mr-1" />
            Back to Owners
          </button>
          <h1 className="text-2xl font-bold">Pending Owner Applications</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
            {filteredApplications.map((application) => (
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
            ))}
          </tbody>
        </table>
      </div>

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
