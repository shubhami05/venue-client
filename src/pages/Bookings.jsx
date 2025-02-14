
import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/auth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Bookingspage = () => {
  // const [user, setUser] = useState("Not found")
  const { FetchSession, user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const fetchUserId = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await FetchSession();
      if (response) {
        console.log(response.fullname);
        setUser(response);
        return response._id;
      }
      else {
        toast.error("Session not founded, please re-login!")
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    finally {
      setIsLoading(false);
    }
  }



  if (isLoading) {
    return <Loader />
  }
  return (
    <div className='min-h-screen bg-gray-300'>
      <button className='bg-gray-800 p-5 text-white' onClick={FetchSession} disabled={isLoading}>Fetch session</button>
      <div className='text-gray-800'>{user ? user.role : "No data"}</div>
      <div></div>
    </div>
  )
}

export default Bookingspage
