'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-dark to-emerald text-white hover:opacity-90 focus:ring-emerald',
    secondary: 'bg-gray-200 text-charcoal hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border-2 border-emerald text-emerald hover:bg-emerald/10 focus:ring-emerald',
    ghost: 'text-charcoal hover:bg-gray-100 focus:ring-gray-500',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

