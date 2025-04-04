import React, { useEffect, useRef } from 'react';
import { MdLocationOn, MdPerson, MdClose, MdPhone, MdEmail, MdAccessTime, MdEvent, MdCategory, MdHouse } from 'react-icons/md';
import Loader from './Loader';
import toast from 'react-hot-toast';

const VenueDetailsModal = ({ venue, onClose, loading }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!venue && !loading) {
    toast.error('No venue details found');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader />
              <p className="mt-4 text-gray-600">Loading venue details...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose className="h-6 w-6" />
                </button>
              </div>

              {/* Venue Images */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Venue Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.photos?.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Venue ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Owner Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MdPerson className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{venue.owner?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <MdEmail className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{venue.owner?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <MdPhone className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{venue.owner?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Venue Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Venue Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MdLocationOn className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{(venue.address + ', ' + venue.city) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <MdCategory className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{venue.type || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <MdHouse className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{venue.rooms + ' Rooms, ' + venue.halls + ' Halls'}</span>
                  </div>
                  {venue.locationURL && (
                    <div className="flex items-center">
                      <MdLocationOn className="h-5 w-5 text-gray-500 mr-2" />
                      <a 
                        href={venue.locationURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Location
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {venue.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{venue.description}</p>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Without Food</p>
                    <div className="space-y-1">
                      <p className="text-sm">Morning: ₹{venue.withoutFoodRent?.morning || 'N/A'}</p>
                      <p className="text-sm">Evening: ₹{venue.withoutFoodRent?.evening || 'N/A'}</p>
                      <p className="font-semibold">Full Day: ₹{venue.withoutFoodRent?.fullday || 'N/A'}</p>
                    </div>
                  </div>
                  {venue.food?.providedByVenue && (
                    <div>
                      <p className="text-sm text-gray-500">With Food</p>
                      <div className="space-y-1">
                        <p className="text-sm">Morning: ₹{venue.withFoodRent?.morning || 'N/A'}</p>
                        <p className="text-sm">Evening: ₹{venue.withFoodRent?.evening || 'N/A'}</p>
                        <p className="font-semibold">Full Day: ₹{venue.withFoodRent?.fullday || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Food & Decoration */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Food & Decoration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Food Options</p>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center">
                        Outside Food: 
                        <span className={`ml-2 ${venue.food?.outsideAllowed ? 'text-green-600' : 'text-red-600'}`}>
                          {venue.food?.outsideAllowed ? '✓ Allowed' : '✕ Not Allowed'}
                        </span>
                      </p>
                      <p className="text-sm flex items-center">
                        Provided by Venue: 
                        <span className={`ml-2 ${venue.food?.providedByVenue ? 'text-green-600' : 'text-red-600'}`}>
                          {venue.food?.providedByVenue ? '✓ Yes' : '✕ No'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Decoration</p>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center">
                        Outside Decoration: 
                        <span className={`ml-2 ${venue.decoration?.outsideAllowed ? 'text-green-600' : 'text-red-600'}`}>
                          {venue.decoration?.outsideAllowed ? '✓ Allowed' : '✕ Not Allowed'}
                        </span>
                      </p>
                      <p className="text-sm flex items-center">
                        Provided by Venue: 
                        <span className={`ml-2 ${venue.decoration?.providedByVenue ? 'text-green-600' : 'text-red-600'}`}>
                          {venue.decoration?.providedByVenue ? '✓ Yes' : '✕ No'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parking */}
              {venue.parking && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Parking</h3>
                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      Available: 
                      <span className={`ml-2 ${venue.parking.available ? 'text-green-600' : 'text-red-600'}`}>
                        {venue.parking.available ? '✓ Yes' : '✕ No'}
                      </span>
                    </p>
                    {venue.parking.available && (
                      <p className="text-sm">Capacity: {venue.parking.capacity}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Events */}
              {venue.events && venue.events.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Suitable Events</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.events.map((event, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Facilities */}
              {venue.otherFacilities && venue.otherFacilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Other Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.otherFacilities.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Restrictions */}
              {venue.restrictions && venue.restrictions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Restrictions</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.restrictions.map((restriction, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {venue.rules && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Rules</h3>
                  <p className="text-gray-700">{venue.rules}</p>
                </div>
              )}

              {/* Cancellation Policy */}
              {venue.cancellationPolicy && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Cancellation Policy</h3>
                  <p className="text-gray-700">{venue.cancellationPolicy}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsModal; 