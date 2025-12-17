'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Building2, User, Hotel } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cookieUtils } from '@/lib/utils/cookies';
import authClient from '@/lib/api/authClient'

// Extract the component that uses useSearchParams
function OAuthRoleSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'hotel_owner'>('customer');
  const [loading, setLoading] = useState(false);
  
  // Get OAuth data from URL params (passed from oauth-success)
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const provider = searchParams.get('provider') || 'google';
  const oauthId = searchParams.get('oauthId') || '';
  const profileImage = searchParams.get('profileImage') || '';

  useEffect(() => {
    // Redirect if no OAuth data
    if (!email || !oauthId) {
      router.push('/login');
    }
  }, [email, oauthId, router]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await authClient.post('/oauth/callback', {
        provider,
        oauthId,
        email,
        name,
        profileImage,
        role: selectedRole,
      });

      const data = await response.data;

      if (data.success && data.token) {
        // Store token and user in cookies
        cookieUtils.setToken(data.token);
        cookieUtils.setUser(data.user);

        // Redirect based on role
        if (selectedRole === 'hotel_owner') {
          window.location.href = '/hotel-owner/pending-approval';
        } else {
          window.location.href = '/';
        }
      } else {
        alert(data.message || 'Failed to complete registration');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ivory to-ivory-dark px-4 py-8">
      <div className="bg-ivory-light rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-dark to-emerald rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h1>
          <p className="text-sm text-gray-600">Select how you'll use the platform</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 mb-6">
          {/* Customer Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`w-full p-5 border-2 rounded-xl text-left transition-all ${
              selectedRole === 'customer'
                ? 'border-emerald bg-emerald/5 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedRole === 'customer' ? 'bg-emerald text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Customer</h3>
                <p className="text-sm text-gray-600">
                  Browse and book hotels, manage your reservations
                </p>
              </div>
            </div>
          </button>

          {/* Hotel Owner Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('hotel_owner')}
            className={`w-full p-5 border-2 rounded-xl text-left transition-all ${
              selectedRole === 'hotel_owner'
                ? 'border-emerald bg-emerald/5 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedRole === 'hotel_owner' ? 'bg-emerald text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <Hotel className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Hotel Owner</h3>
                <p className="text-sm text-gray-600">
                  Manage your hotels, rooms, and bookings
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Requires admin approval
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleSubmit}
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Setting up your account...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

// Main page component wrapped with Suspense
export default function OAuthRoleSelectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ivory to-ivory-dark">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-dark to-emerald rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OAuthRoleSelectionContent />
    </Suspense>
  );
}