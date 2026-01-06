'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerLayout from '@/components/shared/CustomerLayout';
import HotelCard from '@/components/ui/HotelCard';
import { getFavoriteHotels, removeFromFavorites } from '@/lib/api';
import { Heart, MapPin, Star, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Hotel {
  _id: string;
  name: string;
  location: {
    city: string;
    state?: string;
    country: string;
    address?: string;
  };
  images: Array<{
    url: string;
    publicId?: string;
  }>;
  category: string;
  rating: {
    average: number;
    count: number;
  };
}

const transformHotel = (hotel: any): Hotel => {
  return {
    _id: hotel._id,
    name: hotel.name,
    location: {
      city: hotel.location?.city || '',
      state: hotel.location?.state,
      country: hotel.location?.country || '',
      address: hotel.location?.address,
    },
    images: hotel.images || [],
    category: hotel.category || '',
    rating: {
      average: hotel.rating?.average || 0,
      count: hotel.rating?.count || 0,
    },
  };
};

export default function FavoritesPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFavoriteHotels();
      // Handle both array and object with hotels/favorites property
      const hotelsData = Array.isArray(response) 
        ? response 
        : response.hotels || response.favorites || response.data || [];
      const transformed = hotelsData.map(transformHotel);
      setHotels(transformed);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch favorite hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (hotelId: string) => {
    try {
      setRemovingId(hotelId);
      await removeFromFavorites(hotelId);
      // Remove from local state
      setHotels(prev => prev.filter(hotel => hotel._id !== hotelId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove from favorites');
    } finally {
      setRemovingId(null);
    }
  };

  const handleFavoriteToggle = (hotelId: string) => {
    handleRemoveFavorite(hotelId);
  };

  const getLocationString = (hotel: Hotel): string => {
    const parts = [
      hotel.location.city,
      hotel.location.state,
      hotel.location.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-charcoal-light">Loading favorites...</div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchFavorites}>Try Again</Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-charcoal">My Favorites</h1>
          </div>
          <p className="text-charcoal-light">
            {hotels.length === 0
              ? "Hotels you love will appear here"
              : `You have ${hotels.length} favorite hotel${hotels.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Favorites Grid */}
        {hotels.length === 0 ? (
          <div className="bg-ivory-light rounded-xl p-12 text-center shadow-card">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">No favorites yet</h3>
            <p className="text-charcoal-light mb-6">
              Start exploring hotels and add them to your favorites to save them for later!
            </p>
            <Button onClick={() => router.push('/customer/search')}>
              Explore Hotels
            </Button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.map((hotel) => {
                const mainImage = hotel.images?.[0]?.url || '/placeholder-hotel.jpg';
                const locationString = getLocationString(hotel);
                const isRemoving = removingId === hotel._id;

                return (
                  <div key={hotel._id} className="relative">
                    <HotelCard
                      id={hotel._id}
                      name={hotel.name}
                      location={locationString}
                      rating={hotel.rating.average}
                      image={mainImage}
                      isFavorite={true}
                      onFavorite={() => handleFavoriteToggle(hotel._id)}
                    />
                    {isRemoving && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
                        <div className="text-white font-medium">Removing...</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* List View Option (Alternative) - Uncomment if you want list view */}
            {/* 
            <div className="space-y-4">
              {hotels.map((hotel) => {
                const mainImage = hotel.images?.[0]?.url || '/placeholder-hotel.jpg';
                const locationString = getLocationString(hotel);
                const isRemoving = removingId === hotel._id;

                return (
                  <div
                    key={hotel._id}
                    className="bg-ivory-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <div className="flex gap-6">
                      <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={mainImage}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-charcoal mb-1">
                                {hotel.name}
                              </h3>
                              <div className="flex items-center text-sm text-charcoal-light mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                {locationString}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFavorite(hotel._id)}
                              disabled={isRemoving}
                              className="p-2 hover:bg-red-50 rounded-full transition-colors"
                              aria-label="Remove from favorites"
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-1 mb-4">
                            <Star className="w-5 h-5 fill-gold text-gold" />
                            <span className="text-sm font-medium text-charcoal">
                              {hotel.rating.average.toFixed(1)}
                            </span>
                            <span className="text-sm text-charcoal-light">
                              ({hotel.rating.count} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="primary"
                            onClick={() => router.push(`/customer/hotels/${hotel._id}`)}
                          >
                            View Hotel
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveFavorite(hotel._id)}
                            disabled={isRemoving}
                          >
                            {isRemoving ? 'Removing...' : 'Remove'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            */}
          </>
        )}
      </div>
    </CustomerLayout>
  );
}