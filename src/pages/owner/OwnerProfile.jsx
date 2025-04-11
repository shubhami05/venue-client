import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getConnectAccountStatus, createAccountLink, createConnectAccount } from '../../services/stripe.service';
import { useAuth } from '../../hooks/auth';
import { FaStripe, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const OwnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [accountStatus, setAccountStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Store user information in localStorage for Stripe Connect
    if (user) {
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userName', user.fullname || '');
    }
    
    checkAccountStatus();
    
    // Check if we're returning from Stripe onboarding
    const params = new URLSearchParams(location.search);
    const returned = params.get('returned');
    
    if (returned === 'true') {
      toast.success('Stripe account setup completed!');
      checkAccountStatus();
    }
  }, [user, location]);

  const checkAccountStatus = async () => {
    try {
      setLoading(true);
      const response = await getConnectAccountStatus();
      setAccountStatus(response.account);
    } catch (err) {
      if (err.message.includes('not found')) {
        setAccountStatus(null);
      } else {
        setError(err.message);
        toast.error('Failed to fetch Stripe account status');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      setLoading(true);
      
      if (!accountStatus) {
        const response = await createConnectAccount();
        if (response.success && response.accountLink) {
          window.location.href = response.accountLink;
          return;
        }
      } else {
        const response = await createAccountLink();
        if (response.success && response.accountLink) {
          window.location.href = response.accountLink;
          return;
        }
      }
      
      toast.error('Failed to get Stripe account link');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to connect Stripe account');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = () => {
    checkAccountStatus();
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 4) {
      toast.error('New password must be at least 4 characters long!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      );

      if (response.data.success) {
        toast.success('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Owner Profile</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 rounded-md relative">
         
          <button
            className={`py-2 px-4 font-medium text-base rounded-md transition-all  duration-300 flex-1 ${
              activeTab === 'profile'
                ? 'text-white bg-orange-600 shadow-md'
                : 'text-gray-500 bg-white hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`py-2 px-4 font-medium text-base rounded-md transition-all  duration-300 flex-1 ${
              activeTab === 'payment'
                ? ' text-white bg-orange-600 shadow-md'
                : 'text-gray-500 bg-white hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('payment')}   
          >
            Payment Settings
          </button>
        </div>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{user?.fullname || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{user?.mobile || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
              </div>
              
              <form onSubmit={handleSubmitPasswordChange} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Password must be at least 4 characters long</p>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-md transition-all duration-200 ${
                      isSubmitting 
                        ? 'bg-orange-400 cursor-not-allowed' 
                        : 'bg-orange-600 hover:bg-orange-700 transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <FaStripe className="text-primary text-3xl mr-3" />
                <h2 className="text-xl font-semibold">Connect Your Stripe Account</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                To receive payments for your venues, you need to connect your Stripe account. 
                This allows us to transfer payments directly to your bank account.
              </p>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaSpinner className="animate-spin text-primary text-3xl mb-4" />
                  <p className="text-gray-600">Loading payment information...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                  <button 
                    onClick={handleRefreshStatus}
                    className="mt-2 text-sm text-red-700 underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {accountStatus ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-medium">Account Status</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                            accountStatus.chargesEnabled ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-primary/10 border border-primary/20 text-primary'
                          }`}>
                            {accountStatus.chargesEnabled ? (
                              <>
                                <FaCheckCircle className="mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <FaExclamationTriangle className="mr-1" />
                                Pending
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <p className="text-sm text-gray-600">Account ID</p>
                            <p className="text-sm font-mono">{accountStatus.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Payments Enabled</p>
                            <p className="text-sm">{accountStatus.chargesEnabled ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Payouts Enabled</p>
                            <p className="text-sm">{accountStatus.payoutsEnabled ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Details Submitted</p>
                            <p className="text-sm">{accountStatus.detailsSubmitted ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {!accountStatus.chargesEnabled && (
                        <div className="p-6 bg-primary/5 border border-primary/10 text-primary rounded-md">
                          <p className="font-medium">Action Required</p>
                          <p>Your Stripe account is not fully set up. Please complete the onboarding process to receive payments.</p>
                          <div className="flex space-x-4 mt-4">
                            <button
                              onClick={handleConnectStripe}
                              disabled={loading}
                              className="py-2 px-4 rounded-md text-white font-medium bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {loading ? 'Loading...' : 'Complete Setup'}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {accountStatus.chargesEnabled && (
                        <div className="p-6 bg-green-50 border border-green-200 text-green-700 rounded-md">
                          <p className="font-medium">Account Ready</p>
                          <p>Your Stripe account is fully set up and ready to receive payments.</p>
                          <div className="flex space-x-4 mt-4">
                            <button
                              onClick={handleConnectStripe}
                              disabled={loading}
                              className="py-2 px-4 rounded-md text-white font-medium bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {loading ? 'Loading...' : 'Update Account Settings'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-primary/5 border border-primary/10 text-primary rounded-md">
                      <p className="font-medium">No Stripe Account</p>
                      <p>You haven't set up a Stripe account yet. Connect your account to receive payments for your venues.</p>
                      <div className="flex space-x-4 mt-4">
                        <button
                          onClick={handleConnectStripe}
                          disabled={loading}
                          className="py-2 px-4 rounded-md text-white font-medium bg-orange-600 transition-all hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Loading...' : 'Connect Stripe Account'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* How It Works Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Connect Your Account</h3>
                    <p className="text-gray-600">
                      Link your Stripe account to receive payments directly. If you don't have a Stripe account, you can 
                      <a 
                        href="https://dashboard.stripe.com/register" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 underline ml-1"
                      >
                        Register for Stripe
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Complete Verification</h3>
                    <p className="text-gray-600">Provide your business details and bank account information.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Receive Payments</h3>
                    <p className="text-gray-600">Get paid automatically when customers book your venues.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerProfile;
