'use client';

import AdminLayout from '@/components/shared/AdminLayout';
import MetricCard from '@/components/ui/MetricCard';
import AIInsightsCard from '@/components/ui/AIInsightsCard';
import ModerationCard from '@/components/ui/ModerationCard';
import { Building2, Clock, Users, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPlatformAnalytics, getPendingApprovals } from '@/lib/api';

interface PlatformAnalytics {
  hotels: {
    total: number;
    approved: number;
    pending: number;
    newPendingToday: number;
    trend: number;
  };
  users: {
    total: number;
    active: number;
    customers: number;
    owners: number;
    admins: number;
    trend: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    currentMonth: number;
    previousMonth: number;
    allTime: number;
    trend: number;
  };
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsResponse, pendingResponse] = await Promise.all([
        getPlatformAnalytics(),
        getPendingApprovals(),
      ]);
      setAnalytics(analyticsResponse.data);
      setPendingCount(pendingResponse.data?.hotels?.length || 0);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format trend value - returns null if no meaningful comparison
  const formatTrend = (value: number | undefined | null, currentValue?: number) => {
    // Handle NaN, undefined, or null
    if (value === null || value === undefined || isNaN(value)) {
      return null;
    }

    // Don't show trend if current value is 0 (no meaningful trend to show)
    if (currentValue !== undefined && currentValue === 0) {
      return null;
    }

    // Hide extremely high trends (>500%) as they're usually misleading
    // (e.g., going from 0 to 1 user = infinite percentage)
    if (Math.abs(value) > 500) {
      return null;
    }

    // If trend is exactly 0, don't show it
    if (value === 0) {
      return null;
    }

    const sign = value >= 0 ? '↑' : '↓';
    const absValue = Math.abs(value).toFixed(1);
    return `${sign} ${absValue}%`;
  };

  // Format revenue
  const formatRevenue = (amount: number | undefined | null) => {
    if (!amount && amount !== 0) {
      return '$0';
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Generate AI summary based on analytics
  const generateAISummary = (): string => {
    if (!analytics) return 'Loading platform insights...';

    const revenueChange = analytics.revenue.trend;
    const hotelsChange = analytics.hotels.trend;
    const usersChange = analytics.users.trend;
    const pendingHotels = analytics.hotels.pending;

    const insights = [];

    if (revenueChange > 0) {
      insights.push(`Platform revenue is up ${Math.abs(revenueChange).toFixed(1)}% this month.`);
    }

    if (hotelsChange > 0) {
      insights.push(`Hotel listings have grown by ${Math.abs(hotelsChange).toFixed(1)}% in the last 30 days.`);
    }

    if (usersChange > 0) {
      insights.push(`User registrations increased by ${Math.abs(usersChange).toFixed(1)}% recently.`);
    }

    if (pendingHotels > 0) {
      insights.push(`${pendingHotels} hotel${pendingHotels > 1 ? 's are' : ' is'} pending approval.`);
    }

    if (insights.length === 0) {
      return 'Platform is operating normally. Monitor key metrics for growth opportunities.';
    }

    return insights.join(' ') + ' Continue monitoring these trends for strategic decisions.';
  };

  const aiSummary = generateAISummary();

  // Mock moderation items (can be replaced with real data later)
  const moderationItems = [
    {
      type: 'inappropriate' as const,
      title: 'Inappropriate Review Content',
      description: 'Review from user @john_doe contains potentially offensive language.',
      confidence: 87,
      actions: {
        primary: {
          label: 'Remove',
          onClick: () => console.log('Remove clicked'),
        },
        secondary: {
          label: 'Approve',
          onClick: () => console.log('Approve clicked'),
        },
        tertiary: {
          label: 'View Details',
          onClick: () => console.log('View Details clicked'),
        },
      },
    },
    {
      type: 'suspicious' as const,
      title: 'Suspicious Hotel Listing',
      description: 'Hotel "Paradise Inn" has pricing anomalies and duplicate images.',
      confidence: 72,
      actions: {
        primary: {
          label: 'Investigate',
          onClick: () => console.log('Investigate clicked'),
        },
        secondary: {
          label: 'Approve',
          onClick: () => console.log('Approve clicked'),
        },
        tertiary: {
          label: 'View Details',
          onClick: () => console.log('View Details clicked'),
        },
      },
    },
  ];

  if (loading) {
    return (
      <AdminLayout activeSidebarItem="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activeSidebarItem="Dashboard">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-emerald text-white rounded-lg hover:bg-emerald-dark"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeSidebarItem="Dashboard">
      <div className="space-y-4 sm:space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            icon={Building2}
            value={analytics?.hotels.total.toString() || '0'}
            label="Total Hotels"
            trend={
              analytics
                ? (() => {
                  const trendValue = formatTrend(analytics.hotels.trend);
                  return trendValue
                    ? {
                      value: trendValue,
                      isPositive: (analytics.hotels.trend || 0) >= 0,
                    }
                    : undefined;
                })()
                : undefined
            }
            iconColor="green"
          />
          <MetricCard
            icon={Clock}
            value={analytics?.hotels.pending.toString() || '0'}
            label="Pending Approvals"
            badge={
              analytics && analytics.hotels.newPendingToday > 0
                ? { text: `${analytics.hotels.newPendingToday} New`, color: 'orange' }
                : undefined
            }
            iconColor="orange"
          />
          <MetricCard
            icon={Users}
            value={(analytics?.users?.active ?? 0).toLocaleString()}
            label="Active Users"
            trend={
              analytics
                ? (() => {
                    const trendValue = formatTrend(analytics.users.trend, analytics.users.active);
                    return trendValue
                      ? {
                          value: trendValue,
                          isPositive: (analytics.users.trend || 0) >= 0,
                        }
                      : undefined;
                  })()
                : undefined
            }
            iconColor="blue"
          />
          <MetricCard
            icon={DollarSign}
            value={analytics ? formatRevenue(analytics.revenue.currentMonth) : '$0'}
            label="Revenue Snapshot"
            trend={
              analytics
                ? (() => {
                  const trendValue = formatTrend(analytics.revenue.trend);
                  return trendValue
                    ? {
                      value: trendValue,
                      isPositive: (analytics.revenue.trend || 0) >= 0,
                    }
                    : undefined;
                })()
                : undefined
            }
            iconColor="green"
          />
        </div>

        {/* AI Insights Summary */}
        <AIInsightsCard
          summary={aiSummary}
          onViewReport={() => console.log('View Full Report')}
          onDismiss={() => console.log('Dismiss')}
        />

        {/* AI Moderation Summary */}
        <ModerationCard
          items={moderationItems}
          onViewAll={() => console.log('View All')}
        />
      </div>
    </AdminLayout>
  );
}