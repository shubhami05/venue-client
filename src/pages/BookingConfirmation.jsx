import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookingConfirmation = () => {
  const { paymentIntentId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BACKEND_URI}/api/user/booking/confirm`,
          { paymentIntentId }
        );

        if (response.data.success) {
          setStatus('success');
          setBooking(response.data.booking);
          toast.success('Payment successful! Your booking is confirmed.');
          navigate('/bookings');
        } else {
          setStatus('error');
          toast.error(response.data.message || 'Payment failed');
        }
      } catch (error) {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Failed to confirm payment');
      }
    };

    confirmPayment();
  }, [paymentIntentId]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <FaSpinner className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-lg text-gray-600">Confirming your payment...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <FaCheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-lg text-gray-600">Your booking has been confirmed.</p>
            {booking && (
              <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time Slot:</span>{' '}
                    {booking.timeslot === 0 ? 'Morning' : booking.timeslot === 1 ? 'Evening' : 'Full Day'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Number of Guests:</span>{' '}
                    {booking.numberOfGuest}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Amount Paid:</span>{' '}
                    ₹{booking.amount}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate('/bookings')}
              className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <FaTimesCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-lg text-gray-600">There was an error processing your payment.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default BookingConfirmation; 