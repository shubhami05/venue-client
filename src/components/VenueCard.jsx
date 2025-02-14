import React from 'react'
import { FaMapMarkerAlt, FaRegBookmark, FaStar, FaStarHalfAlt, FaUserCircle } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom'

const VenueCard = (props) => {
  const navigate = useNavigate();
  const adjustedRating = Math.max(0, Math.min(5, props.rating));
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img src="https://placehold.co/300x200/png" alt="Property Image" className="w-full rounded-lg" />
      <p className="text-gray-800 mt-2">{props.name}</p>
      <div className="flex justify-between mt-2">
        <div className="flex items-center ">
          <FaMapMarkerAlt className='h-5 w-5 mr-1 text-orange-500' />
          <p className="text-gray-800">{props.city}</p>
        </div>
        <div className="flex items-center">
          <p className="text-gray-800">{props.type}</p>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className='rating-container flex'>
          {/* <FaStar className='h-5 w-5 mr-1 text-orange-500' />   */}
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`h-5 w-5 mr-1 ${index < adjustedRating ? 'text-orange-500' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <div className='booking-count flex items-center gap-1 '>
          <FaUsers className='text-orange-500' />
          <p className='text-gray-800'>{props.capacity}</p>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button className="bg-orange-900 transition-all text-white px-4 py-2 rounded-md hover:bg-orange-800" onClick={() => navigate(`/explore/venue/${props.id}`)}>View Details</button>
        <p className="text-gray-800 flex flex-col items-end text-sm">Starts with <span className='font-bold  text-xl'>₹{props.price}</span></p>
      </div>
    </div>
  )
}

export default VenueCard
