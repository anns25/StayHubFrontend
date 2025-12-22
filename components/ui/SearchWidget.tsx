'use client';

import { MapPin, Compass, Calendar, Users, Search } from 'lucide-react';
import { useState, useEffect, useRef, memo } from 'react';
import { useRouter } from 'next/navigation';

interface SearchWidgetProps {
  onLocationChange?: (location: string) => void;
  onSearch?: (searchParams: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
  }) => void;
  initialValues?: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

function SearchWidget({ onLocationChange, onSearch, initialValues }: SearchWidgetProps = {}) {
  const router = useRouter();
  const [location, setLocation] = useState(initialValues?.location || '');
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut || '');
  const [guests, setGuests] = useState(initialValues?.guests || '');
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  
  // Track if we've initialized from initialValues (only once on mount)
  const hasInitialized = useRef(false);

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

  // Only sync with initialValues on mount, not on every change
  useEffect(() => {
    if (!hasInitialized.current && initialValues) {
      if (initialValues.location !== undefined) setLocation(initialValues.location);
      if (initialValues.checkIn !== undefined) setCheckIn(initialValues.checkIn);
      if (initialValues.checkOut !== undefined) setCheckOut(initialValues.checkOut);
      if (initialValues.guests !== undefined) setGuests(initialValues.guests);
      hasInitialized.current = true;
    }
  }, []); // Empty dependency array - only run on mount

  // Handle location input change - trigger real-time search
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    
    // Call onLocationChange if provided (for real-time search)
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
  };

  const handleSearch = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const searchParams = {
      location: location.trim(),
      checkIn: checkIn || tomorrowStr,
      checkOut: checkOut || dayAfterTomorrowStr,
      guests: guests || '',
    };

    if (onSearch) {
      // If onSearch callback is provided, use it
      onSearch(searchParams);
    } else {
      // Otherwise, navigate to search page with query params
      const params = new URLSearchParams();
      if (searchParams.location) params.set('location', searchParams.location);
      if (searchParams.checkIn) params.set('checkIn', searchParams.checkIn);
      if (searchParams.checkOut) params.set('checkOut', searchParams.checkOut);
      if (searchParams.guests) params.set('guests', searchParams.guests);
      
      router.push(`/customer/search?${params.toString()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-ivory-light rounded-2xl shadow-xl p-6 max-w-5xl w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Location Input - Real-time search as user types */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="City, State, or Country"
              value={location}
              onChange={handleLocationChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
            />
            <Compass className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              onChange={(e) => setCheckIn(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
              onChange={(e) => setCheckOut(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Guests Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none text-left flex items-center justify-between bg-white"
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

      {/* Search Button - Optional, can be kept for explicit search */}
      <button 
        type="button"
        onClick={handleSearch}
        className="w-full bg-emerald hover:bg-emerald-dark text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>
    </div>
  );
}

// Memoize the component to prevent re-renders when props haven't actually changed
export default memo(SearchWidget);

