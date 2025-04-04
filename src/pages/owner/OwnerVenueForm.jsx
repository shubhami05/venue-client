import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/auth';
import VenueForm from '../../components/VenueForm';

const OwnerVenueForm = () => {
    const navigate = useNavigate();
    const { userToken } = useAuth();

    const handleSubmit = async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BACKEND_URI}/api/owner/venue/send`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to add venue');
        }

        return response.data;
    };

    return (
        <VenueForm 
            onSubmit={handleSubmit}
            isEditing={false}
        />
    );
};

export default OwnerVenueForm;