'use client';

import CustomerLayout from '@/components/shared/CustomerLayout';
import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <CustomerLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </CustomerLayout>
  );
}
