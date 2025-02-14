import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'flowbite-react';
import { FaArrowCircleLeft } from 'react-icons/fa';

const VenueForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        ownerId: '',
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
            providedByVenue: false,
            foodMenu: ''
        },
        decoration: {
            outsideAllowed: false,
            providedByVenue: false
        },
        parking: {
            available: false,
            capacity: ''
        }
    });

    const [venueTypes, setVenueTypes] = useState([]);
    const [venueCities, setVenueCities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch venue types from an API in the future
        setVenueTypes(['Banquet Hall', 'Conference Center', 'Outdoor Venue', 'Hotel']);
        setVenueCities(['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Mumbai']);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    const handleReset = () => {
        setFormData({
            name: '',
            ownerId: '',
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
                providedByVenue: false,
                foodMenu: ''
            },
            decoration: {
                outsideAllowed: false,
                providedByVenue: false
            },
            parking: {
                available: false,
                capacity: ''
            }
        });
    };

    const handleBackClick = () => {
        setShowModal(true);
    };

    const handleConfirmLeave = () => {
        setShowModal(false);
        navigate('/owner/venues');
    };

    return (
        <div className="min-h-screen container py-10 bg-orange-50">
            <form onSubmit={handleSubmit} className="mx-auto p-4 bg-zinc-50 rounded-md shadow-lg">
                <div className='flex items-center gap-2'>
                    <button
                        type="button"
                        onClick={handleBackClick}
                    >
                        <FaArrowCircleLeft className='h-8 w-8 bg-white text-orange-900 hover:bg-orange-900 hover:text-white transition-colors rounded-full mb-3' />
                    </button>
                    <h2 className="text-3xl text-orange-900 font-bold mb-4"> Venue Form</h2>
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
                            {venueCities.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
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
                            className="mt-1 mr-2 text-white"
                        />
                        <label className="block text-gray-700 font-semibold">Cancellation Policy</label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Other Facilities <span className='text-sm '>(Type and press ENTER)</span></label>

                        <div className="flex flex-wrap items-center">
                            {formData.otherFacilities.map((facility, index) => (
                                <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                                    {facility}
                                    <button type="button" onClick={() => removeTag(index, 'otherFacilities')} className="ml-1 text-red-500">x</button>
                                </span>
                            ))}
                            <input
                                type="text"
                                onKeyDown={(e) => handleTagChange(e, 'otherFacilities')}
                                className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Restrictions <span className='text-sm '>(Type and press ENTER)</span></label>
                        <div className="flex flex-wrap items-center">
                            {formData.restrictions.map((restriction, index) => (
                                <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                                    {restriction}
                                    <button type="button" onClick={() => removeTag(index, 'restrictions')} className="ml-1 text-red-500">x</button>
                                </span>
                            ))}
                            <input
                                type="text"
                                onKeyDown={(e) => handleTagChange(e, 'restrictions')}
                                className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Photos</label>
                        <input
                            type="file"
                            name="photos"
                            onChange={handleChange}
                            multiple
                            className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md  focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Events <span className='text-sm '>(Type and press ENTER)</span></label>
                        <div className="flex flex-wrap items-center">
                            {formData.events.map((event, index) => (
                                <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                                    {event}
                                    <button type="button" onClick={() => removeTag(index, 'events')} className="ml-1 text-red-500">x</button>
                                </span>
                            ))}
                            <input
                                type="text"
                                onKeyDown={(e) => handleTagChange(e, 'events')}
                                className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                            />
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
                            className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-24 pl-2"
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

                    {formData.food.providedByVenue && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Food Menu</label>
                            <input
                                type="file"
                                name="foodMenu"
                                onChange={(e) => handleNestedChange(e, 'food')}
                                className="mt-1 block w-full shadow-md border-gray-300 bg-white rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 h-8 pl-2"
                            />
                        </div>
                    )}
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

                <div className="flex justify-between">
                    <button type="submit" className="w-1/2 font-semibold bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-all">
                        Submit
                    </button>
                    <button type="button" onClick={handleReset} className="w-1/2 font-semibold bg-zinc-600 text-white py-2 rounded-md transition-all hover:bg-zinc-700 ml-2">
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