import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../hooks/auth';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { getRedirectPath } from '../utils/roleUtils.jsx';

const Loginpage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { userLogined, userRole, FetchSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false)

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Configure axios to include credentials in all requests
  axios.defaults.withCredentials = true;

  // Redirect if already logged in
  useEffect(() => {
    if (userLogined) {
      const redirectPath = getRedirectPath(userRole);
      navigate(redirectPath, { replace: true });
    }
  }, [userLogined, userRole, navigate]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // Get the role from the response
        const role = response.data.role;

        // Manually update auth context through FetchSession
        await FetchSession();

        // Navigate based on role from response
        const redirectPath = getRedirectPath(role);
        navigate(redirectPath, { replace: true });
      } else {
        toast.error("Something went wrong, Please try again later!");
      }
    } catch (error) {
      // Only show specific error messages from the server if available
      toast.error(error.response.data.message);

    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 animate-gradient-x shadow-xl">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-96 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-900">Log in to <span className='text-orange-600'>VenueServ</span></h2>
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
                placeholder="Email address / Mobile no."
                className="w-full bg-transparent text-gray-800 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border rounded-md px-3 py-2 shadow-md bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                required
                placeholder="Password"
                className="w-full bg-transparent text-gray-800 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="text-gray-400 pr-1" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <FaEyeSlash className="text-gray-600 h-5 w-5" />
                ) : (
                  <FaEye className="text-gray-600 h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <Link to={'/forgot-password'} className="text-sm text-blue-600 transition-all hover:underline">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            className={`w-full font-semibold text-white py-2 px-4 rounded-md transition duration-300 shadow-lg ${isLoading ? 'bg-orange-400' : 'bg-orange-950 hover:bg-orange-900 '}`}
            disabled={isLoading}
          >
            Log in
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Don't have an account?
          <Link to="/signup" className="text-blue-600 hover:underline ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;