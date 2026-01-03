'use client';

import CategoryFilters from '@/components/ui/CategoryFilters';
import HotelCard from '@/components/ui/HotelCard';
import { searchHotels, getHotels } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Users } from 'lucide-react';
import Input from '@/components/ui/Input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setDateRange,
  setSelectedGuests,
  clearDateRange,
  clearSelectedGuests
} from '@/store/slices/operationSlice';


interface Hotel {
  _id: string;
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
  };
  images: Array<{
    url: string;
    publicId: string;
  }>;
  category: string;
  rating: {
    average: number;
    count: number;
  };
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // All search fields directly controlled in page (like admin users page)
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const dispatch = useAppDispatch();
  const { selectedDateRange, selectedGuests } = useAppSelector(
    (state) => state.operations
  );

  const checkIn = selectedDateRange?.checkIn || '';
  const checkOut = selectedDateRange?.checkOut || '';

  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const guestOptions = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5+ Guests'];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Get tomorrow's date for default check-in
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Get day after tomorrow for default check-out
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

  // Initialize from URL params on mount
  useEffect(() => {
    const locationParam = searchParams.get('location');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');

    if (locationParam) setSearchLocation(locationParam);

    // Update Redux instead of local state
    if (checkInParam && checkOutParam) {
      dispatch(setDateRange({
        checkIn: checkInParam,
        checkOut: checkOutParam
      }));
    }

    if (guestsParam) {
      setGuests(guestsParam);
      const match = guestsParam.match(/(\d+)/);
      if (match) {
        const guestCount = parseInt(match[1]);
        dispatch(setSelectedGuests({
          adults: guestCount,
          children: 0
        }));
      }
    }
  }, [searchParams, dispatch]);

  const handleCheckInChange = (value: string) => {
    dispatch(setDateRange({ 
      checkIn: value, 
      checkOut: checkOut || value 
    }));
  };
  
  const handleCheckOutChange = (value: string) => {
    if (checkIn) {
      dispatch(setDateRange({ 
        checkIn, 
        checkOut: value 
      }));
    }
  };
  
  // Update guests change handler
  const handleGuestsChange = (value: string) => {
    setGuests(value);
    const match = value.match(/(\d+)/);
    if (match) {
      const guestCount = parseInt(match[1]);
      dispatch(setSelectedGuests({ 
        adults: guestCount, 
        children: 0 
      }));
    }
  };

  // Debounced search - triggers 500ms after user stops typing (exactly like admin users page)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHotels();
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [selectedCategory, searchLocation]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use search endpoint if location is provided, otherwise use regular getHotels
      if (searchLocation.trim()) {
        const params: any = {
          city: searchLocation.trim(),
        };
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        const response = await searchHotels(params);
        setHotels(response.data || []);
      } else {
        const params: any = {};
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        const response = await getHotels(params);
        setHotels(response.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching hotels:', error);
      setError(error.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend hotel data to frontend format
  const transformHotel = (hotel: Hotel) => {
    const locationString = `${hotel.location.city}, ${hotel.location.state}`;
    const imageUrl = hotel.images && hotel.images.length > 0
      ? hotel.images[0].url
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';

    const badgeMap: Record<string, { text: string; color: 'blue' | 'green' }> = {
      luxury: { text: 'Luxury', color: 'blue' },
      resort: { text: 'Resort', color: 'green' },
      boutique: { text: 'Boutique', color: 'blue' },
    };

    return {
      id: hotel._id,
      name: hotel.name,
      location: locationString,
      rating: hotel.rating?.average || 4.5,
      image: imageUrl,
      badge: badgeMap[hotel.category],
    };
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  if (loading && hotels.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading hotels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const transformedHotels = hotels.map(transformHotel);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-dark to-emerald py-12 sm:py-16 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Discover amazing hotels at the best prices
          </p>
        </div>

        {/* Search Fields - All directly in page (like admin users page) */}
        <div className="flex justify-center">
          <div className="bg-ivory-light rounded-2xl shadow-xl p-6 max-w-5xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Input
                    label=""
                    type="text"
                    placeholder="City, State, or Country"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Check-in Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <div className="relative">
                  <input
                    type="date"
                    min={today}
                    value={checkIn || tomorrowStr}
                    onChange={(e) => {
                      const newCheckIn = e.target.value;
                      dispatch(setDateRange({
                        checkIn: newCheckIn,
                        checkOut: checkOut || newCheckIn
                      }))
                    }}
                    className="w-full px-4 py-3 bg-ivory-light border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Check-out Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <div className="relative">
                  <input
                    type="date"
                    min={checkIn || tomorrowStr}
                    value={checkOut || dayAfterTomorrowStr}
                    onChange={(e) => {
                      const newCheckOut = e.target.value;
                      if(checkIn) {
                        dispatch(setDateRange({
                          checkIn,
                          checkOut: newCheckOut
                        }));
                    }
                  }}
                    className="w-full px-4 py-3 bg-ivory-light border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Guests Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                    className="w-full px-4 py-3 bg-ivory-light border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none text-left flex items-center justify-between transition-colors"
                  >
                    <span className={guests ? "text-gray-700" : "text-gray-400"}>
                      {guests || 'Select guests'}
                    </span>
                    <Users className="w-5 h-5 text-gray-400" />
                  </button>
                  {showGuestsDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowGuestsDropdown(false)}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {guestOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setGuests(option);
                              setShowGuestsDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section>
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </section>

      {/* Hotels List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal">
            {searchLocation
              ? `Hotels in ${searchLocation}`
              : selectedCategory
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Hotels`
                : 'All Hotels'}
          </h2>
          <span className="text-sm text-charcoal-light">
            {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} found
          </span>
        </div>

        {loading && hotels.length > 0 && (
          <div className="text-center py-4">
            <div className="text-gray-500 text-sm">Updating results...</div>
          </div>
        )}

        {transformedHotels.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-charcoal-light text-lg">
              No hotels found{searchLocation ? ` in ${searchLocation}` : selectedCategory ? ` in ${selectedCategory} category` : ''}.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {transformedHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                id={hotel.id}
                name={hotel.name}
                location={hotel.location}
                rating={hotel.rating}
                image={hotel.image}
                badge={hotel.badge}
                onFavorite={() => console.log('Favorite:', hotel.name)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
