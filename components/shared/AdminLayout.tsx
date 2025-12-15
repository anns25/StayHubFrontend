'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import FloatingActionButton from './FloatingActionButton';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSidebarItem?: string;
}

export default function AdminLayout({ children, activeSidebarItem }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <div className="flex pt-16">
        <Sidebar activeItem={activeSidebarItem} />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6">
          {children}
        </main>
      </div>
      <FloatingActionButton />
    </div>
  );
}

