'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push(ROUTES.home);
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#e8e8e8] p-8">
      <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-1">
        Welcome back
      </h1>
      <p className="text-[13px] text-[#888] mb-6">Sign in to your ArtRoom account</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-[12px] text-[#E8001A] mb-3">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In →'}
        </Button>
      </form>

      <p className="text-center text-[12px] text-[#888] mt-5">
        Don&apos;t have an account?{' '}
        <Link
          href={ROUTES.register}
          className="text-[#0a0a0a] font-bold no-underline hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
