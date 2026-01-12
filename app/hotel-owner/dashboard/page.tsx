'use client';

import HotelOwnerLayout from '@/components/shared/HotelOwnerLayout';
import KPICard from '@/components/ui/KPICard';
import HotelAIInsightsCard from '@/components/ui/HotelAIInsightsCard';
import HotelListTable from '@/components/ui/HotelListTable';
import { Calendar, Percent, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { getHotelOwnerDashboardStats, getMyHotels } from '@/lib/api';
import { setActiveHotel } from '@/store/slices/activeHotelSlice';
import { useRouter } from 'next/navigation';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  images: Array<{ url: string; publicId?: string }>;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  bookingsToday: number;
  bookingsTodayChange: number;
  occupancyRate: number;
  occupancyRateChange: number;
  monthlyRevenue: number;
  monthlyRevenueChange: number;
  hotels: Array<{
    id: string;
    roomCount: number;
    revenue: number;
  }>;
}

// Transform backend hotel to HotelListTable format
const transformHotelForTable = (hotel: Hotel, stats?: DashboardStats['hotels']) => {
  const locationString = `${hotel.location.city}, ${hotel.location.state}`;

  // Determine status based on hotel properties
  let status: 'Active' | 'Maintenance' | 'Inactive' = 'Inactive';
  if (hotel.isActive && hotel.isApproved) {
    status = 'Active';
  } else if (hotel.isActive && !hotel.isApproved) {
    status = 'Maintenance'; // Pending approval
  }

  // Get hotel stats
  const hotelStats = stats?.find(s => s.id === hotel._id);

  return {
    id: hotel._id,
    name: hotel.name,
    location: locationString,
    status,
    rooms: hotelStats?.roomCount || 0, // TODO: Get actual room count from API
    revenue: hotelStats?.revenue ? `$${hotelStats.revenue.toLocaleString()}` : '$0',
  };
};

export default function HotelOwnerDashboard() {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeHotel = useAppSelector((state) => state.activeHotel);
  const activeHotelId = activeHotel?.hotelId || null;

  const insights = [
    {
      text: 'Consider increasing weekend rates by 15% based on high demand patterns',
    },
    {
      text: 'Deluxe Suite bookings are 30% higher - promote similar room types',
    },
    {
      text: 'Average response time to reviews is 48hrs - aim for under 24hrs to boost ratings',
    },
    {
      text: 'Peak booking time is 8-10 PM - schedule promotional emails accordingly',
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-set first hotel as active if none selected
  useEffect(() => {
    if (hotels.length > 0 && !activeHotelId) {
      const firstHotel = hotels[0];
      dispatch(setActiveHotel({
        hotelId: firstHotel._id,
        hotel: {
          _id: firstHotel._id,
          name: firstHotel.name,
          location: firstHotel.location,
          images: firstHotel.images?.map(img => ({
            url: img.url,
            publicId: img.publicId || '',
          })) || [],
        },
      }));
    }
  }, [hotels, activeHotelId, dispatch]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [hotelsResponse, statsResponse] = await Promise.all([
        getMyHotels(),
        getHotelOwnerDashboardStats(),
      ]);
      setHotels(hotelsResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (hotel: { id: string }) => {
    router.push(`/hotel-owner/hotels?edit=${hotel.id}`);
  };

  const handleView = (hotel: { id: string }) => {
    const hotelData = hotels.find(h => h._id === hotel.id);
    if (hotelData) {
      dispatch(setActiveHotel({
        hotelId: hotelData._id,
        hotel: {
          _id: hotelData._id,
          name: hotelData.name,
          location: hotelData.location,
          images: hotelData.images?.map(img => ({
            url: img.url,
            publicId: img.publicId || '',
          })) || [],
        },
      }));
      router.push(`/hotel-owner/hotels`);
    }
  };

  const handleDelete = (hotel: { id: string }) => {
    // Navigate to hotels page where delete functionality exists
    router.push(`/hotel-owner/hotels`);
  };

  const transformedHotels = hotels.map(hotel => transformHotelForTable(hotel, stats?.hotels));

  // Format trend value
  const formatTrend = (value: number) => {
    const sign = value >= 0 ? '↑' : '↓';
    const absValue = Math.abs(value).toFixed(1);
    return `${sign} ${absValue}%`;
  };

  if (loading) {
    return (
      <HotelOwnerLayout activeSidebarItem="Dashboard" onAddHotel={() => console.log('Add Hotel')}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald"></div>
        </div>
      </HotelOwnerLayout>
    );
  }

  if (error) {
    return (
      <HotelOwnerLayout activeSidebarItem="Dashboard" onAddHotel={() => console.log('Add Hotel')}>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-emerald text-white rounded-lg hover:bg-emerald-dark"
          >
            Try Again
          </button>
        </div>
      </HotelOwnerLayout>
    );
  }
  return (
    <HotelOwnerLayout activeSidebarItem="Dashboard" onAddHotel={() => console.log('Add Hotel')}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-charcoal-light">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <KPICard
            icon={Calendar}
            value={stats?.bookingsToday?.toString() || '0'}
            label="Bookings Today"
            trend={{
              value: stats ? formatTrend(stats.bookingsTodayChange) : '0%',
              isPositive: (stats?.bookingsTodayChange || 0) >= 0,
            }}
            iconColor="blue"
          />
          <KPICard
            icon={Percent}
            value={stats ? `${stats.occupancyRate.toFixed(1)}%` : '0%'}
            label="Occupancy Rate"
            trend={{
              value: stats ? formatTrend(stats.occupancyRateChange) : '0%',
              isPositive: (stats?.occupancyRateChange || 0) >= 0,
            }}
            iconColor="purple"
          />
          <KPICard
            icon={DollarSign}
            value={stats ? `$${stats.monthlyRevenue.toLocaleString()}` : '$0'}
            label="Monthly Revenue"
            trend={{
              value: stats ? formatTrend(stats.monthlyRevenueChange) : '0%',
              isPositive: (stats?.monthlyRevenueChange || 0) >= 0,
            }}
            iconColor="green"
          />
        </div>

        {/* AI Insights */}
        <HotelAIInsightsCard insights={insights} />

        {/* Hotel List */}
        <HotelListTable
          hotels={transformedHotels}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>
    </HotelOwnerLayout>
  );
}
