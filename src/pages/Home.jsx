import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBookmark, FaBusinessTime, FaCheckCircle, FaExternalLinkAlt, FaHandHoldingUsd, FaHandshake, FaMapMarkerAlt, FaPlaceOfWorship, FaRegBookmark, FaStar, FaStarHalfAlt, FaUserCircle } from 'react-icons/fa'
import about_img from '../assets/about_img.jpg'
import hero_img from '../assets/hero_img.png'


const Homepage = () => {
  const navigate = useNavigate();



  return (
    < >
      {/* Hero section */}
      <section className="bg-orange-50 w-full">
        <div className='flex flex-col container min-h-screen items-center justify-center lg:gap-0 gap-10 lg:flex-row lg:justify-between mx-auto py-12'>

          <div className="text-left animate-fade-in md:ms-4">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 drop-shadow-lg overflow-hidden">Discover Your Ideal Venue</h2>
            {/* <h3 className="text-2xl font-medium mb-6 text-gray-900 drop-shadow-lg">Create Unforgettable Moments of Your Event </h3> */}
            <p className="text-gray-900 text-md drop-shadow-lg mb-8 font-semibold max-w-md text-justify">
              Create unforgettable moments of your event whether planning a wedding, corporate event, or special celebration, we connect you with the perfect venue to bring your vision to life.
            </p>
            <div className="flex sm:space-x-4 space-x-0 sm:flex-row flex-col items-center sm:justify-start justify-center">
              <button className="bg-orange-900 mt-5 max-w-48 text-white px-6 py-3 rounded-md hover:bg-orange-800 font-semibold shadow-lg hover:-translate-y-0.5 transition-all" onClick={() => navigate('/explore')}>Explore Venues</button>
              <button className="bg-gray-900 mt-5 max-w-48 text-white px-6 py-3 rounded-md hover:bg-gray-800 font-semibold hover:-translate-y-0.5 transition-all" onClick={() => navigate('/list-your-venue')}>List Your Venue</button>
            </div>
          </div>
          <div className='md:block hidden  absolute md:static animate-fade-in overflow-visible '>
            <img src={hero_img} className='max-w-lg md:w-full ' />
          </div>
        </div>

      </section>

      {/* About us section */}
      <section>
        <div className="bg-gray-900 flex flex-col gap-10 items-center justify-center mx-auto py-12">
          <h2 className="text-3xl font-bold mb-4 text-center overflow-y-hidden">About Us</h2>

          <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="bg-orange-50 p-6 rounded-lg  text-orange-900 text-justify">

              <h3 className="text-xl font-bold text-justify text-orange-900 mb-4"><FaBookmark className='h-5 w-5 inline' /> Easy & simple way for booking </h3>
              <p className="text-gray-800 font-medium">Welcome to VenueServ, your go-to platform for effortlessly booking your ideal venue. Whether it's a wedding, corporate event, or special celebration, we make the process simple and stress-free. Explore a wide range of venues, compare options, and secure your spot in just a few clicks. Let us help you create unforgettable memories with ease.</p>

            </div>
            <div className="bg-orange-50 text-orange-900 p-6 text-justify rounded-lg ">

              <h3 className="text-xl font-bold mb-4"><FaHandshake className='h-6 w-6 inline' /> Trusted booking system</h3>
              <p className='text-gray-800 font-medium' >Experience peace of mind with VenueServ's trusted booking system. Our platform ensures secure transactions, verified listings, and transparent communication, so you can confidently book the perfect venue. Trust us to handle the details while you focus on making your event unforgettable.</p>
            </div>

            <div className="bg-orange-50 text-orange-900 p-6 text-justify rounded-lg ">
              <h3 className="text-xl font-bold mb-4"><FaHandHoldingUsd className='h-6 w-6 inline' /> Best platform to list your venue</h3>
              <p className='text-gray-800 font-medium'><Link to="/list-your-venue" className='cursor-pointer text-indigo-500 hover:text-indigo-700 hover:underline transition-all'>List your venue <FaExternalLinkAlt className='inline' /></Link> on VenueServ, the best platform for reaching a wide audience of potential clients. Showcase your space with ease, manage bookings effortlessly, and grow your business with our user-friendly interface. Join VenueServ to connect with event planners and make your venue the go-to choice for unforgettable events.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto py-12 bg-gray-900 flex justify-center ">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div>
              <img src={about_img} alt="Property Image" className="w-full h-full rounded-lg border-orange-100 border-2" />
            </div>
            <div className="bg-orange-50 p-6 rounded-lg shadow-lg font-semibold">
              <h3 className="text-2xl font-bold mb-4 text-orange-900">Top-Rated Hosts on VenueServ</h3>
              <p className="text-gray-800 mb-4">Discover why our hosts are consistently rated the best. Enjoy unparalleled service, unmatched deals, and a seamless booking experience that lets you focus on what truly matters.</p>
              <ul className="list-disc list-inside text-gray-800 mb-4">
                <li>Exclusive, unbeatable deals</li>
                <li>Friendly, responsive hosts & 24/7 support</li>
                <li>100% secure payment system</li>
                <li>Verified reviews from real guests</li>
                <li>Detailed venue descriptions and high-quality images</li>
                <li>Flexible booking options to suit your needs</li>
              </ul>
            </div>

          </div>
        </div>

        <div className="w-100 flex justify-center py-12 bg-orange-50 text-orange-900 mt-10">
          <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center animate-fade-in">
            <div className='flex flex-col items-center'>
              <FaPlaceOfWorship className='h-5 w-5 mb-2' />
              <h3 className="text-xl font-bold mb-2">1500+</h3>
              <p className="text-gray-800 font-medium">Total Venues Available</p>
            </div>

            <div className='flex flex-col items-center'>
              <FaCheckCircle className='h-5 w-5 mb-2' />
              <h3 className="text-xl font-bold mb-2">8500+</h3>
              <p className="text-gray-800 font-medium">Overall Bookings done</p>
            </div>

            <div className='flex flex-col items-center'>
              <FaBusinessTime className='h-5 w-5 mb-2' />
              <h3 className="text-xl font-bold mb-2">5000+</h3>
              <p className="text-gray-800 font-medium"> On-site Venue owners</p>
            </div>

            <div className='flex flex-col items-center'>
              <FaUserCircle className='h-5 w-5 mb-2' />
              <h3 className="text-xl font-bold mb-2">6600+</h3>
              <p className="text-gray-800 font-medium">Satisfied customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {/* <section className="flex py-20 justify-center bg-gray-900">
        <div className='container flex flex-col mb-10'>
          <h2 className="text-3xl font-bold mb-4 text-center overflow-y-hidden">Featured Venues</h2>
          <div className="flex justify-end mb-4">
            <button className="bg-orange-600 font-semibold mt-3 text-white px-4 py-2 rounded-md hover:bg-orange-700  hover:-translate-y-0.5 transition-all"
              onClick={() => navigate('/explore')}>
              Explore All →
            </button>
          </div>
          <div className='sm:p-5 mt-5 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 font-medium gap-5'>

            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src="https://via.placeholder.com/300x200" alt="Property Image" className="w-full rounded-lg" />
              <p className="text-gray-800 mt-2">2861 62nd Ave, Oakland, CA 94605</p>
              <div className="flex justify-between mt-2">
                <div className="flex items-center ">
                  <FaMapMarkerAlt className='h-5 w-5 mr-1 text-orange-500' />
                  <p className="text-gray-800">Surat</p>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-800">Banquet hall</p>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className='rating-container flex'>
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStarHalfAlt className='h-5 w-5 mr-1 text-orange-500' />
                </div>
                <div className='booking-count flex items-center gap-1 '>
                  <FaRegBookmark className='text-orange-500' />
                  <p className='text-gray-800'>5000</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-orange-900 transition-all text-white px-4 py-2 rounded-md hover:bg-orange-800" onClick={() => navigate('/venue/:37427462784')}>View Details</button>
                <p className="text-gray-800 font-bold">$649,900</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src="https://via.placeholder.com/300x200" alt="Property Image" className="w-full rounded-lg" />
              <p className="text-gray-800 mt-2">2861 62nd Ave, Oakland, CA 94605</p>
              <div className="flex justify-between mt-2">
                <div className="flex items-center ">
                  <FaMapMarkerAlt className='h-5 w-5 mr-1 text-orange-500' />
                  <p className="text-gray-800">Surat</p>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-800">Banquet hall</p>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className='rating-container flex'>
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStarHalfAlt className='h-5 w-5 mr-1 text-orange-500' />
                </div>
                <div className='booking-count flex items-center gap-1 '>
                  <FaRegBookmark className='text-orange-500' />
                  <p className='text-gray-800'>5000</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-orange-900 transition-all text-white px-4 py-2 rounded-md hover:bg-orange-800" onClick={() => navigate('/venue-details/:37427462784')}>View Details</button>
                <p className="text-gray-800 font-bold">$649,900</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src="https://via.placeholder.com/300x200" alt="Property Image" className="w-full rounded-lg" />
              <p className="text-gray-800 mt-2">2861 62nd Ave, Oakland, CA 94605</p>
              <div className="flex justify-between mt-2">
                <div className="flex items-center ">
                  <FaMapMarkerAlt className='h-5 w-5 mr-1 text-orange-500' />
                  <p className="text-gray-800">Surat</p>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-800">Banquet hall</p>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className='rating-container flex'>
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStar className='h-5 w-5 mr-1 text-orange-500' />
                  <FaStarHalfAlt className='h-5 w-5 mr-1 text-orange-500' />
                </div>
                <div className='booking-count flex items-center gap-1 '>
                  <FaUserCircle className='text-orange-500' />
                  <p className='text-gray-800'>5000</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-orange-900 transition-all text-white px-4 py-2 rounded-md hover:bg-orange-800" onClick={() => navigate('/venue-details/:37427462784')}>View Details</button>
                <p className="text-gray-800 font-bold">$649,900</p>
              </div>
            </div>


          </div>
        </div>
      </section> */}

      <section className="py-20 w-100 flex justify-center text-orange-900 fade-in-section">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center  text-orange-50 overflow-y-hidden">What Our Clients Say</h2>
          <div className="grid px-10 py-20 grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-orange-50 shadow-lg p-6 rounded-lg ">
              <div className="flex items-center mb-4">
                <FaUserCircle className="h-8 w-8 text-orange-900 mr-4" />
                <div>
                  <h3 className="text-lg font-bold">Client 1</h3>
                  <div className="flex">
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStarHalfAlt className="text-orange-400" />
                  </div>
                </div>
              </div>
              <p className="text-gray-800">"VenueServ made the entire process of finding and booking a venue so easy. Highly recommend!"</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <FaUserCircle className="h-8 w-8 text-orange-900 mr-4" />
                <div>
                  <h3 className="text-lg font-bold">Client 2</h3>
                  <div className="flex">
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStarHalfAlt className="text-orange-400" />
                  </div>
                </div>
              </div>
              <p className="text-gray-800">"Great platform with a lot of venue options. Easy to use and the customer service is top-notch."</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <FaUserCircle className="h-8 w-8 text-orange-900 mr-4" />
                <div>
                  <h3 className="text-lg font-bold">Client 3</h3>
                  <div className="flex">
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStar className="text-orange-400" />
                    <FaStarHalfAlt className="text-orange-400" />
                  </div>
                </div>
              </div>
              <p className="text-gray-800">"I found the perfect venue for my wedding thanks to VenueServ. The process was seamless and stress-free."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email section */}
      <section className="w-full  py-20">
        <div className="bg-orange-50 p-6 container mx-auto rounded-lg shadow-lg">
          <h3 className="text-2xl text-gray-800 font-bold mb-4 text-center">For Recent Update, News.</h3>
          <p className="text-gray-800 mb-4 text-center">We helps businesses customize, automate and scale up their ad production and delivery.</p>
          <form className="flex sm:flex-row flex-col justify-center">
            <input type="email" placeholder="Enter your Email" required className="bg-white text-orange-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none drop-shadow-lg sm:w-72 w-full" />
            <button type='submit' className="bg-orange-500 transition-colors font-medium text-white px-0 sm:px-4 py-2 rounded-md hover:bg-orange-600 m-0 mt-4 sm:ml-4 sm:mt-0 drop-shadow-lg">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Homepage
