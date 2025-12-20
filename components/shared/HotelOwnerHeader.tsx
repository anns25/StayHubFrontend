'use client';

import { useState, useEffect } from 'react';
import { Bell, Menu, X, Building2, Bed, Clock } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface HotelOwnerHeaderProps {
  onAddHotel?: () => void;
}

export default function HotelOwnerHeader({ onAddHotel }: HotelOwnerHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Determine if we should show Add Hotel button (hide on hotels page)
  const showAddHotel = mounted && pathname !== '/hotel-owner/hotels';
  const isPendingApproval = mounted && user && !user.isApproved;
  const showQuickStats = mounted && pathname === '/hotel-owner/dashboard';

  return (
    <header className="bg-ivory-light border-b border-gray-200 sticky top-0 z-50 h-20">
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
            <Logo size="sm" showText={true} href="/hotel-owner/dashboard" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Pending Approval Badge - Only show if not approved */}
            {isPendingApproval && (
              <Link
                href="/hotel-owner/pending-approval"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-lg hover:bg-warning/20 transition-colors text-sm font-medium"
                suppressHydrationWarning
              >
                <Clock className="w-4 h-4" />
                <span>Pending Approval</span>
              </Link>
            )}

            {/* Quick Stats - Show on dashboard */}
            {showQuickStats && (
              <div className="hidden lg:flex items-center space-x-4 px-4 py-2 bg-white rounded-lg border border-gray-200" suppressHydrationWarning>
                <Link
                  href="/hotel-owner/hotels"
                  className="flex items-center space-x-1.5 text-sm text-charcoal hover:text-emerald transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">Hotels</span>
                </Link>
                <div className="w-px h-4 bg-gray-300"></div>
                <Link
                  href="/hotel-owner/rooms"
                  className="flex items-center space-x-1.5 text-sm text-charcoal hover:text-emerald transition-colors"
                >
                  <Bed className="w-4 h-4" />
                  <span className="font-medium">Rooms</span>
                </Link>
              </div>
            )}

            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Add Hotel Button - Only show when not on hotels page */}
            {showAddHotel && onAddHotel && (
              <button
                onClick={onAddHotel}
                className="hidden sm:flex items-center space-x-2 bg-emerald hover:bg-emerald-dark text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                suppressHydrationWarning
              >
                <Building2 className="w-4 h-4" />
                <span>Add Hotel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

