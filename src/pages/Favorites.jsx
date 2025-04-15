import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VenueCard from '../components/VenueCard';
import Loader from '../components/Loader';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteVenues();
  }, []);

  const fetchFavoriteVenues = async () => {
    try {
      setLoading(true);
      // Get favorite venue IDs from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteVenues')) || [];
      
      if (favoriteIds.length === 0) {
        setFavoriteVenues([]);
        setLoading(false);
        return;
      }

      // Fetch details for each favorite venue
      const promises = favoriteIds.map(id => 
        axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/user/venue/fetch/${id}`)
      );

      const responses = await Promise.all(promises);
      const venues = responses
        .filter(response => response.data.success)
        .map(response => response.data.venue);

      setFavoriteVenues(venues);
    } catch (error) {
      console.error('Error fetching favorite venues:', error);
      toast.error('Failed to fetch favorite venues');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (venueId) => {
    try {   
      setLoading(true);
      // Update localStorage
      const favorites = JSON.parse(localStorage.getItem('favoriteVenues')) || [];
      const updatedFavorites = favorites.filter(id => id !== venueId);
      localStorage.setItem('favoriteVenues', JSON.stringify(updatedFavorites));
      
      // Update state immediately
      setFavoriteVenues(favoriteVenues.filter(venue => venue._id != venueId));
      window.location.reload();
      
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
    finally {
      setLoading(false); 
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 container mx-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Favorite Venues</h1>
        </div>

        {favoriteVenues.length === 0 ? (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <FaHeart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Favorite Venues Yet</h2>
            <p className="text-gray-300 mb-4">
              Start exploring venues and add them to your favorites by clicking the heart icon!
            </p>
            <button 
              className="bg-orange-500 hover:bg-orange-600 transition-colors font-bold text-white px-4 py-2 rounded-md" 
              onClick={() => navigate('/explore')}
            >
              Explore Venues
            </button>
          </div>
        ) : (
          <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {favoriteVenues.map(venue => (
              <VenueCard
                key={venue._id}
                id={venue._id}
                name={venue.name}
                city={venue.city}
                type={venue.type}
                image={venue.photos[0]}
                rating={venue.rating || 0}
                bookingPay={venue.bookingPay}
                food={venue.food?.providedByVenue}
                parking={venue.parking?.available}
                onRemoveFromFavorites={() => handleRemoveFromFavorites(venue._id)}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;