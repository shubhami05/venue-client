/**
 * Test script for CORS configuration
 * 
 * This script tests the CORS configuration by making a simple request to the server.
 * You can run it in the browser console to verify that CORS is working correctly.
 */

import axios from './axiosConfig';

export const testCors = async () => {
  try {
    console.log('Testing CORS configuration...');
    const response = await axios.get('/api/test-cors');
    console.log('CORS test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('CORS test failed:', error);
    throw error;
  }
};

// Export a function to test the session endpoint specifically
export const testSession = async () => {
  try {
    console.log('Testing session endpoint...');
    const response = await axios.get('/api/auth/fetch-session');
    console.log('Session test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Session test failed:', error);
    throw error;
  }
};

// If you want to run this test immediately, uncomment the following line
// testCors().catch(console.error); 