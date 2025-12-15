'use client';

import { Bot } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  sender: 'ai' | 'user';
  timestamp: string;
}

export default function ChatMessage({ message, sender, timestamp }: ChatMessageProps) {
  const isAI = sender === 'ai';

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-gray-600" />
        </div>
      )}

      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[70%] sm:max-w-[60%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAI
              ? 'bg-ivory-dark text-charcoal'
              : 'bg-gradient-to-r from-emerald-dark to-emerald text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.split('**').map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">{timestamp}</span>
      </div>

      {!isAI && (
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-dark to-emerald rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-medium">U</span>
        </div>
      )}
    </div>
  );
}

