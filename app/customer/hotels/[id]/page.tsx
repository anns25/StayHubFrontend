'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CustomerLayout from '@/components/shared/CustomerLayout';
import { getHotelById, getRoomsByHotel, getHotelReviews } from '@/lib/api';
import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Waves, Coffee, Calendar, Users, Shield, Clock, CheckCircle } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setDateRange,
  setSelectedRooms,
  openBookingModal,
  closeBookingModal
} from '@/store/slices/operationSlice';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
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
  amenities: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}

interface Room {
  _id: string;
  name: string;
  description: string;
  type: string;
  price: {
    base: number;
    currency: string;
  };
  capacity: {
    adults: number;
    children: number;
  };
  size?: {
    value: number;
    unit: string;
  };
  images: Array<{
    url: string;
    publicId: string;
  }>;
  amenities: string[];
  bedType?: string;
  available: number;
  quantity: number;
}

const amenityIcons: Record<string, any> = {
  'Wi-Fi': Wifi,
  'Parking': Car,
  'Restaurant': Utensils,
  'Gym': Dumbbell,
  'Pool': Waves,
  'Breakfast': Coffee,
};

export default function HotelDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const {
    selectedDateRange,
    selectedRooms,
    isBookingModalOpen
  } = useAppSelector((state) => state.operations);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const guestsParam = searchParams.get('guests') || '';

  const checkIn = selectedDateRange?.checkIn || searchParams.get('checkIn') || '';
  const checkOut = selectedDateRange?.checkOut || searchParams.get('checkOut') || '';


  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [hotelResponse, roomsResponse] = await Promise.all([
          getHotelById(hotelId),
          getRoomsByHotel(hotelId),
        ]);

        setHotel(hotelResponse.data);
        setRooms(roomsResponse.data || []);
        console.log(hotelResponse.data);
      } catch (error: any) {
        console.error('Error fetching hotel data:', error);
        setError(error.message || 'Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelData();
    }
  }, [hotelId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!hotelId) return;
      try {
        setReviewsLoading(true);
        const response = await getHotelReviews(hotelId);
        setReviews(response.data || []);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        // Don't show error, just leave reviews empty
      } finally {
        setReviewsLoading(false);
      }
    };

    if (hotelId) {
      fetchReviews();
    }
  }, [hotelId]);

  // Scroll to reviews section
  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Update handleBookRoom
  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    dispatch(setSelectedRooms([room._id]));
    dispatch(openBookingModal());
  };

  // Update booking success handler
  const handleBookingSuccess = (bookingId: string) => {
    dispatch(closeBookingModal());
    dispatch(setSelectedRooms([]));
    router.push(`/customer/bookings/${bookingId}`);
  };

  // Update modal close
  const handleCloseBookingForm = () => {
    dispatch(closeBookingModal());
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading hotel details...</div>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !hotel) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">{error || 'Hotel not found'}</div>
        </div>
      </CustomerLayout>
    );
  }

  const allImages = hotel.images && hotel.images.length > 0
    ? hotel.images
    : [{ url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop' }];
  const mainImage = allImages[selectedImageIndex]?.url || allImages[0].url;
  const otherImages = allImages.slice(0, 5);

  return (
    <CustomerLayout>
      <div className="space-y-8">

        {/* Hotel Header */}
        <div className="bg-ivory-light rounded-xl p-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-3">{hotel.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-charcoal-light mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5 text-emerald" />
                  <span className="text-sm md:text-base">
                    {hotel.location.address}, {hotel.location.city}, {hotel.location.state}
                  </span>
                </div>
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={scrollToReviews}
                >
                  <Star className="w-5 h-5 fill-gold text-gold" />
                  <span className="font-semibold text-charcoal">{hotel.rating.average}</span>
                  <span className="text-sm">({hotel.rating.count} reviews)</span>
                </div>
              </div>
              {hotel.category && (
                <span className="inline-block px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm font-medium">
                  {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section with Images */}
        <div className="relative">
          {/* Main Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[400px] md:h-[500px]">
            <div className="md:col-span-2 md:row-span-2 overflow-hidden rouned-xl">
              <img
                src={mainImage}
                alt={hotel.name}
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
            {otherImages.slice(1, 5).map((img, index) => (
              <div
                key={index}
                className="relative cursor-pointer group overflow-hidden rounded-xl"
                onClick={() => setSelectedImageIndex(index + 1)}
              >
                <img
                  src={img.url}
                  alt={`${hotel.name} ${index + 2}`}
                  className="w-full h-full object-cover rounded-xl shadow-md group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-ivory-light rounded-xl p-6 shadow-card">
              <h2 className="text-2xl font-bold text-charcoal mb-4">About this hotel</h2>
              <p className="text-charcoal-light leading-relaxed text-base">{hotel.description}</p>
            </section>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="bg-ivory-light rounded-xl p-6 shadow-card">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || CheckCircle;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 bg-emerald/10 rounded-lg">
                          <Icon className="w-5 h-5 text-emerald" />
                        </div>
                        <span className="text-charcoal font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Policies */}
            {hotel.policies && (
              <section className="bg-ivory-light rounded-xl p-6 shadow-card">
                <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-emerald" />
                  Hotel Policies
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-emerald mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-charcoal">Check-in</p>
                      <p className="text-charcoal-light">{hotel.policies.checkIn}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-emerald mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-charcoal">Check-out</p>
                      <p className="text-charcoal-light">{hotel.policies.checkOut}</p>
                    </div>
                  </div>
                  {hotel.policies.cancellation && (
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-emerald mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-charcoal">Cancellation</p>
                        <p className="text-charcoal-light">{hotel.policies.cancellation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Reviews Section - Add this after Policies section */}
            <section
              id="reviews"
              ref={reviewsSectionRef}
              className="bg-ivory-light rounded-xl p-6 shadow-card"
            >
              <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center">
                <Star className="w-6 h-6 mr-2 text-emerald" />
                Reviews ({reviews.length})
              </h2>

              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="text-charcoal-light">Loading reviews...</div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-charcoal-light">No reviews yet. Be the first to review this hotel!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {review.customer?.profileImage ? (
                              <img
                                src={review.customer.profileImage}
                                alt={review.customer.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-emerald font-semibold text-lg">
                                {review.customer?.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-charcoal">
                              {review.customer?.name || 'Anonymous'}
                            </h4>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating.overall
                                      ? 'fill-gold text-gold'
                                      : 'text-gray-300'
                                    }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-charcoal-light">
                                {review.rating.overall}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-charcoal-light">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <p className="text-charcoal-light leading-relaxed mb-4">{review.comment}</p>

                      {/* Additional rating breakdown if available */}
                      {(review.rating.cleanliness || review.rating.service || review.rating.value || review.rating.location) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                          {review.rating.cleanliness && (
                            <div>
                              <p className="text-xs text-charcoal-light mb-1">Cleanliness</p>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= review.rating.cleanliness
                                        ? 'fill-gold text-gold'
                                        : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {review.rating.service && (
                            <div>
                              <p className="text-xs text-charcoal-light mb-1">Service</p>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= review.rating.service
                                        ? 'fill-gold text-gold'
                                        : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {review.rating.value && (
                            <div>
                              <p className="text-xs text-charcoal-light mb-1">Value</p>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= review.rating.value
                                        ? 'fill-gold text-gold'
                                        : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {review.rating.location && (
                            <div>
                              <p className="text-xs text-charcoal-light mb-1">Location</p>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= review.rating.location
                                        ? 'fill-gold text-gold'
                                        : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Owner response if available */}
                      {review.ownerResponse?.text && (
                        <div className="mt-4 pt-4 border-t border-gray-200 bg-emerald/5 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-semibold text-emerald">Hotel Response</span>
                            {review.ownerResponse.generatedByAI && (
                              <span className="px-2 py-0.5 bg-emerald/10 text-emerald rounded-full text-xs">
                                AI Generated
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-charcoal-light">{review.ownerResponse.text}</p>
                          {review.ownerResponse.respondedAt && (
                            <p className="text-xs text-charcoal-light mt-2">
                              {new Date(review.ownerResponse.respondedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Available Rooms */}
            <section>
              <h2 className="text-2xl font-bold text-charcoal mb-6">Available Rooms</h2>
              <div className="space-y-6">
                {rooms.length === 0 ? (
                  <div className="bg-ivory-light rounded-xl p-8 text-center shadow-card">
                    <p className="text-charcoal-light text-lg">No rooms available at this time.</p>
                  </div>
                ) : (
                  rooms.map((room) => (
                    <div
                      key={room._id}
                      className="bg-ivory-light rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {/* Room Image */}
                        <div className="md:col-span-1 overflow-hidden">
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={room.images[0].url}
                              alt={room.name}
                              className="w-full h-full min-h-[200px] md:min-h-[250px] object-cover"
                            />
                          ) : (
                            <div className="w-full h-full min-h-[200px] md:min-h-[250px] bg-gradient-to-br from-emerald/20 to-emerald/5 flex items-center justify-center">
                              <span className="text-gray-400">No image available</span>
                            </div>
                          )}
                        </div>

                        {/* Room Details */}
                        <div className="md:col-span-2 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-charcoal mb-1">{room.name}</h3>
                                <p className="text-sm text-emerald font-medium mb-2">{room.type}</p>
                              </div>
                              {room.available > 0 && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  {room.available} Available
                                </span>
                              )}
                            </div>

                            <p className="text-charcoal-light mb-4 text-sm leading-relaxed">{room.description}</p>

                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                              <div className="flex items-center space-x-2 text-charcoal-light">
                                <Users className="w-4 h-4 text-emerald" />
                                <span>{room.capacity.adults} Adults, {room.capacity.children} Children</span>
                              </div>
                              {room.size && (
                                <div className="flex items-center space-x-2 text-charcoal-light">
                                  <span className="text-emerald">●</span>
                                  <span>{room.size.value} {room.size.unit}</span>
                                </div>
                              )}
                              {room.bedType && (
                                <div className="flex items-center space-x-2 text-charcoal-light">
                                  <span className="text-emerald">●</span>
                                  <span>{room.bedType}</span>
                                </div>
                              )}
                            </div>

                            {room.amenities && room.amenities.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-charcoal mb-2 uppercase tracking-wide">Room Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                  {room.amenities.slice(0, 4).map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-white text-xs text-charcoal-light rounded-full border border-gray-200"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {room.amenities.length > 4 && (
                                    <span className="px-3 py-1 bg-white text-xs text-charcoal-light rounded-full border border-gray-200">
                                      +{room.amenities.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-3xl font-bold text-emerald">
                                ${room.price.base}
                                <span className="text-base font-normal text-charcoal-light">/night</span>
                              </p>
                              {room.available < room.quantity && (
                                <p className="text-xs text-charcoal-light mt-1">
                                  Only {room.available} left at this price
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleBookRoom(room)}
                              disabled={room.available === 0}
                              className="px-6 py-3 bg-emerald hover:bg-emerald-dark text-white rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none"
                            >
                              {room.available === 0 ? 'Unavailable' : 'Book Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {(checkIn || checkOut) && (
                <div className="bg-ivory-light rounded-xl p-6 shadow-card">
                  <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-emerald" />
                    Your Stay
                  </h3>
                  <div className="space-y-4">
                    {checkIn && (
                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wide mb-1">Check-in</p>
                        <p className="font-semibold text-charcoal">{new Date(checkIn).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</p>
                      </div>
                    )}
                    {checkOut && (
                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wide mb-1">Check-out</p>
                        <p className="font-semibold text-charcoal">{new Date(checkOut).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</p>
                      </div>
                    )}
                    {guestsParam && (
                      <div>
                        <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wide mb-1">Guests</p>
                        <p className="font-semibold text-charcoal">{guestsParam}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-emerald to-emerald-dark rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-3">Why book with us?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Best price guarantee</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Instant confirmation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Free cancellation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {isBookingModalOpen && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          hotel={hotel}
          checkIn={checkIn}
          checkOut={checkOut}
          guestsParam={guestsParam}
          onClose={() => {
            setSelectedRoom(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </CustomerLayout>
  );
}