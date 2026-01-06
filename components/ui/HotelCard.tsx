'use client';

import { Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToFavorites, removeFromFavorites } from '@/lib/api';

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  badge?: {
    text: string;
    color: 'blue' | 'green';
  };
  onFavorite?: () => void;
  isFavorite?: boolean;
  onFavoriteChange?: (hotelId: string, isFavorite: boolean) => void;
}

export default function HotelCard({
  id,
  name,
  location,
  rating,
  image,
  badge,
  onFavorite,
  isFavorite = false,
  onFavoriteChange,
}: HotelCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    const newFavoriteState = !favorite;

    // Optimistic update
    setFavorite(newFavoriteState);
    setLoading(true);

    try {
      if (newFavoriteState) {
        await addToFavorites(id);
      } else {
        await removeFromFavorites(id);
      }
      // Notify parent of change
      onFavoriteChange?.(id, newFavoriteState);
    } catch (error: any) {
      // Revert on error
      setFavorite(!newFavoriteState);
      alert(error.message || 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/customer/hotels/${id}`} className="block">
      <div className="bg-ivory-light rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow w-full">
        {/* Image Container */}
        <div className="relative h-48 w-full bg-gray-200">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />

          {/* Badge */}
          {badge && (
            <div
              className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${badge.color === 'blue' ? 'bg-emerald' : 'bg-gold'
                }`}
            >
              {badge.text}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={loading}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-charcoal-lighter'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-charcoal mb-1">{name}</h3>
          <p className="text-sm text-charcoal-light mb-3">{location}</p>
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-gold text-gold" />
            <span className="text-sm font-medium text-charcoal">{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

