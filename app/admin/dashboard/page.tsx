'use client';

import AdminLayout from '@/components/shared/AdminLayout';
import MetricCard from '@/components/ui/MetricCard';
import AIInsightsCard from '@/components/ui/AIInsightsCard';
import ModerationCard from '@/components/ui/ModerationCard';
import { Building2, Clock, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const aiSummary =
    'Based on the last 7 days of data, your platform is experiencing strong growth with a 24% increase in revenue. Hotel approval times have decreased by 18%, and user engagement is at an all-time high. Consider expanding marketing efforts in the Mountain View region where demand has increased by 35%.';

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

  return (
    <AdminLayout activeSidebarItem="Dashboard">
      <div className="space-y-4 sm:space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            icon={Building2}
            value="248"
            label="Total Hotels"
            trend={{ value: '12%', isPositive: true }}
            iconColor="green"
          />
          <MetricCard
            icon={Clock}
            value="47"
            label="Pending Approvals"
            badge={{ text: '23 New', color: 'orange' }}
            iconColor="orange"
          />
          <MetricCard
            icon={Users}
            value="12,458"
            label="Active Users"
            trend={{ value: '8%', isPositive: true }}
            iconColor="blue"
          />
          <MetricCard
            icon={DollarSign}
            value="$284K"
            label="Revenue Snapshot"
            trend={{ value: '24%', isPositive: true }}
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
