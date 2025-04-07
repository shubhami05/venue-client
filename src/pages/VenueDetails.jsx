import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarCheck, FaParking, FaUtensils, FaPaintBrush, FaCheck, FaTimes, FaList, FaMoneyBill, FaQuestionCircle, FaStar, FaRegStar, FaStarHalfAlt, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { Modal } from 'flowbite-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { FaXmark } from 'react-icons/fa6';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VenueDetails = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    message: ''
  });
  const [showavailabilityModal, setShowavailabilityModal] = useState(false);
  const [availabilityForm, setavailabilityForm] = useState({
    date: null,
    timeslot: ''
  });
  const [availabilityStatus, setavailabilityStatus] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: null,
    timeslot: '',
    numberOfGuest: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    message: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVenueDetails();
  }, [venueId]);

  useEffect(() => {
    if (venue) {
      fetchVenueReviews();
    }
  }, [venue]);

  const fetchVenueDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/venue/fetch/${venueId}`);
      if (response.data.success) {
        setVenue(response.data.venue);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch venue details');
    } finally {
      setLoading(false);
    }
  };

  const fetchVenueReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/venue/reviews/${venueId}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
        
        // Check if user has already reviewed
        try {
          const userReviewsResponse = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/review/fetch`);
          if (userReviewsResponse.data.success) {
            const existingReview = userReviewsResponse.data.reviews.find(
              review => review.venue._id === venueId
            );
            setUserReview(existingReview || null);
          }
        } catch (error) {
          console.log("Not logged in or couldn't fetch user reviews");
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.message.trim()) {
      toast.error('Please enter a review message');
      return;
    }

    try {
      setReviewSubmitting(true);
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/review/create`, {
        venueId,
        rating: newReview.rating,
        message: newReview.message
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setShowReviewModal(false);
        setNewReview({ rating: 5, message: '' });
        // Refresh reviews
        await fetchVenueReviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteReview = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.delete(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/review/delete/${reviewToDelete}`);
      
      if (response.data.success) {
        toast.success('Review deleted successfully');
        setUserReview(null);
        await fetchVenueReviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    } finally {
      setLoadingReviews(false);
      setShowDeleteConfirmModal(false);
    }
  };

  // Star rating component
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-orange-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-orange-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-orange-500" />);
      }
    }

    return (
      <div className="flex">{stars}</div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Call the API endpoint to send the inquiry
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/inquiry/send`, {
        venueId,
        eventType: inquiryForm.eventType,
        date: inquiryForm.eventDate,
        message: inquiryForm.message
      });
      
      if (response.data.success) {
        toast.success(response.data.message || 'Inquiry submitted successfully!');
        setShowInquiryModal(false);
        // Reset the inquiry form
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          eventType: '',
          message: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(error.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckavailability = async (e) => {
    e.preventDefault();
    try {
      console.log(venueId, availabilityForm.date, availabilityForm.timeslot);
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/venue/check-availability`, {
        venueId,
        date: availabilityForm.date,
        timeslot: parseInt(availabilityForm.timeslot)
      });
      setavailabilityStatus(response.data);

      if (response.data.isAvailable) {
        setBookingForm({
          ...bookingForm,
          date: availabilityForm.date,
          timeslot: availabilityForm.timeslot
        });
        setShowavailabilityModal(false);
        setShowBookingModal(true);
        toast.success('Venue is available for selected date and time!');
      } else {
        toast.error('Venue is not available for selected date and time.');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to check availability');
    }
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setBookingForm({
      date: null,
      timeslot: '',
      numberOfGuest: ''
    });
  };

  const handleBookVenue = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/booking/create`, {
        venueId,
        date: bookingForm.date,
        timeslot: parseInt(bookingForm.timeslot),
        numberOfGuest: parseInt(bookingForm.numberOfGuest)
      });
      toast.success('Venue booked successfully!');
      handleCloseBookingModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book venue');
    }
  };

  if (loading) return <Loader />;
  if (!venue) return (
    <div className="min-h-screen bg-orange-50 pt-16 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Venue Not Found</h1>
        <p className="text-gray-600 mb-6">The venue you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/explore')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Back to Venues
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50">
      {/* Back Navigation */}
      <div className="container  mx-auto px-4 pt-6">
        <button
          onClick={() => navigate('/explore')}
          className="flex bg-orange-100 items-center text-orange-700 hover:text-orange-800 transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Venues
        </button>
    </div>

      <div className="container mx-auto px-4 py-8">
        {/* Image Slider Section with improved styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-2xl p-6 mb-8 overflow-hidden"
        >
          <div className="max-w-5xl mx-auto">
            <Carousel
              selectedItem={selectedImageIndex}
              onChange={setSelectedImageIndex}
              showArrows={true}
              showStatus={false}
              showThumbs={true}
              infiniteLoop={true}
              className="venue-carousel"
              renderArrowPrev={(onClickHandler, hasPrev) =>
                hasPrev && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    className="absolute left-0 z-10 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full ml-4 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext) =>
                hasNext && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    className="absolute right-0 z-10 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full mr-4 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              }
            >
              {venue.photos.map((photo, index) => (
                <div key={index} className="h-[500px]">
                  <img
                    src={photo}
                    alt={`Venue ${index + 1}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </motion.div>

        {/* Venue Information with Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{venue.name}</h1>
              <div className="flex items-center text-gray-700 mb-6 text-lg">
                <FaMapMarkerAlt className="mr-2 text-orange-600" />
                <span className="font-medium">{venue.address}, {venue.city}</span>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-700">Type</h4>
                  <p className="text-lg font-medium text-orange-700">{venue.type}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-700">Rooms</h4>
                  <p className="text-3xl font-bold text-orange-700">{venue.rooms}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-700">Halls</h4>
                  <p className="text-3xl font-bold text-orange-700">{venue.halls}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-700">Booking Fee</h4>
                  <p className="text-3xl font-bold text-orange-700">₹{venue.bookingPay}</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FaParking className={venue.parking.available ? "text-orange-600" : "text-gray-400"} />
                  <span className="text-gray-700 font-medium">Parking {venue.parking.available ? "Available" : "Not Available"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUtensils className={venue.food.providedByVenue ? "text-orange-600" : "text-gray-400"} />
                  <span className="text-gray-700 font-medium">Food Service {venue.food.providedByVenue ? "Available" : "Not Available"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaPaintBrush className={venue.decoration.providedByVenue ? "text-orange-600" : "text-gray-400"} />
                  <span className="text-gray-700 font-medium">Decoration Service {venue.decoration.providedByVenue ? "Available" : "Not Available"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaMoneyBill className={venue.cancellation ? "text-orange-600" : "text-gray-400"} />
                  <span className="text-gray-700 font-medium">Cancellation {venue.cancellation ? "Available" : "Not Available"}</span>
                </div>
              </div>
            </div>

            {/* Events and Amenities Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Events & Amenities</h3>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Preferred Events</h4>
                <div className="flex flex-wrap gap-2">
                  {venue.events.map((event, index) => (
                    <span key={index} className="bg-orange-100 text-orange-900 px-4 py-2 rounded-full text-sm font-medium">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
              {venue.amenities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {venue.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                      <FaCheck className="text-green-600" />
                      <span className="text-gray-800">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              )}
              {venue.restrictions.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Restrictions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {venue.restrictions.map((restriction, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                      <FaXmark className="text-red-600" />
                      <span className="text-gray-800">{restriction}</span>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Description Card */}

          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Pricing Card with improved styling */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Pricing</h3>
              <div className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Without Food</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Morning</span>
                      <span className="font-bold text-orange-800">₹{venue.withoutFoodRent.morning}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Evening</span>
                      <span className="font-bold text-orange-800">₹{venue.withoutFoodRent.evening}</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-bold">
                      <span>Full Day</span>
                      <span className="text-orange-900">₹{venue.withoutFoodRent.fullday}</span>
                    </div>
                  </div>
                </div>

                {venue.food.providedByVenue && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-3">With Food</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Morning</span>
                        <span className="font-bold text-orange-800">₹{venue.withFoodRent.morning}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Evening</span>
                        <span className="font-bold text-orange-800">₹{venue.withFoodRent.evening}</span>
                      </div>
                      <div className="flex justify-between text-gray-900 font-bold">
                        <span>Full Day</span>
                        <span className="text-orange-900">₹{venue.withFoodRent.fullday}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card */}
            {/* <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Owner</h3>
              <div className="space-y-4">
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <FaPhone className="mr-3 text-orange-600" />
                  <span className="font-medium text-gray-800">{venue.owner.phone}</span>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <FaEnvelope className="mr-3 text-orange-600" />
                  <span className="font-medium text-gray-800">{venue.owner.email}</span>
                </div>
              </div>
            </div> */}

            {/* Inquiry Button */}
            <button
              onClick={() => setShowavailabilityModal(true)}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 active:bg-orange-800 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <FaCalendarCheck className="text-lg" />
              <span className="text-base">Check availability</span>
            </button>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 active:bg-orange-800 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <FaQuestionCircle className="text-lg" />
              <span className="text-base">Make an Inquiry</span>
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white mt-5 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">About this Venue</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{venue.description}</p>
          </div> 
          {venue.cancellationPolicy && (
          <div className="bg-white mt-5 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{venue.cancellationPolicy}</p>
          </div>
          )}
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full mt-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Reviews & Ratings</h3>
                <div className="flex items-center mt-2">
                  {renderStars(venue.rating || 0)}
                  <span className="ml-2 text-gray-700 font-medium">
                    {venue.rating ? parseFloat(venue.rating).toFixed(1) : "0"} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>
              <div>
                {!userReview ? (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <FaStar className="mr-2" />
                    Write a Review
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteReview(userReview._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
                    >
                      <FaTrash className="mr-2" />
                      Delete My Review
                    </button>
                  </div>
                )}
              </div>
            </div>

            {loadingReviews ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-orange-50 rounded-lg p-6 text-center">
                <p className="text-gray-700">No reviews yet. Be the first to review this venue!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xl mr-4">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex text-sm">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">· {formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-gray-700">{review.message}</p>
                      
                      {review.ownerReply && review.ownerReply.message && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                          <p className="font-medium text-gray-900 mb-1">Response from venue owner</p>
                          <p className="text-gray-700">{review.ownerReply.message}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(review.ownerReply.createdAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Inquiry Modal */}
      <Modal 
        show={showInquiryModal} 
        onClose={() => setShowInquiryModal(false)}
        size="md"
      >
        <Modal.Header className="text-gray-900 border-b border-gray-200 px-6 py-4">
          Make an Inquiry
        </Modal.Header>
        <Modal.Body className="px-6 py-6">
          <form onSubmit={handleInquirySubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Name</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Event Date</label>
              <DatePicker
                selected={inquiryForm.eventDate ? new Date(inquiryForm.eventDate) : null}
                onChange={(date) => setInquiryForm({ ...inquiryForm, eventDate: date.toISOString().split('T')[0] })}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select event date"
                required
                showPopperArrow={false}
                customInput={
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Select event date"
                  />
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Event Type</label>
              <select
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={inquiryForm.eventType}
                onChange={(e) => setInquiryForm({ ...inquiryForm, eventType: e.target.value })}
              >
                <option value="">Select event type</option>
                {venue.events.map((event, index) => (
                  <option key={index} value={event}>{event}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Message</label>
              <textarea
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                placeholder="Enter your message or any specific requirements"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => setShowInquiryModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaQuestionCircle className="mr-2 h-4 w-4" />
                    Submit Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* availability Check Modal */}
      <Modal
        show={showavailabilityModal}
        onClose={() => setShowavailabilityModal(false)}
        size="md"
      >
        <Modal.Header className="text-gray-900 border-b border-gray-200 px-6 py-4">
          Check availability
        </Modal.Header>
        <Modal.Body className="px-6 py-6">
          <form onSubmit={handleCheckavailability} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Select Date</label>
              <DatePicker
                selected={availabilityForm.date}
                onChange={(date) => setavailabilityForm({ ...availabilityForm, date })}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a date"
                required
                showPopperArrow={false}
                customInput={
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Select a date"
                  />
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Select Time Slot</label>
              <select
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={availabilityForm.timeslot}
                onChange={(e) => setavailabilityForm({ ...availabilityForm, timeslot: e.target.value })}
              >
                <option value="">Select time slot</option>
                <option value="0">Morning</option>
                <option value="1">Evening</option>
                <option value="2">Full Day</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => setShowavailabilityModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                Check availability
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onClose={handleCloseBookingModal}
        size="md"
      >
        <Modal.Header className="text-gray-900 border-b border-gray-200 px-6 py-4">
          Book Venue
        </Modal.Header>
        <Modal.Body className="px-6 py-6">
          <form onSubmit={handleBookVenue} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800 flex items-center">
                <FaCheck className="w-4 h-4 mr-2" />
                <span className="font-medium">Venue is available for booking!</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Date</label>
                <DatePicker
                  selected={bookingForm.date}
                  dateFormat="MMMM d, yyyy"
                  disabled
                  customInput={
                    <input
                      className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-gray-700 cursor-not-allowed"
                      readOnly
                    />
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Time Slot</label>
                <select
                  disabled
                  className="w-full rounded-lg bg-gray-50 border-gray-200 text-gray-700 h-10 px-3 cursor-not-allowed"
                  value={bookingForm.timeslot}
                >
                  <option value="0" className="text-gray-800">Morning</option>
                  <option value="1" className="text-gray-800">Evening</option>
                  <option value="2" className="text-gray-800">Full Day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Number of Guests <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-800 h-10 px-3"
                value={bookingForm.numberOfGuest}
                onChange={(e) => setBookingForm({ ...bookingForm, numberOfGuest: e.target.value })}
                placeholder="Enter number of guests"
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Selected Time:</span>
                  <span className="font-medium text-gray-800">
                    {bookingForm.timeslot === '2'
                      ? 'Full Day'
                      : bookingForm.timeslot === '1'
                        ? 'Evening'
                        : 'Morning'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Selected Date:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(bookingForm.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                  <span className="font-medium text-gray-800">Booking Fee:</span>
                  <span className="font-bold text-orange-800 text-lg">
                    ₹{venue.bookingPay}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={handleCloseBookingModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center"
              >
                <FaCalendarCheck className="w-4 h-4 mr-2" />
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Review Submission Modal */}
      <Modal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        size="md"
      >
        <Modal.Header className="text-gray-900 border-b border-gray-200 px-6 py-4">
          Write a Review
        </Modal.Header>
        <Modal.Body className="px-6 py-6">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Rating</label>
              <div className="flex space-x-1 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    {star <= newReview.rating ? (
                      <FaStar className="text-orange-500" />
                    ) : (
                      <FaRegStar className="text-orange-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Your Review</label>
              <textarea
                required
                rows={6}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={newReview.message}
                onChange={(e) => setNewReview({ ...newReview, message: e.target.value })}
                placeholder="Share your experience with this venue..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => setShowReviewModal(false)}
                disabled={reviewSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaStar className="mr-2 h-4 w-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        size="md"
      >
        <Modal.Header className="text-gray-900 border-b border-gray-200 px-6 py-4">
          Confirm Review Deletion
        </Modal.Header>
        <Modal.Body className="px-6 py-6">
          <div className="text-center mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Review?</h3>
            <p className="text-gray-500">
              Are you sure you want to delete your review? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-300"
              onClick={() => setShowDeleteConfirmModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center"
              onClick={confirmDeleteReview}
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Yes, Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VenueDetails;
