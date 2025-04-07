import React, { useState, useEffect, useRef, useCallback } from 'react'
import VenueCard from '../components/VenueCard'
import axios from 'axios'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useLocation } from 'react-router-dom'
import Loader from '../components/Loader'

const Explorepage = () => {
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [parkingFacility, setParkingFacility] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filteredVenues, setFilteredVenues] = useState([])
  const [allVenues, setAllVenues] = useState([])
  const [city, setCity] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [venueType, setVenueType] = useState('')
  const [eventType, setEventType] = useState('')
  const [foodOption, setFoodOption] = useState('')
  const [decorationOption, setDecorationOption] = useState('')
  const [cancellation, setCancellation] = useState('')
  const filterRef = useRef(null)
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 960)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [scrollTopVisible, setScrollTopVisible] = useState(false)

  const venueTypes = [
    { value: 'banquet', label: 'Banquet' },
    { value: 'conference', label: 'Conference' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'party', label: 'Party' }
  ]

  useEffect(() => {
    AOS.init({ duration: 1000 })

    // Initial API call to fetch all venues when page loads
    fetchAllVenues()

    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 960)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close filter menu on route changes
  useEffect(() => {
    if (isFilterOpen) {
      toggleFilter(false)
    }
  }, [location.pathname])

  // Handle body scroll locking
  useEffect(() => {
    if (isSmallDevice) {
      if (isFilterOpen) {
        // Lock scrolling when filter is open
        document.body.style.overflow = 'hidden'
      } else {
        // Restore scrolling when filter is closed
        document.body.style.overflow = 'auto'
      }
    }

    return () => {
      // Cleanup: ensure scrolling is restored when component unmounts
      document.body.style.overflow = 'auto'
    }
  }, [isFilterOpen, isSmallDevice])


  // Add a useEffect to ensure body overflow is reset when component unmounts
  useEffect(() => {
    return () => {
      // Ensure body overflow is reset when component unmounts
      // Only reset if no sidebar is open (check for sidebar-related classes)
      if (!document.body.classList.contains('sidebar-expanded')) {
        document.body.style.overflow = 'auto';
      }

      // Remove any potential overlay elements
      const overlay = document.getElementById('filter-overlay');
      if (overlay) {
        document.body.removeChild(overlay);
      }
    };
  }, []);

  const toggleFilter = useCallback((open) => {
    setIsFilterOpen(open);

    if (isSmallDevice) {
      // Handle body scroll
      document.body.style.overflow = open ? 'hidden' : 'auto';

      // Scroll to top when opening filter
      if (open) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [isSmallDevice]);

  // Fetch all venues from the API
  const fetchAllVenues = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/venue/fetch`)

      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }

      const venues = response.data.venues || response.data || [];
      console.log(venues);
      setAllVenues(venues)
      setFilteredVenues(venues)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching venues:', error)
      setLoading(false)
    }
  }
  // Apply filters client-side
  const applyFilters = () => {
    setLoading(true)

    // Filter venues based on current filter criteria
    const filtered = allVenues.filter(venue => {
      // Parking facility filter
      const matchesParking = parkingFacility === '' ||
        (parkingFacility === 'yes' && venue.parking?.available) ||
        (parkingFacility === 'no' && !venue.parking?.available)

      // City filter
      const matchesCity = city === '' || venue.city.toLowerCase() === city.toLowerCase()

      // Venue type filter
      const matchesType = venueType === '' || venue.type.toLowerCase() === venueType.toLowerCase()

      // Event type filter
      const matchesEvent = eventType === '' || venue.events?.includes(eventType)

      // Cancellation filter
      const matchesCancellation = cancellation === '' ||
        (cancellation === 'yes' && venue.cancellation) ||
        (cancellation === 'no' && !venue.cancellation)

      // Search term filter
      const matchesSearch = searchTerm === '' ||
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesParking &&
        matchesCity &&
        matchesType &&
        matchesEvent &&
        matchesCancellation &&
        matchesSearch
    })

    setFilteredVenues(filtered)
    setLoading(false)

    // Close filter menu on small devices after applying filters
    if (isSmallDevice) {
      toggleFilter(false)
    }
  }

  const resetFilters = (e) => {
    e.preventDefault()
    setSearchTerm('')
    setParkingFacility('')
    setCity('')
    setVenueType('')
    setEventType('')
    setCancellation('')

    // Reset to all venues
    setFilteredVenues(allVenues)

    // Close filter menu on small devices after resetting filters
    if (isSmallDevice) {
      toggleFilter(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollTopVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='flex mx-auto transition-all mb-10 bg-gray-900 text-white' style={{ paddingTop: '80px' }}>
      {loading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className='min-h-screen container mx-auto flex flex-col items-center w-full lg:flex-row lg:items-start pt-0 mt-0'>
          {/* Filter Button Container */}
          <div className={`fixed right-4 mb-2 z-10 transition-all duration-300 ${scrollTopVisible ? 'bottom-16' : 'bottom-4'
            }`}>
            <button
              className={`bg-orange-600 hover:bg-orange-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 ${isFilterOpen ? 'bg-orange-700' : ''
                } lg:hidden`}
              onClick={() => toggleFilter(!isFilterOpen)}
              aria-label="Toggle filters"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>

          {/* Filter Menu */}
          <div
            ref={filterRef}
            className={`bg-gray-600/20 lg:w-64 w-full lg:min-h-screen lg:sticky p-4 
                         transition-all duration-500 ease-in-out 
                         ${!isFilterOpen && 'lg:block hidden'}
                         ${isFilterOpen && 'fixed inset-0 w-full lg:static lg:w-64'}`}
            style={{
              zIndex: 10,
              borderRadius: !isSmallDevice ? '0' : '0',
              maxHeight: !isSmallDevice ? 'none' : '100vh',
              overflowY: 'auto',
              top: '60px',
            }}
          >
            <div className='flex justify-between mb-3'>
              <h2 className='text-lg font-bold text-orange-500'>Filter Options</h2>
              <button
                className='bg-orange-600 hover:bg-orange-700 transition-colors lg:hidden block text-white font-bold p-2 rounded'
                onClick={() => toggleFilter(false)}
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='flex flex-col items-center text-gray-200 space-y-5'>
              <div className='w-full'>
                <label className='block text-sm font-medium mb-1'>Search Venue:</label>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Search by name'
                  className='p-2 w-full rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:ring-orange-500 focus:border-orange-500'
                />
              </div>
              <div className='w-full'>
                <label className='block text-sm font-medium mb-1'>Venue Type:</label>
                <select
                  className='block w-full p-2 text-sm rounded-lg border bg-gray-800 border-gray-600 focus:ring-orange-500 focus:border-orange-500 text-gray-100'
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                >
                  <option value='' className="bg-gray-800 text-gray-100">All Types</option>
                  {venueTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-gray-800 text-gray-100">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-full'>
                <label className='block text-sm font-medium mb-1'>Event Type:</label>
                <select
                  className='block w-full p-2 text-sm rounded-lg border bg-gray-800 border-gray-600 focus:ring-orange-500 focus:border-orange-500 text-gray-100'
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value='' className="bg-gray-800 text-gray-100">All Events</option>
                  <option value='wedding' className="bg-gray-800 text-gray-100">Wedding</option>
                  <option value='corporate' className="bg-gray-800 text-gray-100">Corporate</option>
                  <option value='birthday' className="bg-gray-800 text-gray-100">Birthday</option>
                  <option value='conference' className="bg-gray-800 text-gray-100">Conference</option>
                </select>
              </div>
              <div className='w-full'>
                <label className='block text-sm font-medium mb-1'>Cancellation Policy:</label>
                <select
                  className='block w-full p-2 text-sm rounded-lg border bg-gray-800 border-gray-600 focus:ring-orange-500 focus:border-orange-500 text-gray-100'
                  value={cancellation}
                  onChange={(e) => setCancellation(e.target.value)}
                >
                  <option value='' className="bg-gray-800 text-gray-100">All Options</option>
                  <option value='yes' className="bg-gray-800 text-gray-100">Cancellation Available</option>
                  <option value='no' className="bg-gray-800 text-gray-100">No Cancellation</option>
                </select>
              </div>
              <div className='w-full'>
                <label className='block text-sm font-medium mb-1'>Food Catering Required?:</label>
                <select
                  className='block w-full p-2 text-sm rounded-lg border bg-gray-800 border-gray-600 focus:ring-orange-500 focus:border-orange-500 text-gray-100'
                  value={parkingFacility}
                  onChange={(e) => setParkingFacility(e.target.value)}
                >
                  <option value='' className="bg-gray-800 text-gray-100">Not selected</option>
                  <option value='yes' className="bg-gray-800 text-gray-100">Yes</option>
                  <option value='no' className="bg-gray-800 text-gray-100">No</option>
                </select>
              </div>
              <div className='w-full'>
                <label className='block text-sm font-medium mb-1'>City:</label>
                <select
                  className='block w-full p-2 rounded-lg text-sm border border-gray-600 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-gray-100'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value='' className="bg-gray-800 text-gray-100">Select City</option>
                  <option value='Surat' className="bg-gray-800 text-gray-100">Surat</option>
                  <option value='Ahemdabad' className="bg-gray-800 text-gray-100">Ahemdabad</option>
                </select>
              </div>
              <div className='flex justify-between w-full pt-3'>
                <button
                  className='bg-orange-600 hover:bg-orange-700 transition-colors text-white font-bold py-2 px-3 rounded w-1/2 mr-2 text-sm'
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  className='bg-orange-600 hover:bg-orange-700 transition-colors text-white font-bold py-2 px-3 rounded w-1/2 ml-2 text-sm'
                  onClick={applyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          <div className={`w-full lg:flex-1 transition-all duration-500 ease-in-out ${isFilterOpen && isSmallDevice ? 'hidden' : 'block'}`}>
            <div className='sm:p-5 p-0 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 font-medium gap-5 place-items-center' data-aos="fade-up">
              {filteredVenues.length > 0 ? filteredVenues.map((venue, index) => (
                <div className="w-full flex justify-center">
                  <VenueCard
                    key={venue._id || index}
                    name={venue.name}
                    image={venue.photos[0]}
                    city={venue.city}
                    rating={venue.rating || 4}
                    type={venue.type}
                    id={venue._id}
                    bookingPay={venue.bookingPay}
                  />
                </div>
              )) : (
                <div className="col-span-full flex justify-center items-center pt-16">
                  <p className='text-white text-xl'>No any Venue Available</p>
                </div>
              )}
            </div>
          </div>
          {/* Overlay */}
          {isFilterOpen && !isSmallDevice && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-5"
              onClick={() => toggleFilter(false)}
              style={{ top: '60px' }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Explorepage