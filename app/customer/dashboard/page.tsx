'use client';

import CustomerLayout from '@/components/shared/CustomerLayout';
import MetricCard from '@/components/ui/MetricCard';
import HotelCard from '@/components/ui/HotelCard';
import { Calendar, MapPin, Heart, Star, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { getMyBookings, getFavoriteHotels, getHotels } from '@/lib/api';
import Button from '@/components/ui/Button';
import { Booking } from '@/types/booking';

// Consistent date formatter (MM/DD/YYYY format)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Helper to get hotel image
const getHotelImage = (hotel: any): string => {
  const placeholder = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';

  if (!hotel?.images || !Array.isArray(hotel.images) || hotel.images.length === 0) {
    return placeholder;
  }

  const firstImage = hotel.images[0];
  if (typeof firstImage === 'string') {
    return firstImage;
  }
  if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
    return firstImage.url || placeholder;
  }

  return placeholder;
};

// Helper to get location string
const getLocationString = (hotel: any): string => {
  if (!hotel?.location) return '';
  const parts = [
    hotel.location.city,
    hotel.location.state,
    hotel.location.country,
  ].filter(Boolean);
  return parts.join(', ');
};

interface BookingWithDetails extends Omit<Booking, 'hotel' | 'room'> {
  hotel?: {
    _id: string;
    name: string;
    location: {
      city: string;
      state?: string;
      country: string;
    };
    images?: Array<{ url: string }>;
  };
  room?: {
    _id: string;
    name: string;
    type: string;
  };
}

interface Hotel {
  _id: string;
  name: string;
  location: {
    city: string;
    state?: string;
    country: string;
  };
  images?: Array<{ url: string; publicId?: string }>;
  rating: {
    average: number;
    count: number;
  };
}

export default function CustomerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>([]);
  const [recommendedHotels, setRecommendedHotels] = useState<Hotel[]>([]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all data
  useEffect(() => {
    if (mounted) {
      fetchDashboardData();
    }
  }, [mounted]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [bookingsResponse, favoritesResponse, recommendedResponse] = await Promise.all([
        getMyBookings().catch(() => ({ bookings: [], data: [] })),
        getFavoriteHotels().catch(() => ({ hotels: [], favorites: [], data: [] })),
        getHotels().catch(() => ({ hotels: [], data: [] })),
      ]);

      // Process bookings
      const bookingsData = Array.isArray(bookingsResponse)
        ? bookingsResponse
        : bookingsResponse.bookings || bookingsResponse.data || [];
      setBookings(bookingsData);

      // Process favorites
      const favoritesData = Array.isArray(favoritesResponse)
        ? favoritesResponse
        : favoritesResponse.hotels || favoritesResponse.favorites || favoritesResponse.data || [];
      setFavoriteHotels(favoritesData);

      // Process recommended hotels
      const recommendedData = Array.isArray(recommendedResponse)
        ? recommendedResponse
        : recommendedResponse.hotels || recommendedResponse.data || [];
      // Filter out hotels that are already in favorites
      const favoriteIds = new Set(favoritesData.map((h: any) => h._id));
      const filteredRecommended = recommendedData
        .filter((h: any) => !favoriteIds.has(h._id))
        .slice(0, 4);
      setRecommendedHotels(filteredRecommended);

    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Get user name safely
  const userName = mounted && user?.name ? user.name.split(' ')[0] : 'Guest';

  // Calculate metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((booking) => {
    if (!['pending', 'confirmed'].includes(booking.status)) return false;
    const checkInDate = new Date(booking.checkIn);
    checkInDate.setHours(0, 0, 0, 0);
    return checkInDate >= today;
  }).slice(0, 2); // Show only first 2 for preview

  const totalBookings = bookings.length;
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  const favoriteCount = favoriteHotels.length;

  // Calculate trends (comparing this month vs last month)
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const lastMonth = new Date(thisMonth);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const bookingsThisMonth = bookings.filter((b) => {
    const bookingDate = new Date(b.createdAt || b.checkIn);
    return bookingDate >= thisMonth;
  }).length;

  const bookingsLastMonth = bookings.filter((b) => {
    const bookingDate = new Date(b.createdAt || b.checkIn);
    return bookingDate >= lastMonth && bookingDate < thisMonth;
  }).length;

  const newBookingsText = bookingsThisMonth > bookingsLastMonth
    ? `${bookingsThisMonth - bookingsLastMonth} this month`
    : bookingsThisMonth > 0
      ? `${bookingsThisMonth} this month`
      : '';

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-charcoal-light">Loading dashboard...</div>
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
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            Welcome back, <span suppressHydrationWarning>{userName}</span>! 👋
          </h1>
          <p className="text-charcoal-light">Here's what's happening with your bookings</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            icon={Calendar}
            value={upcomingBookings.length.toString()}
            label="Upcoming Trips"
            trend={upcomingBookings.length > 0 ? { value: `${upcomingBookings.length} upcoming`, isPositive: true } : undefined}
            iconColor="green"
          />
          <MetricCard
            icon={MapPin}
            value={totalBookings.toString()}
            label="Total Bookings"
            trend={newBookingsText ? { value: newBookingsText, isPositive: true } : undefined}
            iconColor="blue"
          />
          <MetricCard
            icon={Heart}
            value={favoriteCount.toString()}
            label="Favorite Hotels"
            badge={favoriteCount > 0 ? { text: `${favoriteCount} saved`, color: 'orange' } : undefined}
            iconColor="orange"
          />
          <MetricCard
            icon={TrendingUp}
            value={`$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            label="Total Spent"
            trend={bookingsThisMonth > bookingsLastMonth ? { value: `${Math.round(((bookingsThisMonth - bookingsLastMonth) / Math.max(bookingsLastMonth, 1)) * 100)}%`, isPositive: true } : undefined}
            iconColor="green"
          />
        </div>

        {/* Upcoming Trips */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-charcoal">Upcoming Trips</h2>
            <a href="/customer/bookings" className="text-emerald hover:text-emerald-dark font-medium text-sm">
              View All
            </a>
          </div>
          {upcomingBookings.length === 0 ? (
            <div className="bg-ivory-light rounded-xl p-12 text-center shadow-card">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">No upcoming trips</h3>
              <p className="text-charcoal-light mb-6">
                You don't have any upcoming bookings. Start exploring hotels!
              </p>
              <Button onClick={() => window.location.href = '/customer/search'}>
                Search Hotels
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map((booking) => {
                const hotel = typeof booking.hotel === 'object' ? booking.hotel : null;
                const hotelImage = getHotelImage(hotel);
                const location = hotel?.location
                  ? getLocationString(hotel)
                  : 'Location not available';

                return (
                  <div
                    key={booking._id}
                    className="bg-ivory-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={hotelImage}
                          alt={hotel?.name || 'Hotel'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-charcoal mb-1">
                          {hotel?.name || 'Hotel'}
                        </h3>
                        <p className="text-sm text-charcoal-light mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {location}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-charcoal-light">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Check-in: {formatDate(booking.checkIn)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Check-out: {formatDate(booking.checkOut)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Favorite Hotels */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-charcoal">Your Favorites</h2>
            <a href="/customer/favorites" className="text-emerald hover:text-emerald-dark font-medium text-sm">
              View All
            </a>
          </div>
          {favoriteHotels.length === 0 ? (
            <div className="bg-ivory-light rounded-xl p-12 text-center shadow-card">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">No favorites yet</h3>
              <p className="text-charcoal-light mb-6">
                Start exploring hotels and add them to your favorites!
              </p>
              <Button onClick={() => window.location.href = '/customer/search'}>
                Explore Hotels
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteHotels.slice(0, 4).map((hotel) => {
                const locationString = getLocationString(hotel);
                const hotelImage = getHotelImage(hotel);

                return (
                  <HotelCard
                    key={hotel._id}
                    id={hotel._id}
                    name={hotel.name}
                    location={locationString}
                    rating={hotel.rating?.average || 0}
                    image={hotelImage}
                    isFavorite={true}
                    onFavoriteChange={(hotelId, isFavorite) => {
                      if (!isFavorite) {
                        setFavoriteHotels(prev => prev.filter(h => h._id !== hotelId));
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* AI Recommended Hotels */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-charcoal">Recommended for You</h2>
              <span className="px-2 py-1 bg-emerald/10 text-emerald rounded-full text-xs font-medium">
                AI Powered
              </span>
            </div>
            <a href="/customer/search" className="text-emerald hover:text-emerald-dark font-medium text-sm">
              Explore More
            </a>
          </div>
          {recommendedHotels.length === 0 ? (
            <div className="bg-ivory-light rounded-xl p-12 text-center shadow-card">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">No recommendations available</h3>
              <p className="text-charcoal-light mb-6">
                Check back later for personalized hotel recommendations!
              </p>
              <Button onClick={() => window.location.href = '/customer/search'}>
                Explore Hotels
              </Button>
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {recommendedHotels.map((hotel) => {
                const locationString = getLocationString(hotel);
                const hotelImage = getHotelImage(hotel);
                const isFavorite = favoriteHotels.some(f => f._id === hotel._id);

                return (
                  <div key={hotel._id} className="flex-shrink-0 w-64">
                    <HotelCard
                      id={hotel._id}
                      name={hotel.name}
                      location={locationString}
                      rating={hotel.rating?.average || 0}
                      image={hotelImage}
                      badge={{ text: 'AI Recommended', color: 'green' }}
                      isFavorite={isFavorite}
                      onFavoriteChange={(hotelId, isFavorite) => {
                        if (isFavorite) {
                          // Add to favorites list
                          const hotelToAdd = recommendedHotels.find(h => h._id === hotelId);
                          if (hotelToAdd) {
                            setFavoriteHotels(prev => [...prev, hotelToAdd]);
                          }
                        } else {
                          // Remove from favorites list
                          setFavoriteHotels(prev => prev.filter(h => h._id !== hotelId));
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </CustomerLayout>
  );
}