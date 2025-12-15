'use client';

import { Check } from 'lucide-react';

interface SummarizeButtonProps {
  onClick?: () => void;
}

export default function SummarizeButton({ onClick }: SummarizeButtonProps) {
  return (
    <div className="flex justify-center my-4">
      <button
        onClick={onClick}
        className="flex items-center space-x-2 bg-emerald hover:bg-emerald-dark text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
      >
        <Check className="w-5 h-5" />
        <span>Summarize with AI</span>
      </button>
    </div>
  );
}

