'use client';

import { Bot } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-emerald rounded-full shadow-lg flex items-center justify-center text-white hover:bg-emerald-dark transition-colors z-50 hover:scale-110 transform transition-transform"
      aria-label="AI Assistant"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
}

