import React, { useState, useEffect } from 'react';
import { MdSave, MdDelete, MdAdd, MdInfo, MdSearch, MdClose } from 'react-icons/md';
import { FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loader from '../../components/Loader';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({

    // Booking Settings
    maxBookingsPerDay: 10,
    bookingLeadTime: 24,
    cancellationPeriod: 48,

    // Commission Settings
    commissionRate: 10,
    minimumPayout: 100,
    payoutSchedule: 'weekly',

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Security Settings
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorAuth: false
  });

  // Config
  const [config, setConfig] = useState({
    venueTypes: [],
    eventTypes: [],
    cities: [],
    featuredVenues: [],
    amenities: []
  });

  // New item state
  const [newItem, setNewItem] = useState({
    venueType: '',
    eventType: '',
    city: '',
    amenity: ''
  });

  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [loadingVenues, setLoadingVenues] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchVenues();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/config`
      );

      if (response.data.success) {
        setConfig(response.data.config);
      } else {
        toast.error(response.data.message || 'Failed to load configuration');
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);
      toast.error('Error loading configuration');
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      setLoadingVenues(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/venue/fetch`
      );
      if (response.data.success) {
        setVenues(response.data.venues);
      } else {
        toast.error(response.data.message || 'Failed to fetch venues');
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Failed to fetch venues');
    } finally {
      setLoadingVenues(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = (type) => {
    if (!newItem[type] || !newItem[type].trim()) {
      toast.error(`Please enter a ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return;
    }

    // Map the input field names to the config array names
    const typeToArrayMap = {
      venueType: 'venueTypes',
      eventType: 'eventTypes',
      city: 'cities',
      amenity: 'amenities'
    };

    const arrayName = typeToArrayMap[type];
    
    setConfig(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem[type]]
    }));

    setNewItem(prev => ({
      ...prev,
      [type]: ''
    }));

    
  };

  const removeItem = (type, index) => {
    setConfig(prev => ({
      ...prev,
      [type]: [...prev[type].slice(0, index), ...prev[type].slice(index + 1)]
    }));
  };

  const addFeaturedVenue = async () => {
    if (!selectedVenue) {
      toast.error('Please select a venue');
      return;
    }
    try {
      // Add the venue ID directly to the featuredVenues array
      setConfig(prev => ({
        ...prev,
        featuredVenues: [...prev.featuredVenues, selectedVenue]
      }));

      setSelectedVenue('');
    } catch (error) {
      console.error('Error adding featured venue:', error);
      toast.error('Failed to add featured venue');
    }
  };

  const removeFeaturedVenue = (index) => {
    setConfig(prev => ({
      ...prev,
      featuredVenues: [...prev.featuredVenues.slice(0, index), ...prev.featuredVenues.slice(index + 1)]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Prepare the data to send
      const dataToSend = {
        ...config,
        featuredVenues: config.featuredVenues // This should be an array of venue IDs
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/config/update`,
        dataToSend
      );

      if (response.data.success) {
        toast.success('Settings saved successfully');
        // Update config with the response data
        fetchConfig();
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };
  // Helper function to get venue details
  const getVenueDetails = (venueId) => {
    return venues.find(v => v._id === venueId) || null;
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Website Configuration</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center transition duration-300 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <MdSave className="mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              These settings control the available options throughout the website. Changes will affect venue creation, search filters, and more.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Settings */}
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Venue Types */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <MdInfo className="mr-2 text-orange-500" />
              Venue Types
            </h2>
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="venueType"
                  value={newItem.venueType}
                  onChange={handleNewItemChange}
                  placeholder="Add new venue type"
                  className="flex-1 px-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500  bg-white"
                />
                <button
                  type="button"
                  disabled={!newItem.venueType}
                  onClick={() => addItem('venueType')}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdAdd className="mr-1" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
              {config.venueTypes.map((type, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center shadow-sm">
                  <span className="mr-2 text-gray-800">{type}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('venueTypes', index)}
                    className="text-gray-500 hover:text-red-600 transition duration-300"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
              {config.venueTypes.length === 0 && (
                <div className="text-gray-500 italic">No venue types added yet</div>
              )}
            </div>
          </div>

          {/* Event Types */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <MdInfo className="mr-2 text-orange-500" />
              Event Types
            </h2>
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="eventType"
                  value={newItem.eventType}
                  onChange={handleNewItemChange}
                  placeholder="Add new event type"
                    className="flex-1 px-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500  bg-white"
                />
                <button
                  type="button"
                  disabled={!newItem.eventType}
                  onClick={() => addItem('eventType')}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdAdd className="mr-1" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
              {config.eventTypes.map((type, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center shadow-sm">
                  <span className="mr-2 text-gray-800">{type}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('eventTypes', index)}
                    className="text-gray-500 hover:text-red-600 transition duration-300"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
              {config.eventTypes.length === 0 && (
                <div className="text-gray-500 italic">No event types added yet</div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <MdInfo className="mr-2 text-orange-500" />
              Amenities
            </h2>
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="amenity"
                  value={newItem.amenity}
                  onChange={handleNewItemChange}
                  placeholder="Add new amenity"
                  className="flex-1 px-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500  bg-white"
                />
                <button
                  type="button"
                  disabled={!newItem.amenity}
                  onClick={() => addItem('amenity')}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdAdd className="mr-1" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
              {config.amenities.map((amenity, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center shadow-sm">
                  <span className="mr-2 text-gray-800">{amenity}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('amenities', index)}
                    className="text-gray-500 hover:text-red-600 transition duration-300"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
              {config.amenities.length === 0 && (
                <div className="text-gray-500 italic">No amenities added yet</div>
              )}
            </div>
          </div>

          {/* Cities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <MdInfo className="mr-2 text-orange-500" />
              Cities
            </h2>
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="city"
                  value={newItem.city}
                  onChange={handleNewItemChange}
                  placeholder="Add new city"
                  className="flex-1 px-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500  bg-white"
                />
                <button
                  type="button"
                  disabled={!newItem.city}
                  onClick={() => addItem('city')}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdAdd className="mr-1" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
              {config.cities.map((city, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center shadow-sm">
                  <span className="mr-2 text-gray-800">{city}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('cities', index)}
                    className="text-gray-500 hover:text-red-600 transition duration-300"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
              {config.cities.length === 0 && (
                <div className="text-gray-500 italic">No cities added yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Venues Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <MdInfo className="mr-2 text-orange-500" />
            Featured Venues
          </h2>
          
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                disabled={loadingVenues}
              >
                <option value="">Select a venue to feature</option>
                {venues
                  .filter(venue => !config.featuredVenues.includes(venue._id))
                  .map(venue => (
                    <option key={venue._id} value={venue._id}>
                      {venue.name} - {venue.city} ({venue.type})
                    </option>
                  ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              onClick={addFeaturedVenue}
              disabled={!selectedVenue || loadingVenues}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center justify-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
            >
              {loadingVenues ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <MdAdd className="mr-1" />
                  Add
                </>
              )}
            </button>
          </div>

          {/* Featured Venues List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.featuredVenues.map((venueId, index) => {
              const venue = getVenueDetails(venueId);
              if (!venue) return null;
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm relative group hover:shadow-md transition duration-300">
                  <button
                    type="button"
                    onClick={() => removeFeaturedVenue(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <MdClose />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
                      <MdInfo className="text-orange-500 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{venue.name}</h3>
                      <p className="text-sm text-gray-600">{venue.city}</p>
                      <p className="text-xs text-gray-500">{venue.type}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {config.featuredVenues.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <MdInfo className="mx-auto text-4xl text-gray-400 mb-2" />
                <p>No featured venues added yet</p>
                <p className="text-sm mt-1">Select a venue from the dropdown above to feature it</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings; 