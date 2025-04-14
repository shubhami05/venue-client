import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter both passwords');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('Password must be at least 4 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      if (!token) {
        toast.error('Invalid reset link');
        navigate('/forgot-password');
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/auth/reset-password`,
        {  token,  newPassword }
      );
      
      if (response.data.success) {
        toast.success('Password reset successfully');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.message.includes('expired')) {
          navigate('/forgot-password');
        }
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 animate-gradient-x">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-96 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-900">Reset Password <span className='text-orange-600'>VenueServ</span></h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6">Enter your new password below.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                required
                placeholder="New Password"
                className="w-full bg-transparent text-slate-800 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                required
                placeholder="Confirm New Password"
                className="w-full bg-transparent text-slate-800 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full font-semibold text-white py-2 px-4 rounded-md transition duration-300 ${isLoading ? 'bg-orange-400' : 'bg-orange-950 hover:bg-orange-900'}`}
            disabled={isLoading}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 