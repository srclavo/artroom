'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ApplePayButton } from './ApplePayButton';
import { USDCPayment } from './USDCPayment';
import { CardPayment } from './CardPayment';
import { explorerUrl } from '@/constants/solana';
import { cn } from '@/lib/utils';
import type { PaymentMethod, PaymentIntent } from '@/types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentIntent: PaymentIntent | null;
  onPurchaseComplete?: () => void;
}

export function PaymentModal({ isOpen, onClose, paymentIntent, onPurchaseComplete }: PaymentModalProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('card');
  const [success, setSuccess] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // Stripe state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async () => {
    if (!paymentIntent?.designId) return;

    setStripeLoading(true);
    setStripeError(null);

    try {
      const res = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId: paymentIntent.designId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStripeError(data.error || 'Failed to prepare payment');
        return;
      }

      setClientSecret(data.clientSecret);
    } catch {
      setStripeError('Failed to connect to payment server');
    } finally {
      setStripeLoading(false);
    }
  }, [paymentIntent?.designId]);

  // Create PaymentIntent when modal opens and card/apple_pay is selected
  useEffect(() => {
    if (isOpen && paymentIntent?.designId && (activeMethod === 'card' || activeMethod === 'apple_pay')) {
      if (!clientSecret) {
        createPaymentIntent();
      }
    }
  }, [isOpen, paymentIntent?.designId, activeMethod, clientSecret, createPaymentIntent]);

  if (!paymentIntent) return null;

  const handleSuccess = (signature?: string) => {
    if (signature) setTxSignature(signature);
    setSuccess(true);
    onPurchaseComplete?.();
  };

  const handleClose = () => {
    setSuccess(false);
    setTxSignature(null);
    setClientSecret(null);
    setStripeError(null);
    setActiveMethod('card');
    onClose();
  };

  const handleDownload = () => {
    if (paymentIntent.designId) {
      window.open(`/api/designs/${paymentIntent.designId}/download`, '_blank');
    }
  };

  const methods: { id: PaymentMethod; label: string; icon?: string; badge?: string }[] = [
    { id: 'card', label: 'Card' },
    { id: 'apple_pay', label: 'Apple Pay', icon: '\uF8FF' },
    { id: 'usdc', label: 'USDC', badge: '-5%' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {success ? (
        <div className="text-center py-9 px-6">
          <div className="text-[52px] mb-4">&#x1F389;</div>
          <div className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold tracking-[-0.02em] mb-2">
            Purchase complete!
          </div>
          <div className="text-[13px] text-[#888] leading-[1.65] mb-6">
            You now have access to &quot;{paymentIntent.itemName}&quot;.
            <br />
            Check your downloads or your library.
          </div>

          {txSignature && (
            <a
              href={explorerUrl(txSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-[family-name:var(--font-syne)] text-[11px] font-bold text-[#9945FF] mb-4 no-underline hover:opacity-70 transition-opacity"
            >
              View on Solana Explorer &rarr;
            </a>
          )}

          <div className="flex flex-col gap-2">
            {paymentIntent.designId && (
              <button
                onClick={handleDownload}
                className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-7 py-3 bg-[#0a0a0a] text-white rounded-full border-none cursor-pointer hover:bg-[#333] transition-colors"
              >
                Download Now &darr;
              </button>
            )}
            <button
              onClick={handleClose}
              className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-7 py-3 bg-white text-[#999] rounded-full border-[1.5px] border-[#e8e8e8] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="px-6 py-5 pb-4 border-b border-[#f0f0f0]">
            <div className="pr-8">
              <div className="font-[family-name:var(--font-syne)] text-[15px] font-bold text-[#111]">
                {paymentIntent.itemName}
              </div>
              <div className="text-[11px] text-[#bbb]">
                {paymentIntent.creatorUsername}.artroom
              </div>
            </div>
            <div className="font-[family-name:var(--font-syne)] text-[22px] font-extrabold text-[#0a0a0a] mt-2">
              ${paymentIntent.itemPrice}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {/* Method tabs */}
            <div className="flex gap-1 bg-[#f5f5f5] p-1 rounded-[12px] mb-5">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMethod(m.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5',
                    'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.04em]',
                    'py-2 px-1 rounded-[9px] border-none cursor-pointer transition-all duration-200',
                    activeMethod === m.id
                      ? 'bg-white text-[#0a0a0a] shadow-[0_2px_8px_rgba(0,0,0,0.09)]'
                      : 'bg-transparent text-[#999] hover:text-[#666]'
                  )}
                >
                  {m.icon && <span>{m.icon}</span>}
                  {m.label}
                  {m.badge && (
                    <span className="bg-[#22c55e] text-white text-[6px] font-bold px-1.5 py-px rounded-full ml-0.5">
                      {m.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Panels */}
            {activeMethod === 'card' && (
              stripeLoading ? (
                <div className="py-8 text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[12px] text-[#999]">
                    Preparing payment...
                  </div>
                </div>
              ) : stripeError ? (
                <div className="py-8 text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[12px] text-[#E8001A] font-bold mb-3">
                    {stripeError}
                  </div>
                  <button
                    onClick={createPaymentIntent}
                    className="font-[family-name:var(--font-syne)] text-[10px] font-bold text-[#0a0a0a] underline cursor-pointer bg-transparent border-none"
                  >
                    Try again
                  </button>
                </div>
              ) : clientSecret ? (
                <CardPayment
                  clientSecret={clientSecret}
                  amount={paymentIntent.itemPrice}
                  onSuccess={() => handleSuccess()}
                />
              ) : null
            )}
            {activeMethod === 'apple_pay' && (
              stripeLoading ? (
                <div className="py-8 text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[12px] text-[#999]">
                    Preparing payment...
                  </div>
                </div>
              ) : stripeError ? (
                <div className="py-8 text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[12px] text-[#E8001A] font-bold">
                    {stripeError}
                  </div>
                </div>
              ) : clientSecret ? (
                <ApplePayButton
                  clientSecret={clientSecret}
                  amount={paymentIntent.itemPrice}
                  onSuccess={() => handleSuccess()}
                />
              ) : null
            )}
            {activeMethod === 'usdc' && (
              <USDCPayment
                amount={paymentIntent.itemPrice}
                designId={paymentIntent.designId}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
