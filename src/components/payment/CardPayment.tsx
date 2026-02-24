'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

interface CardPaymentProps {
  amount: number;
  onSuccess: () => void;
}

export function CardPayment({ amount, onSuccess }: CardPaymentProps) {
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const formatCard = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + ' / ' + digits.slice(2);
    return digits;
  };

  return (
    <div>
      <Input
        label="Card Number"
        placeholder="4242 4242 4242 4242"
        value={card}
        onChange={(e) => setCard(formatCard(e.target.value))}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <Input
          label="Expiry"
          placeholder="MM / YY"
          value={expiry}
          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
        />
        <Input
          label="CVC"
          placeholder="123"
          value={cvc}
          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
        />
      </div>

      <Input
        label="Name on Card"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={onSuccess}
        className="w-full mt-4 py-4 bg-[#0a0a0a] text-white rounded-[13px] border-none font-[family-name:var(--font-syne)] text-[12px] font-bold uppercase tracking-[0.06em] cursor-pointer flex items-center justify-center gap-2 hover:bg-[#333] hover:-translate-y-[1px] transition-all"
      >
        Pay ${amount} →
      </button>
    </div>
  );
}
