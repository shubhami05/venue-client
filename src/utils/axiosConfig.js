import axios from 'axios';
import toast from 'react-hot-toast';

// Track shown errors to prevent duplicates
const shownErrors = new Set();

// Configure axios to include credentials in all requests
axios.defaults.withCredentials = true;

// Set base URL from environment variable or default to localhost:8000
axios.defaults.baseURL = import.meta.env.VITE_API_BACKEND_URI || 'http://localhost:8000';

// Add request interceptor for common headers
axios.interceptors.request.use(
  (config) => {
    // Add any common headers here (but NOT CORS headers)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Create a unique error key based on status and URL
    const errorKey = `${error.response?.status || 'network'}-${error.config?.url || 'unknown'}`;
    
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Only show the unauthorized message once per endpoint
      if (!shownErrors.has(errorKey)) {
        toast.error('Session expired. Please log in again.');
        shownErrors.add(errorKey);
        
        // Clear the error after 5 seconds to allow it to be shown again if it persists
        setTimeout(() => {
          shownErrors.delete(errorKey);
        }, 5000);
      }
    }
    
    // Handle network errors (like CORS or server down)
    else if (error.message && error.message.includes('Network Error')) {
      if (!shownErrors.has('network-error')) {
        toast.error('Network error - Please check server connection');
        shownErrors.add('network-error');
        
        // Clear the network error after 10 seconds
        setTimeout(() => {
          shownErrors.delete('network-error');
        }, 10000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios; 