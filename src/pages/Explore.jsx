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
  const [peopleCapacity, setPeopleCapacity] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filteredVenues, setFilteredVenues] = useState([])
  const [allVenues, setAllVenues] = useState([])
  const [city, setCity] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const filterRef = useRef(null)
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 768)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef()
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    AOS.init({ duration: 1000 })
    
    // Initial API call to fetch all venues when page loads
    fetchAllVenues()
    
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 768)
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

  // Setup intersection observer for infinite scroll with debouncing
  const lastVenueElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // Debounce the scroll loading
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
        
        debounceTimerRef.current = setTimeout(() => {
          setPage(prevPage => prevPage + 1)
          loadMoreVenues()
        }, 300) // 300ms debounce delay
      }
    }, { threshold: 0.5 })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

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

  const toggleFilter = (open) => {
    setIsFilterOpen(open);
    
    if (open && isSmallDevice) {
      // When opening filter on small devices, ensure it doesn't interfere with navbar
      // Only set overflow hidden if no sidebar is open
      if (!document.body.classList.contains('sidebar-expanded')) {
        document.body.style.overflow = 'hidden';
      }
      
      if (filterRef.current) {
        // Scroll to the filter with offset to avoid navbar overlap
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } else {
      // When closing, restore normal scrolling only if no sidebar is open
      if (!document.body.classList.contains('sidebar-expanded')) {
        document.body.style.overflow = 'auto';
      }
    }
  };

  // Fetch all venues from the API
  const fetchAllVenues = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/venue/fetch`)

      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }

      const venues = response.data.venues || response.data || []
      setAllVenues(venues)
      setFilteredVenues(venues)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching venues:', error)
      setLoading(false)
    }
  }

  // Load more venues on scroll
  const loadMoreVenues = async () => {
    if (!hasMore || loading) return
    
    try {
      setLoading(true)
      // Use the same API endpoint with current filter parameters and next page
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/user/venues`,
        {
          priceRange,
          parkingFacility,
          peopleCapacity,
          city,
          searchTerm,
          page: page,
          limit: 10
        }
      )

      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }

      setFilteredVenues(prev => [...prev, ...(response.data.venues || response.data || [])])
      setHasMore(response.data.hasMore || false)
      setLoading(false)
    } catch (error) {
      console.error('Error loading more venues:', error)
      setLoading(false)
    }
  }

  // Apply filters client-side
  const applyFilters = () => {
    setLoading(true)
    
    // Filter venues based on current filter criteria
    const filtered = allVenues.filter(venue => {
      // Price range filter
      const priceInRange = venue.price >= priceRange[0] && venue.price <= priceRange[1]
      
      // Parking facility filter
      const matchesParking = parkingFacility === '' || venue.parkingFacility === parkingFacility
      
      // People capacity filter
      const hasCapacity = venue.peopleCapacity >= peopleCapacity
      
      // City filter
      const matchesCity = city === '' || venue.city.toLowerCase() === city.toLowerCase()
      
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.type.toLowerCase().includes(searchTerm.toLowerCase())
      
      return priceInRange && matchesParking && hasCapacity && matchesCity && matchesSearch
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
    setPriceRange([0, 500000])
    setParkingFacility('')
    setPeopleCapacity(1)
    setCity('')
    
    // Reset to all venues
    setFilteredVenues(allVenues)
    
    // Close filter menu on small devices after resetting filters
    if (isSmallDevice) {
      toggleFilter(false)
    }
  }

  return (
    <div className='flex mx-auto transition-all bg-gray-900 text-white' style={{ marginTop: '60px' }}>
      {loading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className='min-h-screen container mx-auto flex flex-col items-center w-full lg:flex-row lg:items-start pt-0 mt-0'>
          {/* Filter menu */}
          {isFilterOpen && isSmallDevice && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => toggleFilter(false)}
              style={{ top: '60px' }}
            ></div>
          )}
          <div 
            ref={filterRef}
            className={`bg-gray-800 lg:w-64 w-full lg:min-h-screen lg:sticky p-5 
                       transition-all duration-500 ease-in-out 
                       ${isFilterOpen ? 'opacity-100 transform translate-y-0' : 'lg:opacity-100 max-h-0 opacity-0 overflow-hidden transform -translate-y-10 lg:transform-none lg:max-h-screen'} 
                       lg:block lg:opacity-100 lg:max-h-screen lg:my-0 lg:mt-0`} 
            data-aos={!isSmallDevice ? "fade-down" : ""}
            style={{
              zIndex: isSmallDevice ? 40 : 5,
              position: isSmallDevice && isFilterOpen ? 'fixed' : 'sticky',
              top: isSmallDevice && isFilterOpen ? '60px' : '0',
              borderRadius: isSmallDevice && isFilterOpen ? '8px' : '0',
              boxShadow: isSmallDevice && isFilterOpen ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
              width: isSmallDevice && isFilterOpen ? '90%' : 'auto',
              left: isSmallDevice && isFilterOpen ? '5%' : 'auto',
              right: isSmallDevice && isFilterOpen ? '5%' : 'auto',
              maxHeight: isSmallDevice && isFilterOpen ? 'calc(100vh - 70px)' : 'none',
              overflowY: isSmallDevice && isFilterOpen ? 'auto' : 'visible'
            }}
          >
            <div className='flex justify-between mb-5'>
              <h2 className='text-lg font-bold text-orange-500'>Filter Options</h2>
              <button
                className='bg-orange-600 hover:bg-orange-700 transition-colors text-white font-bold py-2 px-4 rounded lg:hidden'
                onClick={() => toggleFilter(false)}
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
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
                  onClick={applyFilters} // Apply filters client-side
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          <div className={`w-100 mx-auto transition-all duration-500 ease-in-out ${isFilterOpen && isSmallDevice ? 'opacity-75' : 'opacity-100'}`}>
            {!isFilterOpen && isSmallDevice && (
              <div className='fixed top-16 right-4 z-20'>
                <button
                  className='bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center'
                  onClick={() => toggleFilter(true)}
                  style={{
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <span className="mr-2">Filters</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            <div className='sm:p-5 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 font-medium gap-5' data-aos="fade-up">
              {filteredVenues.length > 0 ? filteredVenues.map((venue, index) => (
                <VenueCard
                  key={venue.id || index}
                  name={venue.name}
                  city={venue.city}
                  rating={venue.rating}
                  type={venue.type}
                  inquiry={venue.inquiry}
                  id={venue.id}
                  price={venue.price}
                  capacity={venue.peopleCapacity}
                />
              )) : (
                <div className="col-span-full flex justify-center items-center pt-16">
                  <p className='text-white text-xl'>No any Venue Available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Explorepage