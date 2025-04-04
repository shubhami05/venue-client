import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBookmark, FaBusinessTime, FaCheckCircle, FaExternalLinkAlt, FaHandHoldingUsd, FaHandshake, FaMapMarkerAlt, FaPlaceOfWorship, FaStar, FaStarHalfAlt, FaUserCircle } from 'react-icons/fa'
import about_img from '../assets/about_img.jpg'
import hero_img from '../assets/hero_img.png'
import { initAOS } from '../utils/initAOS.jsx';

const aboutUsData = [
  {
    icon: FaBookmark,
    title: "Easy & simple way for booking",
    description: "Welcome to VenueServ, your go-to platform for effortlessly booking your ideal venue. Whether it's a wedding, corporate event, or special celebration, we make the process simple and stress-free. Explore a wide range of venues, compare options, and secure your spot in just a few clicks. Let us help you create unforgettable memories with ease."
  },
  {
    icon: FaHandshake,
    title: "Trusted booking system",
    description: "Experience peace of mind with VenueServ's trusted booking system. Our platform ensures secure transactions, verified listings, and transparent communication, so you can confidently book the perfect venue. Trust us to handle the details while you focus on making your event unforgettable."
  },
  {
    icon: FaHandHoldingUsd,
    title: "Best platform to list your venue",
    description: <><Link to="/list-your-venue" className='cursor-pointer text-indigo-500 hover:text-indigo-700 hover:underline transition-all'>List your venue <FaExternalLinkAlt className='inline' /></Link> on VenueServ, the best platform for reaching a wide audience of potential clients. Showcase your space with ease, manage bookings effortlessly, and grow your business with our user-friendly interface. Join VenueServ to connect with event planners and make your venue the go-to choice for unforgettable events.</>
  }
];

const statsData = [
  { icon: FaPlaceOfWorship, value: "1500+", label: "Total Venues Available" },
  { icon: FaCheckCircle, value: "8500+", label: "Overall Bookings done" },
  { icon: FaBusinessTime, value: "5000+", label: "On-site Venue owners" },
  { icon: FaUserCircle, value: "6600+", label: "Satisfied customers" }
];

const testimonialsData = [
  {
    name: "Client 1",
    rating: 4.5,
    feedback: "VenueServ made the entire process of finding and booking a venue so easy. Highly recommend!"
  },
  {
    name: "Client 2",
    rating: 4.5,
    feedback: "Great platform with a lot of venue options. Easy to use and the customer service is top-notch."
  },
  {
    name: "Client 3",
    rating: 4.5,
    feedback: "I found the perfect venue for my wedding thanks to VenueServ. The process was seamless and stress-free."
  }
];

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initAOS();
  }, []);

  return (
    <div className='bg-gray-900'>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-orange-100 to-orange-50 w-full">
        <div className='flex flex-col container min-h-screen items-center justify-center lg:gap-0 gap-10 lg:flex-row lg:justify-between mx-auto py-12' data-aos="fade-up">
          <div className="text-left animate-fade-in md:ms-4">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 drop-shadow-lg overflow-hidden">Discover Your Ideal Venue</h2>
            <p className="text-gray-900 text-md drop-shadow-lg mb-8 font-semibold max-w-md text-justify">
              Create unforgettable moments of your event whether planning a wedding, corporate event, or special celebration, we connect you with the perfect venue to bring your vision to life.
            </p>
            <div className="flex sm:space-x-4 space-x-0 sm:flex-row flex-col items-center sm:justify-start justify-center">
              <button className="bg-orange-900 mt-5 max-w-48 text-white px-6 py-3 rounded-md hover:bg-orange-800 font-semibold shadow-lg hover:-translate-y-0.5 transition-all" onClick={() => navigate('/explore')}>Explore Venues</button>
              <button className="bg-gray-900 mt-5 max-w-48 text-white px-6 py-3 rounded-md hover:bg-gray-800 font-semibold hover:-translate-y-0.5 transition-all" onClick={() => navigate('/list-your-venue')}>List Your Venue</button>
            </div>
          </div>
          <div className='md:block hidden absolute md:static animate-fade-in overflow-visible'>
            <img src={hero_img} className='max-w-lg md:w-full' />
          </div>
        </div>
      </section>

      {/* About us section */}
      <section className="bg-gray-900 flex flex-col gap-10 items-center justify-center mx-auto py-12">
        <h2 className="text-3xl text-orange-50 font-bold mb-4 text-center overflow-y-hidden" data-aos="fade-up">About Us</h2>
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" data-aos="fade-up">
          {aboutUsData.map((item, index) => (
            <div key={index} className="bg-orange-50 p-6 rounded-lg text-orange-900 text-justify">
              <h3 className="text-xl font-bold text-justify text-orange-900 mb-4"><item.icon className='h-5 w-5 inline' /> {item.title}</h3>
              <p className="text-gray-800 font-medium">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto py-12 bg-gray-900 flex justify-center">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" data-aos="fade-up">
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
      </section>

      <section className='bg-orange-50 w-100'>
        <div className="flex justify-center py-12 text-orange-900 mt-10" data-aos="fade-up">
          <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center animate-fade-in">
            {statsData.map((item, index) => (
              <div key={index} className='flex flex-col items-center'>
                <item.icon className='h-5 w-5 mb-2' />
                <h3 className="text-xl font-bold mb-2">{item.value}</h3>
                <p className="text-gray-800 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 w-100 flex justify-center text-orange-900 fade-in-section">
        <div className="container" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8 text-center text-orange-50 overflow-y-hidden">What Our Clients Say</h2>
          <div className="grid px-10 py-20 grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonialsData.map((item, index) => (
              <div key={index} className="bg-orange-50 shadow-lg p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <FaUserCircle className="h-8 w-8 text-orange-900 mr-4" />
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <div className="flex">
                      {[...Array(Math.floor(item.rating))].map((_, i) => <FaStar key={i} className="text-orange-400" />)}
                      {item.rating % 1 !== 0 && <FaStarHalfAlt className="text-orange-400" />}
                    </div>
                  </div>
                </div>
                <p className="text-gray-800">"{item.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email section */}
      <section className="container mx-auto pb-20">
        <div className="bg-orange-50 p-6 container mx-auto rounded-lg shadow-lg" data-aos="fade-up">
          <h3 className="text-2xl text-gray-800 font-bold mb-4 text-center">For Recent Update, News.</h3>
          <p className="text-gray-800 mb-4 text-center">We helps businesses customize, automate and scale up their ad production and delivery.</p>
          <form className="flex sm:flex-row flex-col justify-center">
            <input type="email" placeholder="Enter your Email" required className="bg-white text-orange-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none drop-shadow-lg sm:w-72 w-full" />
            <button type='submit' className="bg-orange-500 transition-colors font-medium text-white px-0 sm:px-4 py-2 rounded-md hover:bg-orange-600 m-0 mt-4 sm:ml-4 sm:mt-0 drop-shadow-lg">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Homepage
