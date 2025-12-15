'use client';

import { ChevronDown } from 'lucide-react';
import { forwardRef, useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-4 py-3 bg-ivory-light border ${
              error ? 'border-red-500' : isFocused ? 'border-emerald ring-2 ring-emerald/20' : 'border-gray-300'
            } rounded-lg outline-none appearance-none transition-all cursor-pointer text-charcoal ${
              className
            }`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isFocused ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
