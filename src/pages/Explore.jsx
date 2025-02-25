import React, { useState, useEffect } from 'react'
import VenueCard from '../components/VenueCard'
import axios from 'axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Explorepage = () => {
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [parkingFacility, setParkingFacility] = useState('')
  const [peopleCapacity, setPeopleCapacity] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filteredVenues, setFilteredVenues] = useState([])
  const [city, setCity] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [venues, setVenues] = useState([
    {
      id: "123213",
      name: "Venue 1",
      city: "Surat",
      rating: 4,
      price: 10000,
      type: "Banquet hall",
      inquiry: 123,
      parkingFacility: "yes",
      peopleCapacity: 500,
      numberOfRooms: 2,
      numberOfHalls: 1,
      foodType: "veg",
    },
    {
      id: "4234234",
      name: "Venue 2",
      city: "Ahemdabad",
      rating: 3,
      price: 20000,
      type: "Party plot",
      inquiry: 123,
      parkingFacility: "no",
      peopleCapacity: 2000,
      numberOfRooms: 3,
      numberOfHalls: 2,
      foodType: "non-veg",
    },
    {
      id: "4234234",
      name: "Venue 2",
      city: "Ahemdabad",
      rating: 3,
      price: 20000,
      type: "Party plot",
      inquiry: 123,
      parkingFacility: "no",
      peopleCapacity: 2000,
      numberOfRooms: 3,
      numberOfHalls: 2,
      foodType: "non-veg",
    },
    {
      id: "4234234",
      name: "Venue 2",
      city: "Ahemdabad",
      rating: 3,
      price: 20000,
      type: "Party plot",
      inquiry: 123,
      parkingFacility: "no",
      peopleCapacity: 2000,
      numberOfRooms: 3,
      numberOfHalls: 2,
      foodType: "non-veg",
    },
    {
      id: "4234234",
      name: "Venue 2",
      city: "Ahemdabad",
      rating: 3,
      price: 20000,
      type: "Party plot",
      inquiry: 123,
      parkingFacility: "no",
      peopleCapacity: 2000,
      numberOfRooms: 3,
      numberOfHalls: 2,
      foodType: "non-veg",
    },
    {
      id: "4234234",
      name: "Venue 2",
      city: "Ahemdabad",
      rating: 3,
      price: 20000,
      type: "Party plot",
      inquiry: 123,
      parkingFacility: "no",
      peopleCapacity: 2000,
      numberOfRooms: 3,
      numberOfHalls: 2,
      foodType: "non-veg",
    },
    // Add more venues as needed
  ])

  useEffect(() => {
    AOS.init({ duration: 1000 })
    fetchFilteredVenues()
  }, [])

  const fetchFilteredVenues = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/venues`, {
        priceRange,
        parkingFacility,
        peopleCapacity,
        city,
        searchTerm,
      })

      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }

      setFilteredVenues(response.data)
    } catch (error) {
      console.error('Error fetching venues:', error)
    }
  }

  const resetFilters = (e) => {
    e.preventDefault()
    setSearchTerm('')
    setPriceRange([0, 500000])
    setParkingFacility('')
    setPeopleCapacity(1)
    setCity('')
    setFilteredVenues(venues)
  }

  const isSmallDevice = window.innerWidth < 768

  return (
    <div className='flex mx-auto transition-all bg-gray-900 text-white'>
      <div className='min-h-screen container mx-auto flex flex-col items-center w-full lg:flex-row lg:items-start'>
        <div className={`my-5 bg-gray-800 lg:w-64 w-full min-h-screen lg:sticky top-5 p-5 transition-all ${isFilterOpen ? 'block' : 'hidden'} lg:block`} data-aos={!isSmallDevice ? "fade-right" : ""}>
          <div className='flex justify-between mb-5'>
            <h2 className='text-lg font-bold text-orange-500'>Filter Options</h2>
            <button
              className='bg-orange-600 hover:bg-orange-700 transition-colors text-white font-bold py-2 px-4 rounded lg:hidden'
              onClick={() => setIsFilterOpen(false)}
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <div className='mx-auto lg:w-full w-64 flex flex-col items-center text-gray-200'>
            <div className='mx-auto lg:w-full w-64 flex flex-col mb-5'>
              <label className='block text-sm font-medium mb-2'>Search Venue:</label>
              <div className='flex items-center'>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Search by name'
                  className='p-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-orange-500 focus:border-orange-500 flex-grow lg:w-full w-64'
                />
              </div>
            </div>
            <div className='mx-auto lg:w-full w-64 flex flex-col mb-5'>
              <label className='block text-sm font-medium mb-2'>Price Range:</label>
              <div className='flex justify-between mb-2'>
                <input
                  type='number'
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Math.max(0, e.target.value), priceRange[1]])}
                  className='p-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-orange-500 focus:border-orange-500 w-24 text-center'
                />
                <span className='flex items-center text-gray-200'>to</span>
                <input
                  type='number'
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Math.min(500000, e.target.value)])}
                  className='p-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-orange-500 focus:border-orange-500 w-24 text-center'
                />
              </div>
            </div>
            <div className='mx-auto lg:w-full w-64 flex flex-col mb-5'>
              <label className='block text-sm font-medium mb-2'>Food Catering Required?:</label>
              <select
                className='block lg:w-full w-64 p-2 text-sm rounded-lg border bg-gray-700 border-gray-600 focus:ring-orange-500 focus:border-orange-500 text-gray-200'
                value={parkingFacility}
                onChange={(e) => setParkingFacility(e.target.value)}
              >
                <option value=''>Not selected</option>
                <option value='yes'>Yes</option>
                <option value='no'>No</option>
              </select>
            </div>
            <div className='mx-auto lg:w-full w-64 flex flex-col mb-5'>
              <label className='block text-sm font-medium mb-2'>People Capacity:</label>
              <div className='flex justify-between mb-2'>
                <span>{peopleCapacity}</span>
              </div>
              <input
                type='range'
                min='1'
                max='9999'
                step='50'
                value={peopleCapacity}
                onChange={(e) => setPeopleCapacity(e.target.value)}
                className='lg:w-full w-64 h-2 mb-2 range-input'
              />
            </div>
            <div className='mx-auto lg:w-full w-64 flex flex-col'>
              <label className='block text-sm font-medium mb-2'>City:</label>
              <select
                className='block lg:w-full w-64 p-2 rounded-lg text-sm border border-gray-600 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-gray-200'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value=''>Select City</option>
                <option value='Surat'>Surat</option>
                <option value='Ahemdabad'>Ahemdabad</option>
              </select>
            </div>
            <div className='flex justify-between w-full mt-5'>
              <button
                className='bg-orange-600 hover:bg-orange-700 transition-colors text-white font-bold py-2 px-4 rounded w-1/2 mr-2'
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                className='bg-orange-600 hover:bg-orange-700 transition-colors text-white font-bold py-2 px-4 rounded w-1/2 ml-2'
                onClick={fetchFilteredVenues} // Call API on click
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <div className='w-100 mx-auto'>
          <div className='flex justify-start py-5 lg:hidden'>
            <button
              className='bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => setIsFilterOpen(true)}
            >
              Show Filter
            </button>
          </div>
          <div className='sm:p-5 mt-5 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 font-medium gap-5' data-aos="fade-up">
            {filteredVenues.length > 0 ? filteredVenues.map((venue, index) => (
              <VenueCard
                key={venue.id}
                name={venue.name}
                city={venue.city}
                rating={venue.rating}
                type={venue.type}
                inquiry={venue.inquiry}
                id={venue.id}
                price={venue.price}
                capacity={venue.peopleCapacity}
              />
            )) : <p className='text-white'>No any Venue Available</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explorepage