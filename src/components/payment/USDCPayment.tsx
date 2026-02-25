'use client';

import { useState, useEffect, useRef } from 'react';
import { NetworkSelector } from './NetworkSelector';
import { SolanaPayment } from './SolanaPayment';
import { NETWORK_MAP } from '@/constants/networks';
import type { CryptoNetwork } from '@/types/payment';

interface USDCPaymentProps {
  amount: number;
  designId?: string;
  onSuccess: (txSignature?: string) => void;
}

export function USDCPayment({ amount, designId, onSuccess }: USDCPaymentProps) {
  const [network, setNetwork] = useState<CryptoNetwork>('solana');
  const [copied, setCopied] = useState(false);

  // Circle payment state
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [circlePaymentId, setCirclePaymentId] = useState<string | null>(null);
  const [circleStatus, setCircleStatus] = useState<'idle' | 'loading' | 'waiting' | 'confirming' | 'confirmed' | 'error'>('idle');
  const [circleError, setCircleError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup polling on unmount or network change
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset Circle state when switching away from a non-Solana network
  useEffect(() => {
    if (network === 'solana') {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setDepositAddress(null);
      setCirclePaymentId(null);
      setCircleStatus('idle');
    }
  }, [network]);

  const createCirclePayment = async () => {
    if (!designId) return;

    setCircleStatus('loading');
    setCircleError('');

    try {
      const res = await fetch('/api/circle/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, network }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCircleStatus('error');
        setCircleError(data.error || 'Failed to create payment');
        return;
      }

      setDepositAddress(data.depositAddress);
      setCirclePaymentId(data.paymentIntentId);
      setCircleStatus('waiting');
      setTimeLeft(30 * 60);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (pollingRef.current) clearInterval(pollingRef.current);
            setCircleStatus('error');
            setCircleError('Payment expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start polling for confirmation
      if (data.paymentIntentId) {
        pollingRef.current = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/circle/payment-intent?id=${data.paymentIntentId}`);
            const statusData = await statusRes.json();

            if (statusData.status === 'confirmed' || statusData.status === 'complete') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              if (timerRef.current) clearInterval(timerRef.current);
              setCircleStatus('confirmed');
              onSuccess(statusData.transactionHash || undefined);
            } else if (statusData.status === 'failed') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              if (timerRef.current) clearInterval(timerRef.current);
              setCircleStatus('error');
              setCircleError('Payment failed');
            }
          } catch {
            // Polling failed, will retry
          }
        }, 10000);
      }
    } catch {
      setCircleStatus('error');
      setCircleError('Failed to connect to payment server');
    }
  };

  // Solana — use real Phantom payment flow
  if (network === 'solana') {
    return (
      <div>
        <NetworkSelector activeNetwork={network} onNetworkChange={setNetwork} />
        <SolanaPayment
          amount={amount}
          designId={designId}
          onSuccess={(signature) => onSuccess(signature)}
        />
      </div>
    );
  }

  // Other networks — Circle USDC flow
  const networkConfig = NETWORK_MAP[network];
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <NetworkSelector activeNetwork={network} onNetworkChange={setNetwork} />

      {circleStatus === 'idle' && (
        <div className="text-center py-4">
          <div className="font-[family-name:var(--font-syne)] text-[24px] font-extrabold text-[#0a0a0a] mb-1">
            {amount.toFixed(2)} <span className="text-[14px] font-bold" style={{ color: networkConfig.color }}>USDC</span>
          </div>
          <p className="text-[12px] text-[#999] mb-4">
            on {networkConfig.name}
          </p>
          <button
            onClick={createCirclePayment}
            className="w-full py-3 rounded-[13px] border-none text-white font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: networkConfig.color }}
          >
            Generate Payment Address &rarr;
          </button>
          <p className="text-[10px] text-[#bbb] text-center mt-2">
            Creator receives USDC instantly. 0% crypto fees.
          </p>
        </div>
      )}

      {circleStatus === 'loading' && (
        <div className="py-8 text-center">
          <div className="font-[family-name:var(--font-syne)] text-[12px] text-[#999]">
            Generating payment address...
          </div>
        </div>
      )}

      {(circleStatus === 'waiting' || circleStatus === 'confirming') && depositAddress && (
        <>
          <div className="bg-[#f9f7ff] rounded-[10px] p-3.5 mb-3 border border-dashed border-[#ede8ff]">
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-[family-name:var(--font-dm-mono)] text-[24px] font-medium text-[#111]">
                {amount.toFixed(2)}
              </span>
              <span
                className="font-[family-name:var(--font-syne)] text-[12px] font-bold"
                style={{ color: networkConfig.color }}
              >
                USDC
              </span>
              <span className="ml-2 font-[family-name:var(--font-syne)] text-[8px] font-bold bg-[#edfff4] text-[#2ec66d] px-2 py-0.5 rounded-full">
                No gas fees for buyer
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#666] break-all flex-1">
                {depositAddress}
              </span>
              <button
                onClick={handleCopy}
                className="font-[family-name:var(--font-syne)] text-[9px] font-bold px-3 py-1 border-[1.5px] border-[#e0e0e0] rounded-full bg-white cursor-pointer hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] transition-all whitespace-nowrap"
              >
                {copied ? 'Copied \u2713' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-[7px] h-[7px] rounded-full animate-pulse"
              style={{
                backgroundColor: networkConfig.color,
                boxShadow: `0 0 4px ${networkConfig.color}60`,
              }}
            />
            <span className="text-[11px] text-[#888]">
              {circleStatus === 'confirming'
                ? 'Confirming payment...'
                : `Waiting for payment \u00B7 Expires in ${formatTime(timeLeft)}`}
            </span>
          </div>

          <p className="text-[10px] text-[#bbb] text-center mt-2">
            Send exactly {amount.toFixed(2)} USDC on {networkConfig.name} to the address above.
          </p>
        </>
      )}

      {circleStatus === 'confirmed' && (
        <div className="py-6 text-center">
          <div className="text-[32px] mb-2">&#x2705;</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#22c55e]">
            Payment Confirmed!
          </div>
        </div>
      )}

      {circleStatus === 'error' && (
        <div className="py-6 text-center">
          <div className="font-[family-name:var(--font-syne)] text-[12px] text-[#ff4625] font-bold mb-3">
            {circleError}
          </div>
          <button
            onClick={() => {
              setCircleStatus('idle');
              setCircleError('');
              setDepositAddress(null);
              setCirclePaymentId(null);
            }}
            className="font-[family-name:var(--font-syne)] text-[10px] font-bold text-[#0a0a0a] underline cursor-pointer bg-transparent border-none"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
