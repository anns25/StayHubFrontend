'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-ivory-light border-b border-gray-200 sticky top-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Logo size="sm" showText={true} href="/" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-charcoal hover:text-emerald font-medium transition-colors">
              Features
            </a>
            <a href="#hotels" className="text-charcoal hover:text-emerald font-medium transition-colors">
              Hotels
            </a>
            <a href="#about" className="text-charcoal hover:text-emerald font-medium transition-colors">
              About
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Sign In Button */}
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:block">
                Sign In
              </Button>
            </Link>

            {/* Register Button */}
            <Link href="/register">
              <Button variant="primary" className="hidden sm:block">
                Sign Up
              </Button>
            </Link>

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
              <a href="#features" className="text-gray-700 hover:text-emerald font-medium">
                Features
              </a>
              <a href="#hotels" className="text-gray-700 hover:text-emerald font-medium">
                Hotels
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald font-medium">
                About
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link href="/login">
                  <Button variant="ghost" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}