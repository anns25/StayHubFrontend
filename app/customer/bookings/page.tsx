'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerLayout from '@/components/shared/CustomerLayout';
import { getMyBookings, cancelBooking } from '@/lib/api';
import { Booking, BookingStatus } from '@/types/booking';
import { Calendar, MapPin, Users, DollarSign, X, Eye, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Star, MessageSquare } from 'lucide-react';
import ReviewForm from '@/components/booking/ReviewForm';
import { checkReviewEligibility } from '@/lib/api';

// Status badge styling
const getStatusBadge = (status: BookingStatus) => {
  const statusConfig = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    confirmed: { label: 'Confirmed', className: 'bg-emerald/10 text-emerald border-emerald/20' },
    checked_in: { label: 'Checked In', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    checked_out: { label: 'Checked Out', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
      {config.label}
    </span>
  );
};

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Calculate nights
const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
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

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingWithDetails | null>(null);
  const [reviewEligibility, setReviewEligibility] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchBookings();
  }, []);

  // Check eligibility for checked_out bookings
  useEffect(() => {
    bookings
      .filter(b => b.status === 'checked_out')
      .forEach(booking => {
        if (!reviewEligibility[booking._id]) {
          checkEligibility(booking._id);
        }
      });
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyBookings();
      // Handle both array and object with bookings property
      const bookingsData = Array.isArray(response) ? response : response.bookings || response.data || [];
      setBookings(bookingsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (bookingId: string) => {
    router.push(`/customer/bookings/${bookingId}`);
  };

  const handleCancelClick = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
    setCancelReason('');
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      setCancellingId(selectedBooking._id);
      await cancelBooking(selectedBooking._id, cancelReason || undefined);
      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancelReason('');
      // Refresh bookings
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    checked_in: bookings.filter(b => b.status === 'checked_in').length,
    checked_out: bookings.filter(b => b.status === 'checked_out').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-charcoal-light">Loading bookings...</div>
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
          <Button onClick={fetchBookings}>Try Again</Button>
        </div>
      </CustomerLayout>
    );
  }
  const checkEligibility = async (bookingId: string) => {
    try {
      const response = await checkReviewEligibility(bookingId);
      setReviewEligibility(prev => ({
        ...prev,
        [bookingId]: response.data,
      }));
    } catch (err) {
      // Silently fail - just don't show review button
    }
  };


  const handleReviewClick = (booking: BookingWithDetails) => {
    setSelectedBookingForReview(booking);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setSelectedBookingForReview(null);
    // Refresh eligibility
    if (selectedBookingForReview) {
      checkEligibility(selectedBookingForReview._id);
    }
    fetchBookings();
  };


  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">My Bookings</h1>
          <p className="text-charcoal-light">Manage and view all your hotel reservations</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {(['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                ? 'bg-emerald text-white'
                : 'bg-ivory-light text-charcoal hover:bg-gray-100'
                }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {statusCounts[status] > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === status ? 'bg-white/20' : 'bg-emerald/10 text-emerald'
                  }`}>
                  {statusCounts[status]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-ivory-light rounded-xl p-12 text-center shadow-card">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">No bookings found</h3>
            <p className="text-charcoal-light mb-6">
              {filter === 'all'
                ? "You don't have any bookings yet. Start exploring hotels!"
                : `No ${filter.replace('_', ' ')} bookings found.`}
            </p>
            {filter === 'all' && (
              <Button onClick={() => router.push('/customer/search')}>
                Search Hotels
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const hotel = typeof booking.hotel === 'object' ? booking.hotel : null;
              const room = typeof booking.room === 'object' ? booking.room : null;
              const hotelImage = hotel?.images?.[0]?.url || '/placeholder-hotel.jpg';
              const nights = calculateNights(booking.checkIn, booking.checkOut);

              return (
                <div
                  key={booking._id}
                  className="bg-ivory-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Hotel Image */}
                    <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={hotelImage}
                        alt={hotel?.name || 'Hotel'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-charcoal mb-1">
                              {hotel?.name || 'Hotel'}
                            </h3>
                            {room && (
                              <p className="text-charcoal-light text-sm mb-2">{room.name} - {room.type}</p>
                            )}
                            <div className="flex items-center text-sm text-charcoal-light mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              {hotel?.location?.city && (
                                <span>
                                  {hotel.location.city}
                                  {hotel.location.state && `, ${hotel.location.state}`}
                                  {hotel.location.country && `, ${hotel.location.country}`}
                                </span>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        {/* Booking Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-emerald" />
                            <div>
                              <p className="text-charcoal-light">Check-in</p>
                              <p className="font-semibold text-charcoal">{formatDate(booking.checkIn)}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-emerald" />
                            <div>
                              <p className="text-charcoal-light">Check-out</p>
                              <p className="font-semibold text-charcoal">{formatDate(booking.checkOut)}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-2 text-emerald" />
                            <div>
                              <p className="text-charcoal-light">Guests</p>
                              <p className="font-semibold text-charcoal">
                                {booking.guests.adults} Adult{booking.guests.adults !== 1 ? 's' : ''}
                                {booking.guests.children > 0 && `, ${booking.guests.children} Child${booking.guests.children !== 1 ? 'ren' : ''}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="w-4 h-4 mr-2 text-emerald" />
                            <div>
                              <p className="text-charcoal-light">Total</p>
                              <p className="font-semibold text-charcoal">
                                {booking.currency} {booking.totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="text-sm text-charcoal-light">
                          <p>{nights} night{nights !== 1 ? 's' : ''} • Booked on {formatDate(booking.createdAt)}</p>
                          {booking.specialRequests && (
                            <p className="mt-1 italic">Special Request: {booking.specialRequests}</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          onClick={() => handleViewBooking(booking._id)}
                          className="flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {booking.status === 'checked_out' && (
                          (() => {
                            const eligibility = reviewEligibility[booking._id];
                            if (eligibility?.hasReview) {
                              return (
                                <Button
                                  variant="outline"
                                  disabled
                                  className="flex items-center text-gray-400"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Review Submitted
                                </Button>
                              );
                            }
                            if (eligibility?.eligible) {
                              return (
                                <Button
                                  variant="outline"
                                  onClick={() => handleReviewClick(booking)}
                                  className="flex items-center text-emerald border-emerald hover:bg-emerald/10"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Write Review
                                </Button>
                              );
                            }
                            return null;
                          })()
                        )}
                        {booking.status !== 'cancelled' &&
                          booking.status !== 'checked_out' && (
                            <Button
                              variant="outline"
                              onClick={() => handleCancelClick(booking)}
                              className="flex items-center text-red-600 border-red-300 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-bold text-charcoal mb-4">Cancel Booking</h3>
              <p className="text-charcoal-light mb-4">
                Are you sure you want to cancel your booking at{' '}
                <span className="font-semibold text-charcoal">
                  {typeof selectedBooking.hotel === 'object' ? selectedBooking.hotel.name : 'this hotel'}?
                </span>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please let us know why you're cancelling..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                    setCancelReason('');
                  }}
                  className="flex-1"
                >
                  Keep Booking
                </Button>
                <Button
                  onClick={handleCancelConfirm}
                  disabled={cancellingId === selectedBooking._id}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {cancellingId === selectedBooking._id ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && selectedBookingForReview && (
          <ReviewForm
            booking={{
              _id: selectedBookingForReview._id,
              hotel: {
                _id: typeof selectedBookingForReview.hotel === 'object'
                  ? selectedBookingForReview.hotel._id
                  : '',
                name: typeof selectedBookingForReview.hotel === 'object'
                  ? selectedBookingForReview.hotel.name
                  : 'Hotel',
              },
            }}
            onClose={() => {
              setShowReviewForm(false);
              setSelectedBookingForReview(null);
            }}
            onSuccess={handleReviewSuccess}
          />
        )}
      </div>
    </CustomerLayout>
  );
}