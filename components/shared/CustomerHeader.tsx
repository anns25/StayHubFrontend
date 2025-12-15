'use client';

import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-ivory-light border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">🏨</span>
            </div>
            <span className="text-xl font-bold text-charcoal">StayFinder</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-charcoal hover:text-emerald font-medium">
              Home
            </a>
            <a href="/deals" className="text-charcoal hover:text-emerald font-medium">
              Deals
            </a>
            <a href="/bookings" className="text-charcoal hover:text-emerald font-medium">
              My Bookings
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Favorites Icon */}
            <button className="p-2 text-charcoal hover:text-emerald transition-colors">
              <Heart className="w-5 h-5" />
            </button>

            {/* Sign In Button */}
            <button className="hidden sm:block bg-emerald hover:bg-emerald-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Sign In
            </button>

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
              <a href="/" className="text-gray-700 hover:text-stayfinder-blue font-medium">
                Home
              </a>
              <a href="/deals" className="text-gray-700 hover:text-stayfinder-blue font-medium">
                Deals
              </a>
              <a href="/bookings" className="text-gray-700 hover:text-stayfinder-blue font-medium">
                My Bookings
              </a>
              <button className="bg-stayfinder-blue hover:bg-stayfinder-blue-dark text-white px-6 py-2 rounded-lg font-medium transition-colors text-left">
                Sign In
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

