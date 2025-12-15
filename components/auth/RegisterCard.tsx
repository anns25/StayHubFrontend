'use client';

import { Building2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import RoleSelector from '@/components/ui/RoleSelector';
import Checkbox from '@/components/ui/Checkbox';
import Link from 'next/link';
import { useState } from 'react';
import { register } from '@/lib/api';
import { cookieUtils } from '@/lib/utils/cookies';

export default function RegisterCard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const data = await register({
        name,
        email,
        password,
        role: role as 'customer' | 'hotel_owner',
      });

      // Store token and user in cookies
      if (data.token) {
        cookieUtils.setToken(data.token);
        cookieUtils.setUser(data.user);
      }

      // Success - redirect based on role
      if (role === 'hotel_owner') {
        if (data.user.isApproved) {
          window.location.href = '/hotel-owner/dashboard';
        }
        else {
          window.location.href = '/hotel-owner/pending-approval';
        }
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-sm text-gray-600">Sign up to get started</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email Input */}
        <Input
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Confirm Password Input */}
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Role Selection */}
        <RoleSelector
          value={role}
          onChange={setRole}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="w-4 h-4 text-emerald border-gray-300 rounded focus:ring-emerald focus:ring-2 mt-1"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
            I agree to the{' '}
            <Link href="/terms" className="text-emerald hover:text-emerald-dark font-medium">
              Terms and Conditions
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-emerald hover:text-emerald-dark font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Sign Up Button */}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-700">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald hover:text-emerald-dark font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

