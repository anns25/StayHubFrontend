'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Menu, X } from 'lucide-react';

interface HotelOwnerHeaderProps {
  onAddHotel?: () => void;
}

export default function HotelOwnerHeader({ onAddHotel }: HotelOwnerHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.getElementById('hotel-owner-sidebar');
    const overlay = document.getElementById('hotel-owner-sidebar-overlay');
    
    if (sidebarOpen) {
      sidebar?.classList.remove('-translate-x-full');
      overlay?.classList.remove('hidden');
    } else {
      sidebar?.classList.add('-translate-x-full');
      overlay?.classList.add('hidden');
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <header className="bg-ivory-light border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🏨</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-charcoal">HotelPro</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
            </button>

            {/* Add Hotel Button */}
            <button
              onClick={onAddHotel}
              className="flex items-center space-x-2 bg-emerald hover:bg-emerald-dark text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Hotel</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

