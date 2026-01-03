'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { createBooking } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setDateRange,
  setSelectedGuests,
  setCurrentBooking,
  clearCurrentBooking
} from '@/store/slices/operationSlice';

interface Room {
  _id: string;
  name: string;
  price: {
    base: number;
    currency: string;
  };
  capacity: {
    adults: number;
    children: number;
  };
}

interface Hotel {
  _id: string;
  name: string;
}

interface BookingFormProps {
  room: Room;
  hotel: Hotel;
  checkIn?: string;
  checkOut?: string;
  guestsParam?: string;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export default function BookingForm({
  room,
  hotel,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  guestsParam,
  onClose,
  onSuccess,
}: BookingFormProps) {
  const dispatch = useAppDispatch();
  const {
    selectedDateRange,
    selectedGuests
  } = useAppSelector((state) => state.operations);

  // Use Redux state with fallback to props
  const [checkIn, setCheckIn] = useState(
    selectedDateRange?.checkIn || initialCheckIn || ''
  );
  const [checkOut, setCheckOut] = useState(
    selectedDateRange?.checkOut || initialCheckOut || ''
  );
  const [adults, setAdults] = useState(
    selectedGuests?.adults || 1
  );
  const [children, setChildren] = useState(
    selectedGuests?.children || 0
  );

  // Sync local state with Redux on changes
  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    if (checkOut) {
      dispatch(setDateRange({ checkIn: value, checkOut }));
    }
  };

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    if (checkIn) {
      dispatch(setDateRange({ checkIn, checkOut: value }));
    }
  };

  const handleAdultsChange = (value: number) => {
    setAdults(value);
    dispatch(setSelectedGuests({ adults: value, children }));
  };

  const handleChildrenChange = (value: number) => {
    setChildren(value);
    dispatch(setSelectedGuests({ adults, children: value }));
  };

  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse guests from URL param if provided
  useEffect(() => {
    if (guestsParam) {
      const match = guestsParam.match(/(\d+)/);
      if (match) {
        const guestCount = parseInt(match[1]);
        setAdults(Math.min(guestCount, room.capacity.adults));
      }
    }
  }, [guestsParam, room.capacity.adults]);

  // Set default dates if not provided
  useEffect(() => {
    if (!checkIn) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckIn(tomorrow.toISOString().split('T')[0]);
    }
    if (!checkOut) {
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      setCheckOut(dayAfter.toISOString().split('T')[0]);
    }
  }, []);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * room.price.base;
  };

  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkIn || today;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (adults > room.capacity.adults) {
      setError(`This room can accommodate maximum ${room.capacity.adults} adults`);
      return;
    }

    if (adults + children > room.capacity.adults + room.capacity.children) {
      setError(`This room can accommodate maximum ${room.capacity.adults + room.capacity.children} guests`);
      return;
    }

    try {
      setLoading(true);
      const response = await createBooking({
        room: room._id,
        checkIn,
        checkOut,
        guests: {
          adults,
          children,
        },
        specialRequests: specialRequests.trim() || undefined,
      });

      dispatch(setCurrentBooking(response.data));
      onSuccess(response.data._id);
    } catch (error: any) {
      setError(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Clear booking on unmount
  useEffect(() => {
    return () => {
      dispatch(clearCurrentBooking());
    };
  }, [dispatch]);

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-charcoal">Complete Your Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hotel & Room Info */}
          <div className="bg-ivory-light rounded-lg p-4">
            <h3 className="font-semibold text-charcoal mb-2">{hotel.name}</h3>
            <p className="text-sm text-charcoal-light">{room.name}</p>
            <p className="text-lg font-bold text-emerald mt-2">
              ${room.price.base}
              <span className="text-sm font-normal text-charcoal-light">/night</span>
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={minCheckOut}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guests
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-charcoal-light mb-1">Adults</label>
                <input
                  type="number"
                  min="1"
                  max={room.capacity.adults}
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-charcoal-light mb-1">Children</label>
                <input
                  type="number"
                  min="0"
                  max={room.capacity.children}
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-charcoal-light mt-1">
              Max: {room.capacity.adults} adults, {room.capacity.children} children
            </p>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
              placeholder="Any special requests or preferences..."
            />
          </div>

          {/* Price Summary */}
          <div className="bg-ivory-light rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-light">${room.price.base} × {nights} nights</span>
              <span className="text-charcoal">${nights * room.price.base}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span className="text-charcoal">Total</span>
              <span className="text-emerald">${total}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-charcoal rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald hover:bg-emerald-dark text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
