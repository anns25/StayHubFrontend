'use client';

import HotelOwnerLayout from '@/components/shared/HotelOwnerLayout';
import KPICard from '@/components/ui/KPICard';
import HotelAIInsightsCard from '@/components/ui/HotelAIInsightsCard';
import HotelListTable from '@/components/ui/HotelListTable';
import { Calendar, Percent, DollarSign } from 'lucide-react';

export default function HotelOwnerDashboard() {
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

  const hotels = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      location: 'New York, NY',
      status: 'Active' as const,
      rooms: 156,
      revenue: '$45,280',
    },
    {
      id: '2',
      name: 'Seaside Resort',
      location: 'Miami, FL',
      status: 'Active' as const,
      rooms: 89,
      revenue: '$38,920',
    },
    {
      id: '3',
      name: 'Mountain View Lodge',
      location: 'Denver, CO',
      status: 'Maintenance' as const,
      rooms: 64,
      revenue: '$22,150',
    },
    {
      id: '4',
      name: 'Downtown Boutique',
      location: 'San Francisco, CA',
      status: 'Active' as const,
      rooms: 42,
      revenue: '$18,230',
    },
  ];

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
          hotels={hotels}
          onEdit={(hotel) => console.log('Edit:', hotel)}
          onView={(hotel) => console.log('View:', hotel)}
          onDelete={(hotel) => console.log('Delete:', hotel)}
        />
      </div>
    </HotelOwnerLayout>
  );
}
