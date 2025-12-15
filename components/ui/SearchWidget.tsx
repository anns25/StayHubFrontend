'use client';

import { MapPin, Compass, Calendar, Users, Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchWidget() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 Guest');
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const guestOptions = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5+ Guests'];

  return (
    <div className="bg-ivory-light rounded-2xl shadow-xl p-6 max-w-5xl w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Location Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              type="text"
              placeholder="dd/mm/yyyy"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Check-out Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
          <div className="relative">
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Guests Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
          <div className="relative">
            <button
              onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none text-left flex items-center justify-between"
            >
              <span className="text-gray-700">{guests}</span>
              <Users className="w-5 h-5 text-gray-400" />
            </button>
            {showGuestsDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-ivory-light border border-gray-300 rounded-lg shadow-lg">
                {guestOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setGuests(option);
                      setShowGuestsDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button className="w-full bg-emerald hover:bg-emerald-dark text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>
    </div>
  );
}

