import { Brain } from 'lucide-react';

interface AIInsightsCardProps {
  summary: string;
  onViewReport?: () => void;
  onDismiss?: () => void;
}

export default function AIInsightsCard({ summary, onViewReport, onDismiss }: AIInsightsCardProps) {
  return (
    <div className="bg-gradient-to-r from-emerald/10 to-emerald/5 rounded-xl p-6 border border-emerald/20">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-charcoal mb-2">AI Insights Summary</h3>
          <p className="text-charcoal-light leading-relaxed mb-4">{summary}</p>
          <div className="flex items-center space-x-4">
            {onViewReport && (
              <button
                onClick={onViewReport}
                className="text-emerald font-medium hover:text-emerald-dark text-sm"
              >
                View Full Report
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
