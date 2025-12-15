import { Shield, AlertTriangle, Flag } from 'lucide-react';

interface ModerationItem {
  type: 'inappropriate' | 'suspicious';
  title: string;
  description: string;
  confidence: number;
  actions: {
    primary: { label: string; onClick: () => void };
    secondary: { label: string; onClick: () => void };
    tertiary: { label: string; onClick: () => void };
  };
}

interface ModerationCardProps {
  items: ModerationItem[];
  onViewAll?: () => void;
}

export default function ModerationCard({ items, onViewAll }: ModerationCardProps) {
  return (
    <div className="bg-ivory-light rounded-xl p-6 shadow-card border border-danger/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-danger-light rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-danger" />
          </div>
          <h3 className="text-lg font-semibold text-charcoal">AI Moderation Summary</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-charcoal-lighter hover:text-charcoal font-medium"
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              item.type === 'inappropriate' ? 'bg-danger-light/30' : 'bg-warning-light/30'
            }`}
          >
            <div className="flex items-start space-x-3 mb-3">
              {item.type === 'inappropriate' ? (
                <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              ) : (
                <Flag className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-charcoal mb-1">{item.title}</h4>
                <p className="text-sm text-charcoal-light mb-2">{item.description}</p>
                <p className="text-xs text-charcoal-lighter">Confidence: {item.confidence}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={item.actions.primary.onClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  item.type === 'inappropriate'
                    ? 'bg-danger text-white hover:bg-danger/90'
                    : 'bg-warning text-white hover:bg-warning/90'
                }`}
              >
                {item.actions.primary.label}
              </button>
              <button
                onClick={item.actions.secondary.onClick}
                className="px-4 py-2 rounded-lg text-sm font-medium text-charcoal-light bg-ivory-light border border-gray-300 hover:bg-ivory-dark"
              >
                {item.actions.secondary.label}
              </button>
              <button
                onClick={item.actions.tertiary.onClick}
                className="px-4 py-2 rounded-lg text-sm font-medium text-charcoal-lighter hover:text-charcoal"
              >
                {item.actions.tertiary.label}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

