import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'flowbite-react';
import { FaArrowCircleLeft, FaPlusCircle } from 'react-icons/fa';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

const VenueForm = ({ 
  initialData, 
  onSubmit, 
  isEditing = false,
  venueTypes = [],
  eventTypes = [],
  cities = [],
  amenities = []
}) => {
  // Add debugging logs
  console.log('VenueForm Props:', { venueTypes, eventTypes, cities, amenities });
  
  const navigate = useNavigate();
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

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [customEvent, setCustomEvent] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');

  // Default amenities list if none provided
  const defaultAmenitiesList = [
    'Parking',
    'WiFi',
    'Air Conditioning',
    'Sound System',
    'Catering Service',
    'Stage',
    'Security',
    'Restrooms'
  ];

  // Use provided amenities or default list
  const amenitiesList = amenities.length > 0 ? amenities : defaultAmenitiesList;
  
  useEffect(() => {
    // console.log(initialData);  
    if (initialData) {
      // Initialize form data
      setFormData({
        name: initialData.name || '',
        type: initialData.type || '',
        bookingPay: initialData.bookingPay || '',
        city: initialData.city || '',
        address: initialData.address || '',
        rooms: initialData.rooms || '',
        halls: initialData.halls || '',
        locationURL: initialData.locationURL || '',
        cancellationPolicy: initialData.cancellationPolicy || '',
        events: initialData.events || [],
        food: initialData.food || {
          outsideAllowed: false,
          providedByVenue: false
        },
        decoration: initialData.decoration || {
          outsideAllowed: false,
          providedByVenue: false
        },
        amenities: initialData.amenities || [],
        description: initialData.description || '',
        price: initialData.price || '',
        photos: initialData.photos || [],
        withoutFoodRent: initialData.withoutFoodRent || {
          morning: '',
          evening: '',
          fullday: ''
        },
        withFoodRent: initialData.withFoodRent || {
          morning: '',
          evening: '',
          fullday: ''
        },
        parking: initialData.parking || {
          available: false,
          capacity: ''
        },
        rules: initialData.rules || '',
        cancellation: initialData.cancellation || false,
        otherFacilities: initialData.otherFacilities || [],
        restrictions: initialData.restrictions || []
      });

      // Initialize images state with existing images
      if (initialData.photos && initialData.photos.length > 0) {
        setImages(initialData.photos.map(image => ({
          file: null,
          preview: image,
          isExisting: true
        })));
      }
    }
  }, [initialData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToastId = toast.loading(isEditing ? 'Updating venue...' : 'Adding venue...');

    try {
      const formDataToSend = new FormData();

      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'photos' && key !== 'images') {
          if (typeof formData[key] === 'object') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Add new images
      images.forEach((image) => {
        if (image.file) {
          formDataToSend.append('images', image.file);
        }
      });

      // Add existing images that weren't removed
      const remainingImages = images
        .filter(img => img.isExisting && !removedImages.includes(img.preview))
        .map(img => img.preview);
      formDataToSend.append('existingImages', JSON.stringify(remainingImages));

      // Add removed images
      formDataToSend.append('removedImages', JSON.stringify(removedImages));

      await onSubmit(formDataToSend);
      toast.success(isEditing ? 'Venue updated successfully!' : 'Venue added successfully!', { id: loadingToastId });
      setTimeout(() => {
        navigate('/owner/venues');
      }, 500);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} venue. Please try again.`,
        { id: loadingToastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // Clean up image previews
    if (isEditing) {
      // If editing, reset to initial data
      setFormData(initialData);
      setImages(initialData.photos.map(image => ({
        preview: image,
        file: null,
        isExisting: true
      })));
    } else {
      // If creating new, reset to empty form
      images.forEach(image => {
        if (image.preview.startsWith('blob:')) {
          URL.revokeObjectURL(image.preview);
        }
      });

      setFormData({
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

      setImages([]);
    }
    setSelectedEvent('');
    setCustomEvent('');
    setRemovedImages([]);

    toast.success('Form reset successfully');
  };

  const handleBackClick = () => {
    setShowModal(true);
  };

  const handleConfirmLeave = () => {
    setShowModal(false);
    navigate('/owner/venues');
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove.isExisting) {
      setRemovedImages([...removedImages, imageToRemove.preview]);
    }
    const newImages = [...images];
    if (newImages[index].preview.startsWith('blob:')) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="min-h-screen container py-10 bg-orange-50">
      {/* Debugging section */}
     

      <form onSubmit={handleSubmit} className="mx-auto p-4 bg-zinc-50 rounded-md shadow-lg">
        <div className='flex items-center gap-2'>
          <button
            type="button"
            onClick={handleBackClick}
          >
            <FaArrowCircleLeft className='h-8 w-8 bg-white text-orange-900 hover:bg-orange-900 hover:text-white transition-colors rounded-full mb-3' />
          </button>
          <h2 className="text-3xl text-orange-900 font-bold mb-4">{isEditing ? 'Edit Venue' : 'Add New Venue'}</h2>
        </div>

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
              {venueTypes.map((type, index) => (
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
              {cities.map((city, index) => (
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

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Events</label>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <select
                  value={selectedEvent}
                  onChange={handleEventSelect}
                  className="flex-grow shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-10 pl-2"
                >
                  <option value="">Select an event type</option>
                  {eventTypes.map((event, index) => (
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
                      className="ml-1 text-red-500"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

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

        {/* Images Section */}
        <h3 className="text-xl font-semibold mb-2">Venue Images</h3>
        <div className="mb-6">
          <ImageUpload
            images={images}
            prevImages={initialData?.photos}
            setImages={setImages}
            maxImages={8}
            maxSizeInMB={5}
            onRemoveImage={handleRemoveImage}
          />
        </div>

        {/* Rules and Policies Section */}
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

        {/* Amenities Section */}
        <h3 className="text-xl font-semibold mb-2">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {amenitiesList.map((amenity) => (
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
                      className="ml-1 text-red-500"
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
                      className="ml-1 text-red-500"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className={`w-1/2 font-semibold bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update Venue' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-1/2 font-semibold bg-zinc-600 text-white py-2 rounded-md transition-all hover:bg-zinc-700 ml-2"
            disabled={isSubmitting}
          >
            Reset
          </button>
        </div>
      </form>

      <div className='flex justify-center items-center w-screen transition-all'>
        <Modal className='w-fit mx-auto bg-transparent ' show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>
            Confirm Navigation
          </Modal.Header>
          <Modal.Body>
            <p className='text-gray-800'>Are you sure you want to leave this page? Any unsaved changes will be lost.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color='red' onClick={handleConfirmLeave}>
              Yes, Leave
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default VenueForm;