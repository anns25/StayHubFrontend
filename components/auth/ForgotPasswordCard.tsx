'use client';

import { Building2, Mail, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import authClient from '@/lib/api/authClient';

export default function ForgotPasswordCard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await authClient.post('/forgotpassword', { email });
      
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory-light rounded-2xl shadow-lg p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-dark to-emerald rounded-xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-sm text-gray-600">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      {success ? (
        <div className="space-y-6">
          <div className="bg-emerald-light border border-emerald/20 rounded-lg p-4 text-center">
            <Mail className="w-12 h-12 text-emerald mx-auto mb-3" />
            <h3 className="font-semibold text-charcoal mb-2">Check your email</h3>
            <p className="text-sm text-charcoal-light">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-xs text-charcoal-light mt-2">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
          <Link href="/login">
            <Button variant="primary" fullWidth>
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          {/* Back to Login */}
          <Link
            href="/login"
            className="flex items-center justify-center space-x-2 text-sm text-emerald hover:text-emerald-dark font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </Link>
        </form>
      )}
    </div>
  );
}