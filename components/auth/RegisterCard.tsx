'use client';

import { Building2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import RoleSelector from '@/components/ui/RoleSelector';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register as registerAction, clearError } from '@/store/slices/authSlice';

export default function RegisterCard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Local state for validation errors
  const [validationError, setValidationError] = useState('');

  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Redux state for API errors and loading
  const { loading, error: apiError } = useAppSelector((state) => state.auth);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationError('');
    dispatch(clearError());

    // Client-side validation
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (!name.trim()) {
      setValidationError('Name is required');
      return;
    }

    // Dispatch Redux action
    const result = await dispatch(registerAction({
      name,
      email,
      password,
      role: role as 'customer' | 'hotel_owner',
    }));

    // Handle success
    if (registerAction.fulfilled.match(result)) {
      const user = result.payload.user;
      
      if (user.role === 'hotel_owner') {
        router.push(user.isApproved ? '/hotel-owner/dashboard' : '/hotel-owner/pending-approval');
      } else {
        router.push('/');
      }
    }
    // Errors are automatically handled by Redux
  };

  const handleOAuthSignUp = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/oauth-success',
        redirect: true,
      });
    } catch (err) {
      console.error('OAuth error:', err);
    }
  };

  // Combine validation and API errors for display
  const displayError = validationError || apiError;

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

      {/* OAuth Button */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={handleOAuthSignUp}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 hover:border-emerald text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {/* Google SVG icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* OR Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-ivory-light text-gray-500">Or sign up with email</span>
        </div>
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

        {/* Error Message - Shows BOTH validation and API errors */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {displayError}
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