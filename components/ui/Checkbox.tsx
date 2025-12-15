'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className={`w-4 h-4 text-emerald border-gray-300 rounded focus:ring-emerald focus:ring-2 ${className}`}
          {...props}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

