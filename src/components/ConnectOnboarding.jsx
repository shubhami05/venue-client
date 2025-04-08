import React, { useState, useEffect } from 'react';
import { getConnectAccountStatus, createAccountLink } from '../services/stripe.service';

const ConnectOnboarding = () => {
  const [accountStatus, setAccountStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      const status = await getConnectAccountStatus();
      setAccountStatus(status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueOnboarding = async () => {
    try {
      setLoading(true);
      const { url } = await createAccountLink();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Stripe Connect Setup</h2>
      
      {accountStatus?.detailsSubmitted ? (
        <div className="mb-4">
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            <p className="font-medium">Account Setup Complete</p>
            <p>Your Stripe Connect account is ready to receive payments.</p>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
            <p className="font-medium">Account Setup Required</p>
            <p>Please complete your Stripe Connect account setup to receive payments.</p>
          </div>
          
          <button
            onClick={handleContinueOnboarding}
            disabled={loading}
            className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Loading...' : 'Continue Setup'}
          </button>
        </div>
      )}

      {accountStatus?.chargesEnabled ? (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          <p className="font-medium">Payments Enabled</p>
          <p>Your account is fully set up and ready to accept payments.</p>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
          <p className="font-medium">Payments Pending</p>
          <p>Complete the setup process to enable payments for your venue.</p>
        </div>
      )}
    </div>
  );
};

export default ConnectOnboarding; 