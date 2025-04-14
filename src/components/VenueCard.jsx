import React from 'react'
import { FaMapMarkerAlt, FaStar, FaParking, FaCar, FaPaintBrush, FaDemocrat } from 'react-icons/fa'
import { MdDesignServices, MdRestaurant } from 'react-icons/md';

import { useNavigate } from 'react-router-dom'

const VenueCard = (props) => {
  const navigate = useNavigate();
  const adjustedRating = Math.max(0, Math.min(5, props.rating));
  return (
    <div className="bg-white p-4 rounded-lg shadow-2xl w-full max-w-sm">
      <img
        src={props.image}
        alt="Property Image"
        className="rounded-lg aspect-[16/9] object-cover w-full h-48"
      />
      <p className="text-gray-800 mt-2 truncate text-lg font-medium">{props.name}</p>
      <div className="flex justify-between mt-2">
        <div className="flex items-center">
          <FaMapMarkerAlt className='h-5 w-5 mr-1 text-orange-500' />
          <p className="text-gray-800 truncate">{props.city}</p>
        </div>
        <div className="flex items-center">
          <p className="text-gray-800 truncate">{props.type}</p>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className='rating-container flex'>
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`h-5 w-5 mr-1 ${index < adjustedRating ? 'text-orange-500' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <div className='flex items-center'>
          {props.food && <MdRestaurant className='h-5 w-5 mr-1 text-orange-500' />}
          {props.parking && <FaCar className='h-5 w-5 mr-1 text-orange-500' />}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button className="bg-orange-900 transition-all text-white px-4 py-2 rounded-md hover:bg-orange-800" onClick={() => navigate(`/explore/venue/${props.id}`)}>View Details</button>
        <p className="text-gray-800 flex flex-col items-end text-sm">Pre booking with <span className='font-bold text-xl'>₹{props.bookingPay}</span></p>
      </div>
    </div>
  )
}

export default VenueCard
