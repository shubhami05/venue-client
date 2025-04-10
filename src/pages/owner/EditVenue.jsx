import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/auth';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Modal, Button } from 'flowbite-react';
import ImageUpload from '../../components/ImageUpload';
import ConfirmationModal from '../../components/ConfirmationModal';

const EditVenue = () => {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [configData, setConfigData] = useState({
    venueTypes: [],
    eventTypes: [],
    cities: [],
    amenities: []
  });
  const [formData, setFormData] = useState({
    name: '',
    status: 'pending',
    type: '',
    bookingPay: '',
    address: '',
    city: '',
    description: '',
    locationURL: '',
    rooms: 0,
    halls: 0,
    cancellation: false,
    otherFacilities: [],
    restrictions: [],
    photos: [],
    events: [],
    withoutFoodRent: {
      morning: '',
      evening: '',
      fullday: ''
    },
    withFoodRent: {
      morning: '',
      evening: '',
      fullday: ''
    },
    food: {
      outsideAllowed: false,
      providedByVenue: false
    },
    decoration: {
      outsideAllowed: false,
      providedByVenue: false
    },
    parking: {
      available: false,
      capacity: ''
    },
    amenities: [],
    rules: '',
    cancellationPolicy: ''
  });
  const [photos, setPhotos] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [customEvent, setCustomEvent] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken } = useAuth();
  const venueId = location.state?.venueId;
  const [showBackModal, setShowBackModal] = useState(false);

  useEffect(() => {
    if (!venueId) {
      toast.error('No venue selected for editing');
      navigate('/owner/venues');
      return;
    }

    fetchVenueDetails();
    fetchConfig();
  }, [venueId]);

  const fetchConfig = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/config`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const config = response.data.config;
        setConfigData({
          venueTypes: config.venueTypes || [],
          eventTypes: config.eventTypes || [],
          cities: config.cities || [],
          amenities: config.amenities || []
        });
      } else {
        setError(response.data.message || 'Failed to fetch configuration data');
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);
      setError('Failed to fetch configuration data. Please try again later.');
    }
  };

  const fetchVenueDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/venue/fetch/${venueId}`,
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        const venueData = response.data.venue;
        console.log(venueData)
        setVenue(venueData);
        setFormData({
          name: venueData.name || '',
          type: venueData.type || '',
          bookingPay: venueData.bookingPay || '',
          city: venueData.city || '',
          address: venueData.address || '',
          rooms: venueData.rooms || '',
          halls: venueData.halls || '',
          locationURL: venueData.locationURL || '',
          cancellationPolicy: venueData.cancellationPolicy || '',
          events: venueData.events || [],
          food: venueData.food || {
            outsideAllowed: false,
            providedByVenue: false
          },
          decoration: venueData.decoration || {
            outsideAllowed: false,
            providedByVenue: false
          },
          amenities: venueData.amenities || [],
          description: venueData.description || '',
          price: venueData.price || '',
          photos: venueData.photos || [],
          withoutFoodRent: venueData.withoutFoodRent || {
            morning: '',
            evening: '',
            fullday: ''
          },
          withFoodRent: venueData.withFoodRent || {
            morning: '',
            evening: '',
            fullday: ''
          },
          parking: venueData.parking || {
            available: false,
            capacity: ''
          }, 
          rules: venueData.rules || '',
          cancellation: venueData.cancellation || false,
          otherFacilities: venueData.otherFacilities || [],
          restrictions: venueData.restrictions || []
        });

        if (venueData.photos && venueData.photos.length > 0) {
          setPhotos(venueData.photos.map(image => ({
            file: null,
            preview: image,
            isExisting: true
          })));
        }
      } else {
        setError(response.data.message || 'Failed to fetch venue details');
        toast.error(response.data.message || 'Failed to fetch venue details');
      }
    } catch (error) {
      console.error('Error fetching venue details:', error);
      setError(error.response?.data?.message || 'Failed to fetch venue details');
      toast.error(error.response?.data?.message || 'Failed to fetch venue details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      if (name === 'amenities') {
        setFormData({
          ...formData,
          amenities: checked
            ? [...formData.amenities, value]
            : formData.amenities.filter(item => item !== value)
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files }); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNestedChange = (e, parent) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [name]: checked
        }
      });
    } else if (type === 'file') {
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [name]: files
        }
      });
    } else {
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [name]: value
        }
      });
    }
  };

  const handleEventSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedEvent(selectedValue);

    if (selectedValue && selectedValue !== 'custom') {
      if (!formData.events.includes(selectedValue)) {
        setFormData({
          ...formData,
          events: [...formData.events, selectedValue]
        });
      } else {
        toast.error('This event is already added');
      }
      setSelectedEvent('');
    }
  };

  const handleAddCustomEvent = () => {
    if (customEvent.trim()) {
      if (!formData.events.includes(customEvent.trim())) {
        setFormData({
          ...formData,
          events: [...formData.events, customEvent.trim()]
        });
        setCustomEvent('');
      } else {
        toast.error('This event is already added');
      }
    }
  };

  const handleTagChange = (e, field) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      setFormData({
        ...formData,
        [field]: [...formData[field], e.target.value]
      });
      e.target.value = '';
    }
  };

  const removeTag = (index, field) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleRemovePhoto = (index) => {
    const photoToRemove = photos[index];
    if (photoToRemove.isExisting) {
        // If it's an existing photo, add it to removedPhotos array
        setRemovedPhotos(prev => [...prev, photoToRemove.preview]);
    } else if (photoToRemove.preview.startsWith('blob:')) {
        // If it's a new photo with blob URL, revoke it
        URL.revokeObjectURL(photoToRemove.preview);
    }
    
    // Remove the photo from photos array
    setPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos.splice(index, 1);
        return newPhotos;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToastId = toast.loading('Updating venue...');

    try {
      // Create FormData for files
      const formDataToSend = new FormData();

      // Handle photos
      const existingPhotos = photos
        .filter(photo => photo.isExisting)
        .map(photo => photo.preview);
      
      const newPhotos = photos
        .filter(photo => !photo.isExisting && photo.file)
        .map(photo => photo.file);

      // Add existing photos to formData
      if (existingPhotos.length > 0) {
        formDataToSend.append('existingPhotos', JSON.stringify(existingPhotos));
      }
      

      // Add new photos to formData
      newPhotos.forEach(photo => {
        if (photo instanceof File) {
          formDataToSend.append('photos', photo);
        }
      });

      // Add removed photos to formData
      if (removedPhotos.length > 0) {
        console.log('rem',removedPhotos)
        formDataToSend.append('removedPhotos', JSON.stringify(removedPhotos));
      }

      // Add all form fields to formData
      Object.keys(formData).forEach(key => {
        if (key !== 'photos') {
          if (typeof formData[key] === 'object') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Log the form data for debugging
      // console.log('FormData contents:');
      // for (let pair of formDataToSend.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/venue/edit/${venueId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success('Venue updated successfully!', { id: loadingToastId });
        setTimeout(() => {
          navigate('/owner/venues');
        }, 500);
      } else {
        throw new Error(response.data.message || 'Failed to update venue');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || 'Failed to update venue. Please try again.',
        { id: loadingToastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    setShowBackModal(true);
  };

  const handleConfirmLeave = () => {
    setShowBackModal(false);
    navigate('/owner/venues');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-orange-50">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/owner/venues')}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Back to Venues
        </button>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-orange-50">
        <p className="text-gray-500 mb-4">Venue not found</p>
        <button
          onClick={() => navigate('/owner/venues')}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Back to Venues
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen container py-10 bg-orange-100">
      <form onSubmit={handleSubmit} className="mx-auto p-4 bg-zinc-50 rounded-md shadow-lg">
        <div className='flex gap-2'>
          <button
            type="button"
            onClick={handleBackClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 bg-white text-orange-900 hover:bg-orange-900 hover:text-white transition-colors rounded-full mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-3xl text-orange-900 font-bold mb-4">Edit Venue</h2>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Venue Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            >
              <option value="" disabled>Select Type</option>
              {configData.venueTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Pre-Booking Fees</label>
            <input
              type="number"
              name="bookingPay"
              value={formData.bookingPay}
              onChange={handleChange}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            >
              <option value="" disabled>Select City</option>
              {configData.cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Rooms</label>
            <input
              type="number"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Halls</label>
            <input
              type="number"
              name="halls"
              value={formData.halls}
              onChange={handleChange}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Location URL</label>
            <input
              type="text"
              name="locationURL"
              value={formData.locationURL}
              onChange={handleChange}
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="cancellation"
              checked={formData.cancellation}
              onChange={handleChange}
              className="mt-1 mr-2 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label className="block text-gray-700 font-semibold">Cancellation Policy</label>
          </div>
        </div>

        {/* Address and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-24 pl-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded border-gray-300 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 h-24 pl-2"
            />
          </div>
        </div>

        {/* Without Food Rent */}
        <h3 className="text-xl font-semibold mb-2">Without Food Rent</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Morning Rent</label>
            <input
              type="number"
              name="morning"
              value={formData.withoutFoodRent.morning}
              onChange={(e) => handleNestedChange(e, 'withoutFoodRent')}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Evening Rent</label>
            <input
              type="number"
              name="evening"
              value={formData.withoutFoodRent.evening}
              onChange={(e) => handleNestedChange(e, 'withoutFoodRent')}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Full Day Rent</label>
            <input
              type="number"
              name="fullday"
              value={formData.withoutFoodRent.fullday}
              onChange={(e) => handleNestedChange(e, 'withoutFoodRent')}
              required
              className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
            />
          </div>
        </div>

        {/* Food Details */}
        <h3 className="text-xl font-semibold mb-2">Food Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="outsideAllowed"
              checked={formData.food.outsideAllowed}
              onChange={(e) => handleNestedChange(e, 'food')}
              className="mt-1 mr-2 text-white"
            />
            <label className="block text-gray-700 font-semibold">Outside Allowed</label>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="providedByVenue"
              checked={formData.food.providedByVenue}
              onChange={(e) => handleNestedChange(e, 'food')}
              className="mt-1 mr-2 text-white"
            />
            <label className="block text-gray-700 font-semibold">Provided by Venue</label>
          </div>
        </div>

        {/* With Food Rent (Conditional) */}
        {formData.food.providedByVenue && (
          <>
            <h3 className="text-xl font-semibold mb-2">With Food Rent</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Morning Rent</label>
                <input
                  type="number"
                  name="morning"
                  value={formData.withFoodRent.morning}
                  onChange={(e) => handleNestedChange(e, 'withFoodRent')}
                  className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Evening Rent</label>
                <input
                  type="number"
                  name="evening"
                  value={formData.withFoodRent.evening}
                  onChange={(e) => handleNestedChange(e, 'withFoodRent')}
                  className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Full Day Rent</label>
                <input
                  type="number"
                  name="fullday"
                  value={formData.withFoodRent.fullday}
                  onChange={(e) => handleNestedChange(e, 'withFoodRent')}
                  className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                />
              </div>
            </div>
          </>
        )}

        {/* Decoration Details */}
        <h3 className="text-xl font-semibold mb-2">Decoration Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="outsideAllowed"
              checked={formData.decoration.outsideAllowed}
              onChange={(e) => handleNestedChange(e, 'decoration')}
              className="mt-1 mr-2 text-white"
            />
            <label className="block text-gray-700 font-semibold">Outside Allowed</label>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="providedByVenue"
              checked={formData.decoration.providedByVenue}
              onChange={(e) => handleNestedChange(e, 'decoration')}
              className="mt-1 mr-2 text-white"
            />
            <label className="block text-gray-700 font-semibold">Provided by Venue</label>
          </div>
        </div>

        {/* Parking Details */}
        <h3 className="text-xl font-semibold mb-2">Parking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.parking.available}
              onChange={(e) => handleNestedChange(e, 'parking')}
              className="mt-1 mr-2 text-white"
            />
            <label className="block text-gray-700 font-semibold">Parking Available</label>
          </div>

          {formData.parking.available && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.parking.capacity}
                onChange={(e) => handleNestedChange(e, 'parking')}
                className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
              />
            </div>
          )}
        </div>

        {/* Events Section */}
        <h3 className="text-xl font-semibold mb-2">Events</h3>
        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <select
                value={selectedEvent}
                onChange={handleEventSelect}
                className="flex-grow shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-10 pl-2"
              >
                <option value="">Select an event type</option>
                {configData.eventTypes.map((event, index) => (
                  <option key={index} value={event}>{event}</option>
                ))}
                <option value="custom">+ Add Custom Event</option>
              </select>
            </div>

            {selectedEvent === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customEvent}
                  onChange={(e) => setCustomEvent(e.target.value)}
                  placeholder="Enter custom event type"
                  className="flex-grow shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-10 pl-2"
                />
                <button
                  type="button"
                  onClick={handleAddCustomEvent}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 h-10 flex items-center"
                >
                  <FaPlusCircle className="mr-1" /> Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center mt-2">
              {formData.events.map((event, index) => (
                <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center">
                  {event}
                  <button
                    type="button"
                    onClick={() => removeTag(index, 'events')}
                    className="ml-1 bg-inherit text-red-500"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Venue Photos</h3>
          <ImageUpload
            photos={photos}
            prevPhotos={venue.photos}
            setPhotos={setPhotos}
            maxPhotos={8}
            maxSizeInMB={5}
            onRemovePhoto={handleRemovePhoto}
          />
        </div>

        {/* Rules and Policies */}
        <h3 className="text-xl font-semibold mb-2">Rules and Policies</h3>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue Rules</label>
            <textarea
              name="rules"
              rows={3}
              value={formData.rules}
              onChange={handleChange}
              className="mt-1 block w-full rounded border-gray-300 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Enter venue rules and guidelines..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
            <textarea
              name="cancellationPolicy"
              rows={3}
              value={formData.cancellationPolicy}
              onChange={handleChange}
              className="mt-1 block w-full rounded border-gray-300 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Enter cancellation policy..."
            />
          </div>
        </div>

        {/* Amenities */}
        <h3 className="text-xl font-semibold mb-2">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {configData.amenities.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>

        {/* Other Facilities and Restrictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Other Facilities</label>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  onKeyDown={(e) => handleTagChange(e, 'otherFacilities')}
                  className="flex-grow shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-10 pl-2"
                  placeholder="Add facility and press Enter"
                />
              </div>
              <div className="flex flex-wrap items-center mt-2">
                {formData.otherFacilities.map((facility, index) => (
                  <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center">
                    {facility}
                    <button
                      type="button"
                      onClick={() => removeTag(index, 'otherFacilities')}
                      className="ml-1 bg-inherit text-red-500"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Restrictions</label>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  onKeyDown={(e) => handleTagChange(e, 'restrictions')}
                  className="flex-grow shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-10 pl-2"
                  placeholder="Add restriction and press Enter"
                />
              </div>
              <div className="flex flex-wrap items-center mt-2">
                {formData.restrictions.map((restriction, index) => (
                  <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center">
                    {restriction}
                    <button
                      type="button"
                      onClick={() => removeTag(index, 'restrictions')}
                      className="ml-1 bg-inherit text-red-500"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className={`w-1/2 font-semibold bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Venue'}
          </button>
          <button
            type="button"
            onClick={handleBackClick}
            className="w-1/2 font-semibold bg-zinc-600 text-white py-2 rounded-md transition-all hover:bg-zinc-700 ml-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showBackModal}
        onClose={() => setShowBackModal(false)}
        onConfirm={handleConfirmLeave}
        title="Confirm Leave"
        message="Are you sure you want to leave? Any unsaved changes will be lost."
        confirmText="Yes, Leave"
        cancelText="No, Stay"
        type='danger'
      />
    </div>
  );
};

export default EditVenue; 