'use client';
import ResetPasswordCard from '@/components/auth/ResetPasswordCard';


export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-ivory to-ivory-dark">
      <ResetPasswordCard token={params.token} />
    </div>
  );
}