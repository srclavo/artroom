'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ApplePayButton } from './ApplePayButton';
import { USDCPayment } from './USDCPayment';
import { CardPayment } from './CardPayment';
import { cn } from '@/lib/utils';
import type { PaymentMethod, PaymentIntent } from '@/types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentIntent: PaymentIntent | null;
}

export function PaymentModal({ isOpen, onClose, paymentIntent }: PaymentModalProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('apple_pay');
  const [success, setSuccess] = useState(false);

  if (!paymentIntent) return null;

  const handleSuccess = () => {
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setActiveMethod('apple_pay');
    onClose();
  };

  const methods: { id: PaymentMethod; label: string; icon?: string }[] = [
    { id: 'apple_pay', label: 'Apple Pay', icon: '\uF8FF' },
    { id: 'usdc', label: 'USDC' },
    { id: 'card', label: 'Card' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {success ? (
        <div className="text-center py-9 px-6">
          <div className="text-[52px] mb-4">🎉</div>
          <div className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold tracking-[-0.02em] mb-2">
            Purchase complete!
          </div>
          <div className="text-[13px] text-[#888] leading-[1.65] mb-6">
            You now have access to &quot;{paymentIntent.itemName}&quot;.
            <br />
            Check your downloads or your library.
          </div>
          <button
            onClick={handleClose}
            className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-7 py-3 bg-[#0a0a0a] text-white rounded-full border-none cursor-pointer hover:bg-[#333] transition-colors"
          >
            Done
          </button>
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
                </button>
              ))}
            </div>

            {/* Panels */}
            {activeMethod === 'apple_pay' && (
              <ApplePayButton
                amount={paymentIntent.itemPrice}
                onSuccess={handleSuccess}
              />
            )}
            {activeMethod === 'usdc' && (
              <USDCPayment
                amount={paymentIntent.itemPrice}
                onSuccess={handleSuccess}
              />
            )}
            {activeMethod === 'card' && (
              <CardPayment
                amount={paymentIntent.itemPrice}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
