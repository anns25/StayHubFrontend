'use client';

import { Building2, Lock, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authClient from '@/lib/api/authClient';

interface ResetPasswordCardProps {
  token: string;
}

export default function ResetPasswordCard({ token }: ResetPasswordCardProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authClient.patch(`/resetpassword/${token}`, {
        password,
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Invalid or expired reset token. Please request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-ivory-light rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been reset. Redirecting to login...
          </p>
          <Link href="/login">
            <Button variant="primary" fullWidth>
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory-light rounded-2xl shadow-lg p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-dark to-emerald rounded-xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600">Enter your new password</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Input */}
        <Input
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Confirm Password Input */}
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>

        {/* Back to Login */}
        <Link
          href="/login"
          className="block text-center text-sm text-emerald hover:text-emerald-dark font-medium"
        >
          Back to login
        </Link>
      </form>
    </div>
  );
}