'use client';

import { useState } from 'react';
import { NetworkSelector } from './NetworkSelector';
import { NETWORK_MAP } from '@/constants/networks';
import type { CryptoNetwork } from '@/types/payment';

interface USDCPaymentProps {
  amount: number;
  onSuccess: () => void;
}

const MOCK_ADDRESSES: Record<CryptoNetwork, string> = {
  polygon: '0x5Ef1bD34...f220',
  base: '0x9Bc2aF71...c881',
  solana: '7hXp9mNr...mK3R',
  ethereum: '0x3fA8B2c9...d4E2',
};

export function USDCPayment({ amount, onSuccess }: USDCPaymentProps) {
  const [network, setNetwork] = useState<CryptoNetwork>('solana');
  const [copied, setCopied] = useState(false);
  const networkConfig = NETWORK_MAP[network];
  const address = MOCK_ADDRESSES[network];

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Network selector */}
      <NetworkSelector activeNetwork={network} onNetworkChange={setNetwork} />

      {/* Amount display */}
      <div className="bg-[#f9f7ff] rounded-[10px] p-3.5 mb-3 border border-dashed border-[#ede8ff]">
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="font-[family-name:var(--font-dm-mono)] text-[24px] font-medium text-[#111]">
            {amount}.00
          </span>
          <span
            className="font-[family-name:var(--font-syne)] text-[12px] font-bold"
            style={{ color: networkConfig.color }}
          >
            USDC
          </span>
          <span className="ml-2 font-[family-name:var(--font-syne)] text-[8px] font-bold bg-[#edfff4] text-[#1A7A3C] px-2 py-0.5 rounded-full">
            No gas fees for buyer
          </span>
        </div>

        {/* Wallet address */}
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#666] break-all flex-1">
            {address}
          </span>
          <button
            onClick={handleCopy}
            className="font-[family-name:var(--font-syne)] text-[9px] font-bold px-3 py-1 border-[1.5px] border-[#e0e0e0] rounded-full bg-white cursor-pointer hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] transition-all whitespace-nowrap"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-[7px] h-[7px] rounded-full animate-pulse"
          style={{
            backgroundColor: networkConfig.color,
            boxShadow: `0 0 4px ${networkConfig.color}60`,
          }}
        />
        <span className="text-[11px] text-[#888]">
          Waiting for payment · Expires in 14:59
        </span>
      </div>

      <button
        onClick={onSuccess}
        className="w-full py-3 rounded-[13px] border-none text-white font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer hover:opacity-90 transition-opacity"
        style={{ backgroundColor: networkConfig.color }}
      >
        I&apos;ve Sent USDC →
      </button>

      <p className="text-[10px] text-[#bbb] text-center mt-2">
        Creator receives USDC instantly. 0% crypto fees.
      </p>
    </div>
  );
}
