'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    const { error: authError } = await signUp(email, password, username);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setRegistered(true);
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="bg-white rounded-[16px] border border-[#e8e8e8] p-8 text-center">
        <div className="text-[48px] mb-4">📬</div>
        <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-2">
          Check your email
        </h1>
        <p className="text-[13px] text-[#888] mb-1">
          We sent a verification link to
        </p>
        <p className="text-[14px] font-bold text-[#0a0a0a] mb-6">
          {email}
        </p>
        <p className="text-[12px] text-[#bbb] mb-6">
          Click the link in your email to verify your account, then come back and sign in.
        </p>
        <Link href={ROUTES.login}>
          <Button className="w-full">
            Go to Sign In &rarr;
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#e8e8e8] p-8">
      <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-1">
        Create your studio
      </h1>
      <p className="text-[13px] text-[#888] mb-6">Join ArtRoom and start selling</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          placeholder="your-handle"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          required
        />
        <div className="text-[10px] text-[#bbb] -mt-2 mb-3">
          {username ? `${username}.artroom` : 'your-handle.artroom'}
        </div>
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
          placeholder="Min 6 characters"
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
          {loading ? 'Creating...' : 'Create Account \u2192'}
        </Button>
      </form>

      <p className="text-center text-[12px] text-[#888] mt-5">
        Already have an account?{' '}
        <Link
          href={ROUTES.login}
          className="text-[#0a0a0a] font-bold no-underline hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
