import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { FaArrowLeft, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ bookingData, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/booking-confirmation/${bookingData.paymentIntentId}`,
                },
            });

            if (error) {
                setError(error.message || 'Payment failed');
                toast.error(error.message || 'Payment failed');
            }
            // Don't call onSuccess here - it will be handled by the return_url redirect
        } catch (error) {
            console.error('Payment error:', error);
            setError('An error occurred during payment');
            toast.error('An error occurred during payment');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Payment Details</h3>
                <PaymentElement />
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
            <div className="flex justify-between items-center">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
                >
                    <FaArrowLeft className="mr-2" />
                    Back
                </button>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className={`px-6 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center ${(!stripe || isProcessing) && 'opacity-50 cursor-not-allowed'}`}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <FaMoneyBillWave className="mr-2" />
                            Pay Now
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

// Main Payment Checkout Component
const PaymentCheckout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        // Get booking data from location state
        if (location.state?.bookingData) {
            setBookingData(location.state.bookingData);
            console.log(location.state.bookingData);
        } else {
            // If no booking data, redirect back to home
            toast.error('No booking data found');
            navigate('/');
        }
    }, [location.state, navigate]);

    if (!bookingData) {
        return <Loader />;
    }

    const handleSuccess = () => {
        navigate('/bookings');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50  py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-orange-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <FaCalendarCheck className="mr-2" />
                            Complete Your Booking
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        <p className="text-gray-600 mb-6">Please provide your payment details to confirm your booking</p>

                        {/* Booking Summary */}
                        <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                <FaCalendarCheck className="mr-2" />
                                Booking Summary
                            </h3>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <span className="font-medium">Date:</span> {new Date(bookingData.bookingForm.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Time:</span> {bookingData.bookingForm.timeslot}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Guests:</span> {bookingData.bookingForm.numberOfGuest}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Amount:</span> ₹{bookingData.amount}
                                </p>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <Elements stripe={stripePromise} options={{ clientSecret: bookingData.clientSecret }}>
                            <PaymentForm 
                                bookingData={bookingData} 
                                onSuccess={handleSuccess} 
                                onCancel={handleCancel} 
                            />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout; 