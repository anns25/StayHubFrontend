import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  badge?: {
    text: string;
    color: 'orange' | 'green' | 'blue' | 'red';
  };
  iconColor: 'green' | 'orange' | 'blue' | 'red';
}

export default function MetricCard({
  icon: Icon,
  value,
  label,
  trend,
  badge,
  iconColor,
}: MetricCardProps) {
  const iconColorClasses = {
    green: 'bg-emerald/20 text-emerald',
    orange: 'bg-gold/20 text-gold',
    blue: 'bg-emerald/20 text-emerald',
    red: 'bg-danger-light text-danger',
  };

  const badgeColorClasses = {
    orange: 'bg-warning-light text-warning',
    green: 'bg-success-light text-success',
    blue: 'bg-info-light text-info',
    red: 'bg-danger-light text-danger',
  };

  return (
    <div className="bg-ivory-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconColorClasses[iconColor]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-charcoal mb-1">{value}</div>
          <div className="text-sm text-charcoal-light mb-2">{label}</div>
          {trend && (
            <div className={`text-sm font-medium ${trend.isPositive ? 'text-emerald' : 'text-danger'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </div>
          )}
        </div>
        {badge && (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColorClasses[badge.color]}`}>
            {badge.text}
          </div>
        )}
      </div>
    </div>
  );
}

