'use client';

import CustomerHeader from '@/components/shared/CustomerHeader';
import SearchWidget from '@/components/ui/SearchWidget';
import CategoryFilters from '@/components/ui/CategoryFilters';
import FeaturedHotels from '@/components/ui/FeaturedHotels';

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
      <CustomerHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-dark to-emerald py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Discover amazing hotels at the best prices
            </p>
          </div>

          {/* Search Widget */}
          <div className="flex justify-center">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilters />
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedHotels hotels={featuredHotels} />
      </section>
    </div>
  );
}
