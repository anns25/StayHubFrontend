'use client';

import { Crown, Briefcase, MapPin, Users, Waves, Building2 } from 'lucide-react';
import { useState } from 'react';

interface CategoryFiltersProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilters({
  selectedCategory: controlledCategory,
  onCategoryChange
}: CategoryFiltersProps = {}) {
  // Use controlled state if provided, otherwise use internal state
  const [internalCategory, setInternalCategory] = useState('');
  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;

  // Categories matching backend enum: 'budget', 'mid-range', 'luxury', 'boutique', 'resort'
  const categories = [
    { id: 'luxury', label: 'Luxury', Icon: Crown },
    { id: 'resort', label: 'Resort', Icon: Waves },
    { id: 'boutique', label: 'Boutique', Icon: Building2 },
    { id: 'budget', label: 'Budget', Icon: Briefcase },
    { id: 'mid-range', label: 'Mid-Range', Icon: Users },
  ];

  const handleCategoryClick = (categoryId: string) => {
    // Toggle: if clicking the same category, deselect it
    const newCategory = selectedCategory === categoryId ? '' : categoryId;
    
    if (onCategoryChange) {
      // Controlled mode - notify parent
      onCategoryChange(newCategory);
    } else {
      // Uncontrolled mode - update internal state
      setInternalCategory(newCategory);
    }
  };

  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const IconComponent = category.Icon;
        if (!IconComponent) return null;

        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
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