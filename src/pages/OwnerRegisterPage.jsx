import React, { useState } from 'react'
import img1 from '../assets/Contact_img.png'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/auth';
import { MdPhone } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
const OwnerRegisterPage = () => {
  const { user, userLogined } = useAuth();
  const [aadharCard, setAadharCard] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setAadharCard(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLogined) {
      toast.error('Please login to register as a venue owner');
      return;
    }
    if (!aadharCard) {
      toast.error('Please upload your Aadhar card');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('aadharCard', aadharCard);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/user/register-for-owner`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
          transformRequest: [(data) => data]
        }
      );

      if (response.data.success) {
        toast.success('Registration request submitted successfully!');
        // Reset form
        setAadharCard(null);
        setAgreementChecked(false);
        navigate('/');
        // Reset file input
        const fileInput = document.getElementById('aadharCard');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(response.data.message || 'Failed to submit registration request');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit registration request');
    } finally {
      setLoading(false);
    }
  };

  if (!userLogined) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-900'>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Login First</h2>
          <p className="text-gray-400">You need to be logged in to register as a venue owner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex lg:flex-row flex-col justify-center items-center min-h-screen lg:py-0 py-10 my-20 mx-auto container gap-0 bg-gray-900'>
      <div className='flex-col animate-fade-in overflow-visible p-10 bg-gray-800/20 w-full rounded-xl shadow-md max-w-xl'>
        <h1 className='text-4xl font-bold text-white mb-2'>Owner Registration</h1>
        <p className='text-gray-400 mb-6'>Upload your Aadhar card to register as a venue owner</p>
        
        <div className="bg-gray-800/30 p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold text-white mb-4">Your Details</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">{user.fullname}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-gray-300">{user.email}</span>
            </div>
            <div className="flex items-center">
              <MdPhone className='text-gray-400 mr-2 h-5 w-5'/>
              <span className="text-gray-300">{user.mobile}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <div className="flex items-center border border-gray-800/30 rounded-md px-3 py-2 bg-gray-800/30 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <input
                type="file"
                id="aadharCard"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full bg-transparent text-gray-100 outline-none"
                required
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">Upload your Aadhar card (PDF only, Max size: 5MB)</p>
          </div>

          <div className="bg-gray-800/30 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Rules and Regulations:</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>You must be at least 18 years old to register as a venue owner.</li>
              <li>The Aadhar card must be valid and not expired.</li>
              <li>You are responsible for maintaining accurate venue information.</li>
              <li>All venue listings must comply with local laws and regulations.</li>
              <li>You must respond to booking inquiries within 24 hours.</li>
              <li>Venue photos must be recent and accurately represent the space.</li>
              <li>Pricing must be transparent and include all applicable charges.</li>
              <li>You must maintain proper hygiene and safety standards.</li>
              <li>Any changes to venue details must be updated promptly.</li>
              <li>You agree to cooperate with platform audits and verifications.</li>
            </ul>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="agreement"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="w-4 h-4 text-orange-600 border-gray-600 rounded focus:ring-orange-500 bg-gray-700"
                required
              />
            </div>
            <div className="ml-3">
              <label htmlFor="agreement" className="text-sm text-gray-300">
                I agree to the rules and regulations and confirm that all information provided is accurate.
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-semibold text-white py-2 px-4 rounded-md transition duration-300 shadow-md ${
              isLoading || !agreementChecked || !aadharCard
                ? 'bg-orange-600/20 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
            disabled={isLoading || !agreementChecked || !aadharCard}
          >
            {isLoading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OwnerRegisterPage
