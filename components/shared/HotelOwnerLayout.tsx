'use client';

import HotelOwnerHeader from './HotelOwnerHeader';
import HotelOwnerSidebar from './HotelOwnerSidebar';

interface HotelOwnerLayoutProps {
  children: React.ReactNode;
  activeSidebarItem?: string;
  onAddHotel?: () => void;
}

export default function HotelOwnerLayout({
  children,
  activeSidebarItem,
  onAddHotel,
}: HotelOwnerLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <HotelOwnerHeader onAddHotel={onAddHotel} />
      <div className="flex pt-16">
        <HotelOwnerSidebar activeItem={activeSidebarItem} />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

