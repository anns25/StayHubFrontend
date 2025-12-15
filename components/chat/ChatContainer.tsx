'use client';

import { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import SuggestedQuestions from './SuggestedQuestions';
import SummarizeButton from './SummarizeButton';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  message: string;
  sender: 'ai' | 'user';
  timestamp: string;
}

interface ChatContainerProps {
  messages: Message[];
  suggestedQuestions?: string[];
  onSendMessage?: (message: string) => void;
  onQuestionClick?: (question: string) => void;
  onSummarize?: () => void;
}

export default function ChatContainer({
  messages,
  suggestedQuestions = [],
  onSendMessage,
  onQuestionClick,
  onSummarize,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-ivory-dark to-ivory">
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              sender={msg.sender}
              timestamp={msg.timestamp}
            />
          ))}

          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && (
            <SuggestedQuestions
              questions={suggestedQuestions}
              onQuestionClick={onQuestionClick}
            />
          )}

          {/* Summarize Button */}
          {messages.length > 0 && <SummarizeButton onClick={onSummarize} />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSendMessage} />
    </div>
  );
}

