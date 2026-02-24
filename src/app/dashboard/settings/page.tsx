'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Settings
      </h1>

      <div className="max-w-lg">
        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
            Profile
          </h2>
          <Input
            label="Display Name"
            placeholder="Your full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <div className="mb-3.5">
            <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]">
              Bio
            </label>
            <textarea
              className="w-full px-3.5 py-3 border-[1.5px] border-[#e8e8e8] rounded-[10px] font-[family-name:var(--font-dm-sans)] text-sm text-[#111] outline-none placeholder:text-[#ccc] focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)] transition-all resize-y min-h-[80px]"
              placeholder="Tell the world about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <Input
            label="Website"
            placeholder="https://yourwebsite.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </section>

        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
            Payments
          </h2>
          <Input
            label="USDC Wallet Address"
            placeholder="Your wallet address for USDC payouts"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <div className="p-4 bg-[#f5f5f5] rounded-[10px] border border-[#e8e8e8]">
            <div className="font-[family-name:var(--font-syne)] text-[11px] font-bold mb-1">
              Stripe Connect
            </div>
            <p className="text-[12px] text-[#888] mb-3">
              Connect your Stripe account to receive card payments.
            </p>
            <Button size="sm">Connect Stripe →</Button>
          </div>
        </section>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
