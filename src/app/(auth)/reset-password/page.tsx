'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirect to login after 2 seconds
      setTimeout(() => router.push(ROUTES.login), 2000);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-[16px] border border-[#e8e8e8] p-8 text-center">
        <div className="text-[48px] mb-3">✅</div>
        <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-2">
          Password updated!
        </h1>
        <p className="text-[13px] text-[#888] mb-4">
          Your password has been reset. Redirecting to sign in...
        </p>
        <Link
          href={ROUTES.login}
          className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#0a0a0a] no-underline hover:underline"
        >
          Sign In Now →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#e8e8e8] p-8">
      <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-1">
        Set a new password
      </h1>
      <p className="text-[13px] text-[#888] mb-6">
        Choose a new password for your ArtRoom account.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-[12px] text-[#ff4625] mb-3">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password →'}
        </Button>
      </form>
    </div>
  );
}
