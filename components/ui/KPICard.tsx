import { LucideIcon, TrendingUp } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  iconColor: 'blue' | 'purple' | 'green' | 'orange';
}

export default function KPICard({
  icon: Icon,
  value,
  label,
  trend,
  iconColor,
}: KPICardProps) {
  const iconColorClasses = {
    blue: 'bg-emerald/20 text-emerald',
    purple: 'bg-gold/20 text-gold',
    green: 'bg-emerald/20 text-emerald',
    orange: 'bg-gold/20 text-gold',
  };

  return (
    <div className="bg-ivory-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClasses[iconColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-3xl font-bold text-charcoal mb-1">{value}</div>
      <div className="text-sm text-charcoal-light mb-2">{label}</div>
      <div className="flex items-center space-x-1 text-sm font-medium text-emerald">
        <TrendingUp className="w-4 h-4" />
        <span>{trend.value}</span>
      </div>
    </div>
  );
}

