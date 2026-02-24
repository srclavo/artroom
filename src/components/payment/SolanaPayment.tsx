'use client';

import { useState } from 'react';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { SOLANA_CONFIG } from '@/constants/solana';

interface SolanaPaymentProps {
  amount: number;
  designId?: string;
  onSuccess: (signature: string) => void;
}

export function SolanaPayment({ amount, designId, onSuccess }: SolanaPaymentProps) {
  const wallet = useSolanaWallet();
  const [payState, setPayState] = useState<
    'idle' | 'preparing' | 'signing' | 'confirmed' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const solAmount = (amount * SOLANA_CONFIG.solPerUsd).toFixed(4);
  const networkLabel = SOLANA_CONFIG.network === 'devnet' ? 'Devnet' : 'Mainnet';

  // State 1: No Phantom installed
  if (!wallet.isPhantomInstalled) {
    return (
      <div className="text-center py-6">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-[22px] text-white"
          style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
        >
          &#x25CE;
        </div>
        <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold mb-1.5">
          Phantom Wallet Required
        </div>
        <p className="text-[12px] text-[#999] mb-4 leading-relaxed">
          Install Phantom to pay with Solana.<br />
          Fast, secure, zero gas hassle.
        </p>
        <a
          href="https://phantom.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-7 py-3 rounded-full text-white font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.04em] no-underline hover:opacity-85 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
        >
          Get Phantom &rarr;
        </a>
      </div>
    );
  }

  // State 2: Not connected
  if (!wallet.isConnected) {
    return (
      <div className="py-1">
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
          >
            &#x25CE;
          </div>
          <div>
            <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold">Pay with Solana</div>
            <div className="text-[10px] text-[#999] mt-0.5">Phantom Wallet &middot; {networkLabel}</div>
          </div>
        </div>
        <div className="text-center font-[family-name:var(--font-syne)] text-[28px] font-extrabold text-[#0a0a0a] mb-3.5">
          {solAmount} <span className="text-[14px] font-bold text-[#999]">SOL</span>
        </div>
        <p className="text-[12px] text-[#999] text-center mb-4 leading-relaxed">
          Connect your Phantom wallet to pay
        </p>
        <button
          onClick={() => wallet.connect()}
          disabled={wallet.loading}
          className="w-full py-3.5 rounded-xl border-none text-white font-[family-name:var(--font-syne)] text-[12px] font-bold tracking-[0.04em] cursor-pointer hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
        >
          &#x25CE; Connect Wallet
        </button>
      </div>
    );
  }

  // State 3: Connected
  const handlePay = async () => {
    try {
      setPayState('preparing');
      setErrorMsg('');
      setPayState('signing');
      const signature = await wallet.transferSOL(amount);

      // Record purchase in database
      if (designId) {
        try {
          await fetch('/api/purchases/solana', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ designId, txSignature: signature, amount }),
          });
        } catch {
          // Purchase recording failed but payment went through
        }
      }

      setPayState('confirmed');
      onSuccess(signature);
    } catch (err: unknown) {
      setPayState('error');
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('User rejected')) {
        setErrorMsg('Transaction cancelled');
      } else if (msg.includes('insufficient')) {
        setErrorMsg('Insufficient SOL balance');
      } else {
        setErrorMsg('Payment failed');
      }
    }
  };

  const buttonLabel = {
    idle: 'Pay with Phantom \u2192',
    preparing: 'Preparing...',
    signing: 'Sign in wallet...',
    confirmed: 'Confirmed!',
    error: `${errorMsg} \u2014 try again`,
  }[payState];

  return (
    <div className="py-1">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
        >
          &#x25CE;
        </div>
        <div>
          <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold">Pay with Solana</div>
          <div className="text-[10px] text-[#999] mt-0.5">Phantom Wallet &middot; {networkLabel}</div>
        </div>
      </div>

      <div className="text-center font-[family-name:var(--font-syne)] text-[28px] font-extrabold text-[#0a0a0a] mb-3.5">
        {solAmount} <span className="text-[14px] font-bold text-[#999]">SOL</span>
      </div>

      <div className="flex justify-between items-center px-3.5 py-2.5 bg-[#f8f8f8] rounded-[10px] font-[family-name:var(--font-dm-sans)] text-[11px] text-[#666] mb-4">
        <span className="text-[#999]">{wallet.displayAddress}</span>
        <span className="text-[#14F195] font-semibold">
          {wallet.balance !== null ? `${wallet.balance.toFixed(4)} SOL` : 'loading...'}
        </span>
      </div>

      <button
        onClick={payState === 'error' || payState === 'idle' ? handlePay : undefined}
        disabled={payState === 'preparing' || payState === 'signing' || payState === 'confirmed'}
        className={`w-full py-3.5 rounded-xl border-none font-[family-name:var(--font-syne)] text-[12px] font-bold tracking-[0.04em] cursor-pointer transition-all disabled:cursor-not-allowed ${
          payState === 'confirmed'
            ? 'bg-[#14F195] text-[#0a0a0a]'
            : 'bg-[#0a0a0a] text-white hover:opacity-85'
        } ${payState === 'preparing' || payState === 'signing' ? 'opacity-70' : ''}`}
      >
        {buttonLabel}
      </button>

      <p className="text-[10px] text-[#bbb] text-center mt-2.5 font-[family-name:var(--font-dm-sans)]">
        Solana {SOLANA_CONFIG.network} &middot; confirms in ~5s
      </p>
    </div>
  );
}
