import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VenueForm from '../../components/VenueForm';
import Loader from '../../components/Loader';
import { toast } from 'react-hot-toast';

const OwnerVenueForm = () => {
    const [configData, setConfigData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/config`
                );

                console.log('API Response:', response.data);

                if (response.data.success) {
                    const config = response.data.config;
                    console.log('Config data received:', config);
                    
                    // Check if cities array exists and is valid
                    if (!config.cities || !Array.isArray(config.cities)) {
                        console.error('Cities data is missing or invalid:', config.cities);
                        // Initialize empty arrays if data is missing
                        config.cities = config.cities || [];
                        config.venueTypes = config.venueTypes || [];
                        config.eventTypes = config.eventTypes || [];
                        config.amenities = config.amenities || [];
                    }
                    
                    setConfigData(config);
                } else {
                    setError(response.data.message || 'Failed to fetch configuration data');
                }
            } catch (error) {
                console.error('Error fetching configuration:', error);
                setError('Failed to fetch configuration data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleSubmit = async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/venue/send`,
            formData
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to add venue');
        }

        return response.data;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Debug information about the configData
    console.log('Config data being passed to VenueForm:', {
        venueTypes: configData?.venueTypes || [],
        eventTypes: configData?.eventTypes || [],
        cities: configData?.cities || [],
        amenities: configData?.amenities || []
    });

    return (
        <div>
          

            <VenueForm
                onSubmit={handleSubmit}
                isEditing={false}
                venueTypes={configData?.venueTypes || []}
                eventTypes={configData?.eventTypes || []}
                cities={configData?.cities || []}
                amenities={configData?.amenities || []}
            />
        </div>
    );
};

export default OwnerVenueForm;