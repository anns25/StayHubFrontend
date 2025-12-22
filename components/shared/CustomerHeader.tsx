'use client';

import { Heart, Menu, X, User, LogOut, Calendar, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Logo from '@/components/ui/Logo';
import { useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';

export default function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  // Get user details safely
  const userInitials = mounted && user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName = mounted && user?.name ? user.name : 'User';
  const userProfileImage = mounted && user?.profileImage ? user.profileImage : null;

  return (
    <header className="bg-ivory-light border-b border-gray-200 sticky top-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Logo size="sm" showText={true} href="/customer/dashboard" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/customer/dashboard" className="text-charcoal hover:text-emerald font-medium transition-colors">
              Dashboard
            </a>
            <a href="/customer/search" className="text-charcoal hover:text-emerald font-medium transition-colors">
              Search Hotels
            </a>
            <a href="/customer/bookings" className="text-charcoal hover:text-emerald font-medium transition-colors">
              My Bookings
            </a>
            <a href="/customer/favorites" className="text-charcoal hover:text-emerald font-medium transition-colors">
              Favorites
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <a href="/customer/search" className="p-2 text-charcoal hover:text-emerald transition-colors">
              <Search className="w-5 h-5" />
            </a>

            {/* Favorites Icon */}
            <a href="/customer/favorites" className="p-2 text-charcoal hover:text-emerald transition-colors">
              <Heart className="w-5 h-5" />
            </a>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {userProfileImage ? (
                  <img
                    src={userProfileImage}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald"
                    suppressHydrationWarning
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-dark to-emerald rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium" suppressHydrationWarning>
                      {userInitials}
                    </span>
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900" suppressHydrationWarning>
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500">Customer</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <a href="/customer/profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </a>
                  <a href="/customer/bookings" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="/customer/dashboard" className="text-gray-700 hover:text-emerald font-medium">
                Dashboard
              </a>
              <a href="/customer/search" className="text-gray-700 hover:text-emerald font-medium">
                Search Hotels
              </a>
              <a href="/customer/bookings" className="text-gray-700 hover:text-emerald font-medium">
                My Bookings
              </a>
              <a href="/customer/favorites" className="text-gray-700 hover:text-emerald font-medium">
                Favorites
              </a>
              <a href="/customer/profile" className="text-gray-700 hover:text-emerald font-medium">
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="bg-emerald hover:bg-emerald-dark text-white px-6 py-2 rounded-lg font-medium transition-colors text-left"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}