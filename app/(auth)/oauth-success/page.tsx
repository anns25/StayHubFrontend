'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { cookieUtils } from '@/lib/utils/cookies';
import { Building2 } from 'lucide-react';
import authClient from '@/lib/api/authClient';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const session = await getSession();
        
        if (!session?.user?.email) {
          setError('Failed to authenticate. Please try again.');
          setLoading(false);
          return;
        }

        // Check if user already exists
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const checkResponse = await authClient.get(`/check-user?email=${encodeURIComponent(session.user.email)}`);
        const checkData = checkResponse.data;

        // If user exists, log them in directly
        if (checkData.exists) {
          const response = await authClient.post('/oauth/callback', {
            provider: 'google',
            oauthId: session.user.id || session.user.email,
            email: session.user.email,
            name: session.user.name || '',
            profileImage: session.user.image || '',
            role: checkData.user.role,
          });

          const data = response.data;

          if (data.success && data.token) {
            cookieUtils.setToken(data.token);
            cookieUtils.setUser(data.user);

            // Redirect based on role
            if (data.user.role === 'admin') {
              window.location.href = '/admin/dashboard';
            } else if (data.user.role === 'hotel_owner') {
              window.location.href = data.user.isApproved 
                ? '/hotel-owner/dashboard' 
                : '/hotel-owner/pending-approval';
            } else {
              window.location.href = '/';
            }
          } else {
            setError(data.message || 'Authentication failed');
            setLoading(false);
          }
        } else {
          // New user - redirect to role selection
          const params = new URLSearchParams({
            provider: 'google',
            oauthId: session.user.id || session.user.email,
            email: session.user.email,
            name: session.user.name || '',
            profileImage: session.user.image || '',
          });
          router.push(`/oauth-role-selection?${params.toString()}`);
        }
      } catch (err: any) {
        console.error('OAuth error:', err);
        setError(err.message || 'An error occurred during authentication');
        setLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-dark to-emerald rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-charcoal-light">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
        <div className="bg-ivory-light rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">❌</div>
          <h2 className="text-xl font-bold text-charcoal mb-2">Authentication Failed</h2>
          <p className="text-charcoal-light mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block bg-emerald hover:bg-emerald-dark text-white px-6 py-2 rounded-lg font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return null;
}