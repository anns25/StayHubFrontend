'use client';

import { useState } from 'react';
import ChatContainer from '@/components/chat/ChatContainer';

interface Message {
  id: string;
  message: string;
  sender: 'ai' | 'user';
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      message: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      message: 'Can you help me understand machine learning?',
      sender: 'user',
      timestamp: '10:31 AM',
    },
    {
      id: '3',
      message:
        'Of course! Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves.',
      sender: 'ai',
      timestamp: '10:31 AM',
    },
    {
      id: '4',
      message: 'What are the main types?',
      sender: 'user',
      timestamp: '10:32 AM',
    },
    {
      id: '5',
      message:
        'There are three main types of machine learning:\n\n1. **Supervised Learning**: The algorithm learns from labeled training data\n2. **Unsupervised Learning**: The algorithm finds patterns in unlabeled data\n3. **Reinforcement Learning**: The algorithm learns through trial and error, receiving rewards or penalties for actions',
      sender: 'ai',
      timestamp: '10:32 AM',
    },
  ]);

  const [suggestedQuestions] = useState([
    'Tell me more',
    'Can you explain further?',
    'What are some examples?',
    'How does it work?',
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };
    setMessages([...messages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        message: 'I understand your question. Let me provide you with more detailed information...',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleSummarize = () => {
    console.log('Summarize conversation');
    // Add summarize functionality here
  };

  return (
    <ChatContainer
      messages={messages}
      suggestedQuestions={suggestedQuestions}
      onSendMessage={handleSendMessage}
      onQuestionClick={handleQuestionClick}
      onSummarize={handleSummarize}
    />
  );
}

