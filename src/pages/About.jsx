import React, { useState } from 'react'
import axios from 'axios'

const Aboutpage = () => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  const fetchUser = async (e) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/fetch-session`);
      alert(response.data);
      console.log(response.data);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen bg-slate-300'>
      <button className='bg-slate-800 text-white ' onClick={fetchUser} disabled={loading}>Fetch session</button>
      <div>{user}</div>
    </div>
  )
}

export default Aboutpage
