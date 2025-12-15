'use client';

import { Bot, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function ChatHeader() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-ivory-light border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-dark to-emerald rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-emerald">AI Assistant</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                Clear Chat
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                Help
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

