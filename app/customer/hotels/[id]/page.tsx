'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CustomerLayout from '@/components/shared/CustomerLayout';
import { getHotelById, getRoomsByHotel } from '@/lib/api';
import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Waves, Coffee } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';


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
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Get dates from URL params (from search page)
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guestsParam = searchParams.get('guests') || '';

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

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (bookingId: string) => {
    router.push(`/customer/bookings/${bookingId}`);
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

  const mainImage = hotel.images && hotel.images.length > 0 
    ? hotel.images[0].url 
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';
  const otherImages = hotel.images?.slice(1, 5) || [];

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Hotel Images */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 md:row-span-2">
            <img
              src={mainImage}
              alt={hotel.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {otherImages.slice(0, 2).map((img, index) => (
            <div key={index}>
              <img
                src={img.url}
                alt={`${hotel.name} ${index + 2}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Hotel Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-charcoal mb-2">{hotel.name}</h1>
              <div className="flex items-center space-x-4 text-charcoal-light">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {hotel.location.address}, {hotel.location.city}, {hotel.location.state}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-medium">{hotel.rating.average}</span>
                  <span>({hotel.rating.count} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-3">About this hotel</h2>
              <p className="text-charcoal-light leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-charcoal mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || MapPin;
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-emerald" />
                        <span className="text-charcoal-light">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Policies */}
            {hotel.policies && (
              <div>
                <h2 className="text-xl font-semibold text-charcoal mb-3">Policies</h2>
                <div className="space-y-2 text-charcoal-light">
                  <p><strong>Check-in:</strong> {hotel.policies.checkIn}</p>
                  <p><strong>Check-out:</strong> {hotel.policies.checkOut}</p>
                  {hotel.policies.cancellation && (
                    <p><strong>Cancellation:</strong> {hotel.policies.cancellation}</p>
                  )}
                </div>
              </div>
            )}

            {/* Rooms */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {rooms.length === 0 ? (
                  <p className="text-charcoal-light">No rooms available at this time.</p>
                ) : (
                  rooms.map((room) => (
                    <div
                      key={room._id}
                      className="bg-ivory-light rounded-lg p-6 border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Room Image */}
                        <div>
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={room.images[0].url}
                              alt={room.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                        </div>

                        {/* Room Details */}
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-semibold text-charcoal mb-2">{room.name}</h3>
                          <p className="text-sm text-charcoal-light mb-3">{room.description}</p>
                          
                          <div className="flex flex-wrap gap-4 mb-3 text-sm text-charcoal-light">
                            <span>Type: {room.type}</span>
                            {room.size && (
                              <span>Size: {room.size.value} {room.size.unit}</span>
                            )}
                            <span>Capacity: {room.capacity.adults} adults, {room.capacity.children} children</span>
                            {room.bedType && <span>Bed: {room.bedType}</span>}
                          </div>

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-charcoal mb-1">Room Amenities:</p>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-xs text-charcoal-light rounded"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <p className="text-2xl font-bold text-emerald">
                                ${room.price.base}
                                <span className="text-sm font-normal text-charcoal-light">/night</span>
                              </p>
                              <p className="text-xs text-charcoal-light">
                                {room.available} of {room.quantity} available
                              </p>
                            </div>
                            <button
                              onClick={() => handleBookRoom(room)}
                              disabled={room.available === 0}
                              className="px-6 py-2 bg-emerald hover:bg-emerald-dark text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            </div>
          </div>

          {/* Booking Summary Sidebar (if dates selected) */}
          {(checkIn || checkOut) && (
            <div className="lg:col-span-1">
              <div className="bg-ivory-light rounded-lg p-6 border border-gray-200 sticky top-4">
                <h3 className="text-lg font-semibold text-charcoal mb-4">Your Stay</h3>
                <div className="space-y-3 text-sm">
                  {checkIn && (
                    <div>
                      <p className="text-charcoal-light">Check-in</p>
                      <p className="font-medium text-charcoal">{new Date(checkIn).toLocaleDateString()}</p>
                    </div>
                  )}
                  {checkOut && (
                    <div>
                      <p className="text-charcoal-light">Check-out</p>
                      <p className="font-medium text-charcoal">{new Date(checkOut).toLocaleDateString()}</p>
                    </div>
                  )}
                  {guestsParam && (
                    <div>
                      <p className="text-charcoal-light">Guests</p>
                      <p className="font-medium text-charcoal">{guestsParam}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          hotel={hotel}
          checkIn={checkIn}
          checkOut={checkOut}
          guestsParam={guestsParam}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedRoom(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </CustomerLayout>
  );
}