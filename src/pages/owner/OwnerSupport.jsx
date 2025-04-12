import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OwnerSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/support`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        toast.success('Your support request has been submitted successfully!');
        navigate('/owner');
      } else {
        toast.error(response.data.message || 'Failed to submit support request');
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-inherit text-orange-900 p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Contact Support</h2>
          <p className="text-orange-900 mt-1 text-sm sm:text-base">Get help with your venue management</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-orange-900 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter the subject of your support request"
                  className="w-full bg-white px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-orange-900 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Describe your issue or question in detail"
                  className="w-full px-4 bg-white py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base custom-scrollbar"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/owner')}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                >
                  Back to Dashboard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #fff5f5;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #fb923c;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ea580c;
          }
        `}</style>
      </div>
    </div>
  );
};

export default OwnerSupport;
