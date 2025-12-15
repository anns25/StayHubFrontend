'use client';

import { Paperclip, Send, Mic, Zap } from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  onSend?: (message: string) => void;
  onAttach?: () => void;
  onVoice?: () => void;
}

export default function ChatInput({ onSend, onAttach, onVoice }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-ivory-light border-t border-gray-200 p-4">
      {/* Input Area */}
      <div className="flex items-center space-x-3 mb-3">
        <button
          onClick={onAttach}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 bg-ivory-dark rounded-lg border-none outline-none focus:ring-2 focus:ring-emerald text-charcoal placeholder-charcoal-lighter"
        />

        <button
          onClick={handleSend}
          className="p-2 bg-gradient-to-r from-emerald-dark to-emerald rounded-lg hover:opacity-90 transition-opacity"
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={onVoice}
          className="p-2 bg-gold hover:bg-gold-dark rounded-lg transition-colors"
          aria-label="Voice input"
        >
          <Mic className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <span>Secure & Private</span>
        <Zap className="w-3 h-3" />
        <span>Powered by AI</span>
      </div>
    </div>
  );
}

