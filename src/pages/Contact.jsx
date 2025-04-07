import React, { useState } from 'react'
import img1 from '../assets/Contact_img.png'
import axios from 'axios'
import toast from 'react-hot-toast'

const Contactpage = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/user/contact`,
        {
          fullname: name,
          email,
          mobile,
          message
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message || 'Message sent successfully!');
        // Clear form fields after successful submission
        setName('');
        setEmail('');
        setMobile('');
        setMessage('');
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex lg:flex-row flex-col-reverse justify-center items-center min-h-screen lg:py-0 sm:py-10 py-24 mx-auto container gap-10'>

      <div className='flex flex-col animate-fade-in overflow-visible p-10 bg-gray-50 w-full rounded-xl shadow-md max-w-xl'>
        <h1 className='text-4xl font-bold text-gray-800'>Contact Us</h1>
        <p className='text-gray-800 mt-2 mb-5'>Feel free to contact us for any queries</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                required
                placeholder="Enter your name"
                className="w-full bg-transparent text-gray-800 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md">
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
          <div className="mb-6">
            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 mr-2 h-5 w-5" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" /></svg>
              <input
                type="number"
                required
                placeholder="Mobile no."
                className="w-full bg-transparent text-gray-800 outline-none"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-start border rounded-md px-3 py-2 bg-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" className="text-gray-400 mr-2 mt-1 h-5 w-5" width="24px" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" /></svg>
              <textarea
                type={'textarea'}
                required
                placeholder="Enter your message"
                className="w-full bg-transparent text-gray-800 outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full font-semibold text-white py-2 px-4 rounded-md transition duration-300 shadow-md ${isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-950 hover:bg-orange-900 '}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      <div className='flex flex-col animate-fade-in overflow-visible  w-full rounded-xl  px-3   max-w-xl sm:items-end items-start'>
        <h1 className='text-4xl font-bold flex justify-end text-white'>Contact Details</h1>
        <p className='text-white  flex justify-end mt-2 mb-5'>You can also reach us at:</p>

        <div className="mb-4">
          <div className="flex items-center justify-end rounded-md py-2 ">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 mr-2 h-5 w-5" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" /></svg>
            <span className="text-white">+(123) 456-7890</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-end rounded-md  py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-white">venueserv@mail.com</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center  justify-end rounded-md py-2 ">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" className="text-gray-400 mr-2 mt-1 h-5 w-5" width="24px" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" /></svg>
            <span className="text-white">123 Venue Street, City, Country</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contactpage
