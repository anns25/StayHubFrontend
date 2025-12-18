'use client';

import { Building2 } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
  layout?: 'horizontal' | 'vertical';
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  className = '',
  href,
  layout = 'horizontal'
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', box: 'w-10 h-10', text: 'text-base', textVertical: 'text-lg' },
    md: { icon: 'w-8 h-8', box: 'w-16 h-16', text: 'text-xl', textVertical: 'text-2xl' },
    lg: { icon: 'w-10 h-10', box: 'w-20 h-20', text: 'text-2xl', textVertical: 'text-3xl' },
  };

  const { icon, box, text, textVertical} = sizeClasses[size];
  const textSize = layout === 'vertical' ? textVertical : text;

  const logoContent = (
    <div className={`flex ${layout === 'vertical'? 'flex-col items-center space-y-3' : 'items-center space-x-3'} ${className}`}>
      <div className={`${box} bg-gradient-to-r from-emerald-dark to-emerald rounded-xl flex items-center justify-center shadow-lg`}>
        <Building2 className={`${icon} text-white`} />
      </div>
      {showText && (
        <span className={`${textSize} font-bold bg-gradient-to-r from-emerald-dark to-emerald bg-clip-text text-transparent`}>
          Stay Hub
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}