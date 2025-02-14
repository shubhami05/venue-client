import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState('');

  const handleSubmit = async(e)=>{
    e.preventDefault();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 animate-gradient-x">
    <div className="bg-gray-100 p-8 rounded-lg shadow-md w-96 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-900">Forgot Password <span className='text-orange-600'>VenueServ</span></h2>
        <button className="text-gray-500 hover:text-gray-700" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent text-slate-800 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full font-semibold bg-orange-950 text-white py-2 px-4 rounded-md hover:bg-orange-900 transition duration-300"
        >
          Send Reset Link
        </button>
      </form>
      <p className="text-center mt-8 text-sm text-gray-600">
        Remember your password?
        <Link to="/login" className="text-blue-600 hover:underline ml-1">Back to Login</Link>
      </p>
    </div>
  </div>
  )
}

export default ForgotPassword
