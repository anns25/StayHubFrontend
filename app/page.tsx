'use client';

import PublicHeader from '@/components/shared/PublicHeader';
import SearchWidget from '@/components/ui/SearchWidget';
import CategoryFilters from '@/components/ui/CategoryFilters';
import FeaturedHotels from '@/components/ui/FeaturedHotels';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Sparkles, Shield, Zap, Star } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Home() {
  const featuredHotels = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      location: 'Downtown, New York',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      badge: { text: 'Featured', color: 'blue' as const },
    },
    {
      id: '2',
      name: 'Seaside Resort',
      location: 'Miami Beach, Florida',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1627448449276-8c139d0790a6?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800&h=600&fit=crop',
      badge: { text: 'Best Value', color: 'green' as const },
    },
    {
      id: '3',
      name: 'Mountain Lodge',
      location: 'Aspen, Colorado',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    },
    {
      id: '4',
      name: 'Oceanview Resort',
      location: 'San Diego, California',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
      badge: { text: 'Featured', color: 'blue' as const },
    },
    {
      id: '5',
      name: 'City Center Hotel',
      location: 'Chicago, Illinois',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-dark to-emerald py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Discover amazing hotels at the best prices with AI-powered recommendations
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register">
                <Button variant="ghost" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20 !border-2 !border-white/30">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20 !border-2 !border-white/30">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Widget */}
          <div className="flex justify-center mt-12">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Why Choose AI Stay Hub?</h2>
          <p className="text-charcoal-light text-lg">Experience the future of hotel booking</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-ivory-light rounded-xl">
            <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-emerald" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">AI-Powered Recommendations</h3>
            <p className="text-charcoal-light">
              Get personalized hotel suggestions based on your preferences and travel history
            </p>
          </div>
          <div className="text-center p-6 bg-ivory-light rounded-xl">
            <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Secure & Trusted</h3>
            <p className="text-charcoal-light">
              Your data and payments are protected with industry-leading security measures
            </p>
          </div>
          <div className="text-center p-6 bg-ivory-light rounded-xl">
            <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-emerald" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Instant Booking</h3>
            <p className="text-charcoal-light">
              Book your perfect stay in seconds with our streamlined booking process
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilters />
      </section>

      {/* Featured Hotels */}
      <section id="hotels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Featured Hotels</h2>
          <p className="text-charcoal-light text-lg">Handpicked selections for your next adventure</p>
        </div>
        <FeaturedHotels hotels={featuredHotels} />
        <div className="text-center mt-8">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Explore All Hotels
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-dark to-emerald py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of travelers who trust AI Stay Hub for their hotel bookings
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button variant="ghost" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20 !border-2 !border-white/30">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20 !border-2 !border-white/30">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" showText={true} />
              <p className="mt-4 text-gray-400 text-sm">
                AI-powered hotel booking platform for the modern traveler
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get Started</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
                <li><a href="#" className="hover:text-white">For Hotel Owners</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2024 AI Stay Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}