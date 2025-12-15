'use client';

import { Crown, Briefcase, MapPin, Users, Waves } from 'lucide-react';
import { useState } from 'react';

export default function CategoryFilters() {
  const [selectedCategory, setSelectedCategory] = useState('family');

  const categories = [
    { id: 'family', label: 'Family', Icon: Users },
    { id: 'luxury', label: 'Luxury', Icon: Crown },
    { id: 'budget', label: 'Budget', Icon: Briefcase },
    { id: 'near-me', label: 'Near Me', Icon: MapPin },
    { id: 'business', label: 'Business', Icon: Briefcase },
    { id: 'beach', label: 'Beach', Icon: Waves },
  ];

  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const IconComponent = category.Icon;
        if (!IconComponent) return null;
        
        return (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-emerald text-white'
                : 'bg-ivory-light text-charcoal hover:bg-ivory-dark'
            }`}
          >
            <IconComponent className="w-5 h-5" />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}

