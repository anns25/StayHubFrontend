'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Building2, Bed, Wand2, Calendar, BarChart3, X, LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { logout } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

interface HotelOwnerSidebarProps {
  activeItem?: string;
}

export default function HotelOwnerSidebar({ activeItem = 'Dashboard' }: HotelOwnerSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSidebar = () => {
    const sidebar = document.getElementById('hotel-owner-sidebar');
    const overlay = document.getElementById('hotel-owner-sidebar-overlay');
    sidebar?.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
  };

  const handleLogout = async () => {
    await logout();
  };

  const userInitials = mounted && user?.name ? user.name.charAt(0).toUpperCase() : 'H';
  const userName = mounted && user?.name ? user.name : 'Hotel Owner';
  const userEmail = mounted && user?.email ? user.email : '';
  const userProfileImage = mounted && user?.profileImage ? user.profileImage : null;
  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/hotel-owner/dashboard',
      active: activeItem === 'Dashboard',
    },
    {
      label: 'Hotels',
      icon: <Building2 className="w-5 h-5" />,
      href: '/hotel-owner/hotels',
      active: activeItem === 'Hotels',
    },
    {
      label: 'Rooms',
      icon: <Bed className="w-5 h-5" />,
      href: '/hotel-owner/rooms',
      active: activeItem === 'Rooms',
    },
    {
      label: 'AI Tools',
      icon: <Wand2 className="w-5 h-5" />,
      href: '/hotel-owner/ai-tools',
      active: activeItem === 'AI Tools',
    },
    {
      label: 'Bookings',
      icon: <Calendar className="w-5 h-5" />,
      href: '/hotel-owner/bookings',
      active: activeItem === 'Bookings',
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      label: 'Profile Settings',
      icon: <User className="w-5 h-5" />,
      href: '/hotel-owner/profile',
      active: activeItem === 'Profile',
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/hotel-owner/settings',
      active: activeItem === 'Settings',
    },
    {
      label: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      href: '/hotel-owner/help',
      active: activeItem === 'Help',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 hidden"
        id="hotel-owner-sidebar-overlay"
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className="w-64 bg-emerald-dark fixed left-0 top-20 bottom-0 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 border-r border-emerald flex flex-col"
        id="hotel-owner-sidebar"
      >
        <div className="flex flex-col h-full p-4 sm:p-6">

          {/* User Profile Section */}
          <div className="mb-6 pb-6 border-b border-emerald/20 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-3">
              {userProfileImage ? (
                <img
                  src={userProfileImage}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald flex-shrink-0"
                  suppressHydrationWarning
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-emerald to-emerald-dark rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-semibold" suppressHydrationWarning>
                    {userInitials}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate" suppressHydrationWarning>
                  {userName}
                </div>
                <div className="text-xs text-ivory/80 truncate" suppressHydrationWarning>
                  {userEmail}
                </div>
              </div>
            </div>
            <div className="text-xs text-ivory/60">Hotel Owner</div>
          </div>

          {/* Main Navigation - Takes available space */}
          <nav className="space-y-2 flex-1 min-h-0">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${item.active
                    ? 'bg-emerald text-white font-medium'
                    : 'text-ivory hover:bg-emerald/20'
                  }`}
              >
                {item.icon}
                <span className="text-xs sm:text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Section - Settings and Logout */}
          <div className="flex-shrink-0 pt-4 border-t border-emerald/20">
            {/* Settings Section */}
            <div className="mb-4">
              <div className="px-3 sm:px-4 mb-2">
                <span className="text-xs text-ivory/60 uppercase tracking-wider">Settings</span>
              </div>
              <nav className="space-y-2">
                {settingsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${item.active
                        ? 'bg-emerald text-white font-medium'
                        : 'text-ivory hover:bg-emerald/20'
                      }`}
                  >
                    {item.icon}
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors w-full text-ivory hover:bg-red-600/20 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs sm:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

