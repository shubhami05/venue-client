import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Create a payment intent for a booking
export const createPaymentIntent = async (bookingId, amount) => {
  try {
    const response = await axios.post('/api/stripe/create-payment-intent', {
      bookingId,
      amount
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payment intent');
  }
};

// Create a Connect account for venue owners
export const createConnectAccount = async () => {
  try {
    const response = await axios.post('/api/stripe/connect/create', {
      email: localStorage.getItem('userEmail') || '',
      name: localStorage.getItem('userName') || ''
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create Connect account');
  }
};

// Get Connect account status
export const getConnectAccountStatus = async () => {
  try {
    const response = await axios.get('/api/stripe/connect-account-status');
    return response.data;
  } catch (error) {
    // If the error is due to no Stripe account, return null instead of throwing
    if (error.response?.status === 404) {
      return { success: true, account: null };
    }
    throw new Error(error.response?.data?.message || 'Failed to get Connect account status');
  }
};

// Create a new account link for existing Connect accounts
export const createAccountLink = async () => {
  try {
    const response = await axios.post('/api/stripe/create-account-link');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create account link');
  }
};

// Handle payment confirmation
export const confirmPayment = async (paymentIntentId) => {
  try {
    const stripe = await stripePromise;
    const { error } = await stripe.confirmCardPayment(paymentIntentId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    throw new Error(error.message || 'Payment confirmation failed');
  }
};

// Redirect to Stripe Connect onboarding
export const redirectToConnectOnboarding = async () => {
  try {
    const response = await createConnectAccount();
    window.location.href = response.accountLink;
  } catch (error) {
    throw new Error(error.message || 'Failed to redirect to Connect onboarding');
  }
}; 