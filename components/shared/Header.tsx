'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function Header({ user = { name: 'John Admin', role: 'Administrator' } }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebarOpen) {
      sidebar?.classList.remove('-translate-x-full');
      overlay?.classList.remove('hidden');
    } else {
      sidebar?.classList.add('-translate-x-full');
      overlay?.classList.add('hidden');
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // const navItems: NavItem[] = [
  //   { label: 'Admin Dashboard', href: '/admin/dashboard', active: true },
  //   { label: 'Owner Dashboard', href: '/hotel-owner/dashboard' },
  //   { label: 'Customer Home', href: '/dashboard' },
  //   { label: 'Hotel Details', href: '/hotels' },
  //   { label: 'Booking', href: '/bookings' },
  //   { label: 'Authentication', href: '/login' },
  // ];

  return (
    <header className="bg-ivory-light border-b border-gray-200 sticky top-0 z-50 h-20">
      <div className="px-6 py-4">
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
            <Logo size="sm" showText={true} href="/admin/dashboard" />
          </div>

          {/* Navigation Tabs */}
          {/* <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-emerald text-white'
                    : 'text-charcoal-light hover:text-charcoal hover:bg-ivory-dark'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav> */}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search hotels, users, reviews..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 flex-1"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">JA</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

