'use client';

import AdminLayout from '@/components/shared/AdminLayout';
import ProfileForm from '@/components/hotel-owner/ProfileForm';
import { User } from 'lucide-react';

export default function AdminProfilePage() {
  return (
    <AdminLayout activeSidebarItem="Profile">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <User className="w-6 h-6 text-emerald" />
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <ProfileForm />
      </div>
    </AdminLayout>
  );
}
