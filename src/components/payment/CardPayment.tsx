'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface CardPaymentProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
}

function CardForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStatus('processing');
    setErrorMsg('');

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message ?? 'Payment failed');
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {errorMsg && (
        <div className="mt-3 text-[12px] text-[#E8001A] font-[family-name:var(--font-syne)] font-bold">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || status === 'processing'}
        className="w-full mt-4 py-4 bg-[#0a0a0a] text-white rounded-[13px] border-none font-[family-name:var(--font-syne)] text-[12px] font-bold uppercase tracking-[0.06em] cursor-pointer flex items-center justify-center gap-2 hover:bg-[#333] hover:-translate-y-[1px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'processing' ? 'Processing...' : `Pay $${amount} \u2192`}
      </button>
    </form>
  );
}

export function CardPayment({ clientSecret, amount, onSuccess }: CardPaymentProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'flat',
          variables: {
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            borderRadius: '10px',
            colorPrimary: '#0a0a0a',
          },
        },
      }}
    >
      <CardForm amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}
