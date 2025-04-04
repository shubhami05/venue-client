import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/auth';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import VenueForm from '../../components/VenueForm';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Modal, Button } from 'flowbite-react';

const EditVenue = () => {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken } = useAuth();
  const venueId = location.state?.venueId;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!venueId) {
      toast.error('No venue selected for editing');
      navigate('/owner/venues');
      return;
    }

    fetchVenueDetails();
  }, [venueId]);

  const fetchVenueDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/owner/venue/fetch/${venueId}`);

      if (response.data.success) {
        setVenue(response.data.venue);
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

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/owner/venue/edit/${venueId}`,
        formData,
      );

      if (response.data.success) {
        toast.success('Venue updated successfully');
        setTimeout(() => {
          navigate('/owner/venues');
        }, 500);
      } else {
        toast.error(response.data.message || 'Failed to update venue');
      }
    } catch (error) {
      console.error('Error updating venue:', error);
      toast.error(error.response?.data?.message || 'Failed to update venue');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setShowModal(true);
  };

  const handleConfirmLeave = () => {
    setShowModal(false);
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

    <VenueForm
      initialData={venue}
      onSubmit={handleSubmit}
      isEditing={true}
    />

  );
};

export default EditVenue; 