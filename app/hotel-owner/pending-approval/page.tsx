'use client';

import { useEffect, useState } from 'react';
import { Clock, Mail, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { logout, getCurrentUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { cookieUtils } from '@/lib/utils/cookies';

export default function PendingApprovalPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already approved (in case admin approved while user is on this page)
    const checkUserStatus = async () => {
      try {
        const token = cookieUtils.getToken();
        const userData = cookieUtils.getUser();

        if (!token) {
          router.push('/login');
          return;
        }

        const data = await getCurrentUser();
        
        // If user is approved, redirect to dashboard
        if (data.user?.isApproved) {
          router.push('/hotel-owner/dashboard');
          return;
        }

        setUser(data.user || userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();

    // Check every 30 seconds if user has been approved
    const interval = setInterval(checkUserStatus, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
          <p className="text-charcoal-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Simple Header */}
      <header className="bg-ivory-light border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🏨</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-charcoal">HotelPro</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-charcoal-light hover:text-charcoal px-3 py-2 rounded-lg hover:bg-ivory-dark transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-ivory-light rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
          {/* Icon and Status */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-warning-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-warning" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
              Account Pending Approval
            </h1>
            <p className="text-charcoal-light">
              Your hotel owner account is awaiting admin approval
            </p>
          </div>

          {/* Information Card */}
          <div className="bg-gradient-to-r from-emerald-light to-emerald/10 border border-emerald/20 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-emerald flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-charcoal mb-2">What happens next?</h2>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  Our admin team will review your registration and verify your hotel owner credentials. 
                  This process typically takes 24-48 hours. Once approved, you'll receive an email notification 
                  and can access your dashboard to start managing your hotels.
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-charcoal mb-4">Approval Process:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal">Registration Submitted</p>
                  <p className="text-sm text-charcoal-light">Your account has been created successfully</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">Under Review</p>
                  <p className="text-sm text-charcoal-light">Admin team is verifying your credentials</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-light">Approval</p>
                  <p className="text-sm text-charcoal-light">You'll receive an email when approved</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-ivory border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-charcoal mb-4">Your Account Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-light">Name:</span>
                  <span className="text-charcoal font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-light">Email:</span>
                  <span className="text-charcoal font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-light">Status:</span>
                  <span className="px-3 py-1 bg-warning-light text-warning rounded-full text-xs font-medium">
                    Pending Approval
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start space-x-4">
              <Mail className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-charcoal-light">
                  <span className="font-medium text-charcoal">Questions?</span> If you have any questions 
                  about your registration or need assistance, please contact our support team at{' '}
                  <a href="mailto:support@hotelpro.com" className="text-emerald hover:text-emerald-dark font-medium">
                    support@hotelpro.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Auto-refresh Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-charcoal-light">
              This page will automatically refresh every 30 seconds to check your approval status.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}