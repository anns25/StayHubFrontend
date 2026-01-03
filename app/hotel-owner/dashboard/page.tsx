'use client';

import HotelOwnerLayout from '@/components/shared/HotelOwnerLayout';
import KPICard from '@/components/ui/KPICard';
import HotelAIInsightsCard from '@/components/ui/HotelAIInsightsCard';
import HotelListTable from '@/components/ui/HotelListTable';
import { Calendar, Percent, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { getMyHotels } from '@/lib/api';
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

// Transform backend hotel to HotelListTable format
const transformHotelForTable = (hotel: Hotel) => {
  const locationString = `${hotel.location.city}, ${hotel.location.state}`;

  // Determine status based on hotel properties
  let status: 'Active' | 'Maintenance' | 'Inactive' = 'Inactive';
  if (hotel.isActive && hotel.isApproved) {
    status = 'Active';
  } else if (hotel.isActive && !hotel.isApproved) {
    status = 'Maintenance'; // Pending approval
  }

  return {
    id: hotel._id,
    name: hotel.name,
    location: locationString,
    status,
    rooms: 0, // TODO: Get actual room count from API
    revenue: '$0', // TODO: Get actual revenue from API
  };
};

export default function HotelOwnerDashboard() {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [hotels, setHotels] = useState<Hotel[]>([]);
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
    fetchHotels();
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

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyHotels();
      setHotels(response.data || []);
    } catch (error: any) {
      console.error('Error fetching hotels:', error);
      setError(error.message || 'Failed to fetch hotels');
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

  const transformedHotels = hotels.map(transformHotelForTable);

  // Display active hotel info if available
  const activeHotelInfo = activeHotel?.hotel;

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
            value="47"
            label="Bookings Today"
            trend={{ value: '↑ 12%', isPositive: true }}
            iconColor="blue"
          />
          <KPICard
            icon={Percent}
            value="78.5%"
            label="Occupancy Rate"
            trend={{ value: '↑ 8%', isPositive: true }}
            iconColor="purple"
          />
          <KPICard
            icon={DollarSign}
            value="$124,580"
            label="Monthly Revenue"
            trend={{ value: '↑ 15%', isPositive: true }}
            iconColor="green"
          />
        </div>

        {/* AI Insights */}
        <HotelAIInsightsCard insights={insights} />

        {/* Hotel List */}
        <HotelListTable
          hotels={transformedHotels}
          onEdit={(hotel) => console.log('Edit:', hotel)}
          onView={(hotel) => console.log('View:', hotel)}
          onDelete={(hotel) => console.log('Delete:', hotel)}
        />
      </div>
    </HotelOwnerLayout>
  );
}
