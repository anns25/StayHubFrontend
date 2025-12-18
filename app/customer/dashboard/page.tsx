'use client';

import CustomerLayout from '@/components/shared/CustomerLayout';
import MetricCard from '@/components/ui/MetricCard';
import HotelCard from '@/components/ui/HotelCard';
import { Calendar, MapPin, Heart, Star, TrendingUp, Clock } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';

// Consistent date formatter (MM/DD/YYYY format)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export default function CustomerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismath
  useEffect(() => {
    setMounted(true);
  },[]);

  // Get user name safely
  const userName = mounted && user?.name ? user.name.split(' ')[0] : 'Guest';

  // Mock data - replace with actual API calls
  const upcomingBookings = [
    {
      id: 1,
      hotelName: 'Grand Emerald Resort',
      location: 'San Francisco, CA',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    },
    {
      id: 2,
      hotelName: 'Luxury Bay Hotel',
      location: 'Miami, FL',
      checkIn: '2024-02-10',
      checkOut: '2024-02-14',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    },
  ];

  const favoriteHotels = [
    {
      name: 'Oceanview Paradise',
      location: 'Malibu, CA',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      badge: { text: 'Popular', color: 'green' as const },
      isFavorite: true,
    },
    {
      name: 'Mountain Retreat',
      location: 'Aspen, CO',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      badge: { text: 'New', color: 'blue' as const },
      isFavorite: true,
    },
  ];

  const recommendedHotels = [
    {
      name: 'City Center Hotel',
      location: 'New York, NY',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      badge: { text: 'AI Recommended', color: 'green' as const },
      isFavorite: false,
    },
    {
      name: 'Beachfront Resort',
      location: 'Cancun, Mexico',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      badge: { text: 'Best Deal', color: 'blue' as const },
      isFavorite: false,
    },
  ];

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
            value="3"
            label="Upcoming Trips"
            trend={{ value: '1 new', isPositive: true }}
            iconColor="green"
          />
          <MetricCard
            icon={MapPin}
            value="12"
            label="Total Bookings"
            trend={{ value: '2 this month', isPositive: true }}
            iconColor="blue"
          />
          <MetricCard
            icon={Heart}
            value="8"
            label="Favorite Hotels"
            badge={{ text: '3 new', color: 'orange' }}
            iconColor="orange"
          />
          <MetricCard
            icon={TrendingUp}
            value="$2,450"
            label="Total Spent"
            trend={{ value: '15%', isPositive: true }}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-ivory-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={booking.image}
                      alt={booking.hotelName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-charcoal mb-1">{booking.hotelName}</h3>
                    <p className="text-sm text-charcoal-light mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.location}
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
            ))}
          </div>
        </section>

        {/* Favorite Hotels */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-charcoal">Your Favorites</h2>
            <a href="/customer/favorites" className="text-emerald hover:text-emerald-dark font-medium text-sm">
              View All
            </a>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {favoriteHotels.map((hotel, index) => (
              <HotelCard key={index} {...hotel} />
            ))}
          </div>
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
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {recommendedHotels.map((hotel, index) => (
              <HotelCard key={index} {...hotel} />
            ))}
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}