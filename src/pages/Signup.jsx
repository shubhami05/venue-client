import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaFolder, FaInfo, FaMailBulk, FaMailchimp, FaMobileAlt, FaPhone, FaPhoneAlt, FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import axios from 'axios';

const Signuppage = () => {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateMobile = (number) => {
    // Remove any non-digit characters
    const cleanedNumber = number.replace(/\D/g, '');
    
    // Check if the number is empty
    if (!cleanedNumber) {
      setMobileError('Mobile number is required');
      return false;
    }
    
    // Check if the number starts with a valid prefix (6-9)
    if (!/^[6-9]/.test(cleanedNumber)) {
      setMobileError('Mobile number should start with 6-9');
      return false;
    }
    
    // Check if the number has exactly 10 digits
    if (cleanedNumber.length !== 10) {
      setMobileError('Mobile number should be 10 digits');
      return false;
    }
    
    setMobileError('');
    return true;
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    setMobile(cleanedValue);
    validateMobile(cleanedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile number before submission
    if (!validateMobile(mobile)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/auth/signup`, { 
        fullname, 
        email, 
        mobile, 
        password 
      }, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      }
      else {
        toast.error("Something went wrong, Please try again later!");
      }
    }
    catch (error) {
      // Only show specific error messages from the server if available
      // Network errors are handled by axios interceptor
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
    finally {
      setIsLoading(false)
    }
  };

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-zinc-900 via-zinc-800 to-zinc-900 animate-gradient-x">
      <div className="bg-zinc-100 p-8 rounded-lg shadow-md w-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-900 mr-5">Get started with <span className='text-orange-600'>VenueServ</span></h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center border rounded-md px-3 py-2 shadow-md bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                required
                placeholder="Full name"
                className="w-full bg-transparent text-gray-800 outline-none"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center border rounded-md px-3 py-2 shadow-md bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full bg-transparent text-gray-800 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center border rounded-md px-3 py-2 shadow-md bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className='h-4 w-5 fill-gray-400 mr-2' viewBox="0 0 512 512">
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
              <input
                type="tel"
                required
                placeholder="Mobile number"
                className={`w-full bg-transparent text-gray-800 outline-none hide-number-controls ${mobileError ? 'border-red-500' : ''}`}
                value={mobile}
                onChange={handleMobileChange}
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                title="Please enter a valid 10-digit mobile number starting with 6-9"
              />
            </div>
            {mobileError && (
              <p className="text-red-500 text-sm mt-1">{mobileError}</p>
            )}
          </div>
          <div className="mb-6">
            <div className="flex items-center border rounded-md px-3 py-2 shadow-md bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type={isPasswordVisible ? 'text' : 'password'} // Toggle input type
                placeholder="Password"
                className="w-full bg-transparent text-gray-800 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="text-gray-400 shadow-lg pr-1" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <FaEyeSlash className="text-gray-600 h-5 w-5" /> // Eye with slash icon for hidden password
                ) : (
                  <FaEye className="text-gray-600 h-5 w-5" /> // Regular eye icon for visible password
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full font-semibold bg-orange-950 text-white py-2 px-4 rounded-md hover:bg-orange-900 transition duration-300"
          >
            Sign up
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Already have an account?
          <Link to="/login" className="text-blue-600 hover:underline ml-1">Login now</Link>
        </p>
      </div>
    </div>
  );
}

export default Signuppage;
