'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-[16px] border border-[#e8e8e8] p-8 text-center">
        <div className="text-[48px] mb-3">✉️</div>
        <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-2">
          Check your email
        </h1>
        <p className="text-[13px] text-[#888] mb-6 max-w-[340px] mx-auto">
          We sent a password reset link to <strong>{email}</strong>. Click the
          link in the email to set a new password.
        </p>
        <Link
          href={ROUTES.login}
          className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#0a0a0a] no-underline hover:underline"
        >
          ← Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#e8e8e8] p-8">
      <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-1">
        Reset your password
      </h1>
      <p className="text-[13px] text-[#888] mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <p className="text-[12px] text-[#ff4625] mb-3">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link →'}
        </Button>
      </form>

      <p className="text-center text-[12px] text-[#888] mt-5">
        Remember your password?{' '}
        <Link
          href={ROUTES.login}
          className="text-[#0a0a0a] font-bold no-underline hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
