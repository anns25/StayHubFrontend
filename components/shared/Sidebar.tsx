'use client';

import { useEffect } from 'react';
import { LayoutDashboard, Building2, Users, Star, BarChart3, Settings, X, LogOut } from 'lucide-react';
import { logout } from '@/lib/api';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem = 'Dashboard' }: SidebarProps) {
  const closeSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar?.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/admin/dashboard',
      active: activeItem === 'Dashboard',
    },
    {
      label: 'Hotels',
      icon: <Building2 className="w-5 h-5" />,
      href: '/admin/hotels',
      active: activeItem === 'Hotels',
    },
    {
      label: 'Users',
      icon: <Users className="w-5 h-5" />,
      href: '/admin/users',
      active: activeItem === 'Users',
    },
    {
      label: 'Reviews',
      icon: <Star className="w-5 h-5" />,
      href: '/admin/reviews',
      active: activeItem === 'Reviews',
    },
    {
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      href: '/admin/analytics',
      active: activeItem === 'Analytics',
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/admin/settings',
      active: activeItem === 'Settings',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 hidden"
        id="sidebar-overlay"
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className="w-64 bg-emerald-dark min-h-screen fixed left-0 top-20 bottom-0 overflow-y-auto z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300" id="sidebar">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8 lg:block">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-ivory">Admin Panel</h2>
              <p className="text-xs sm:text-sm text-ivory/80 mt-1">System Control</p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <a
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
              </a>
            ))}
          </nav>
          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-emerald/20">
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

