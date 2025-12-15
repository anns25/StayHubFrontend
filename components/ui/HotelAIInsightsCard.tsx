import { Bot, Check } from 'lucide-react';

interface InsightItem {
  text: string;
}

interface HotelAIInsightsCardProps {
  title?: string;
  subtitle?: string;
  insights: InsightItem[];
}

export default function HotelAIInsightsCard({
  title = 'AI Insights',
  subtitle = 'Smart recommendations for your business',
  insights,
}: HotelAIInsightsCardProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-dark to-emerald rounded-xl p-6 text-white relative overflow-hidden">
      {/* Robot Icon */}
      <div className="absolute top-4 right-4">
        <Bot className="w-6 h-6 text-white/80" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-sm text-white/90 mb-6">{subtitle}</p>

        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-white/95 leading-relaxed">{insight.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
