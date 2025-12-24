'use client';

import HotelCard from './HotelCard';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  badge?: {
    text: string;
    color: 'blue' | 'green';
  };
}

interface FeaturedHotelsProps {
  hotels: Hotel[];
}

export default function FeaturedHotels({ hotels }: FeaturedHotelsProps) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-charcoal mb-6">Featured Hotels</h2>
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            id={hotel.id}
            name={hotel.name}
            location={hotel.location}
            rating={hotel.rating}
            image={hotel.image}
            badge={hotel.badge}
            onFavorite={() => console.log('Favorite:', hotel.name)}
          />
        ))}
      </div>
    </section>
  );
}

