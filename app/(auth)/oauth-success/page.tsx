'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { cookieUtils } from '@/lib/utils/cookies';
import { Building2 } from 'lucide-react';

export default function OAuthSuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Get session from NextAuth
        const session = await getSession();
        
        if (!session) {
          setError('Failed to authenticate. Please try again.');
          setLoading(false);
          return;
        }

        // Get OAuth data and send to backend
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/auth/oauth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: session.user?.provider || 'google',
            oauthId: session.user?.id || '',
            email: session.user?.email || '',
            name: session.user?.name || '',
            profileImage: session.user?.image || '',
            role: 'customer',
          }),
        });

        const data = await response.json();

        if (data.success && data.token) {
          // Store token and user in cookies
          cookieUtils.setToken(data.token);
          cookieUtils.setUser(data.user);

          // Redirect based on role
          if (data.user.role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else if (data.user.role === 'hotel_owner') {
            if (data.user.isApproved) {
              window.location.href = '/hotel-owner/dashboard';
            } else {
              window.location.href = '/hotel-owner/pending-approval';
            }
          } else {
            window.location.href = '/';
          }
        } else {
          setError(data.message || 'Authentication failed');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('OAuth error:', err);
        setError(err.message || 'An error occurred during authentication');
        setLoading(false);
      }
    };

    handleOAuthSuccess();
  }, []);

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