'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface ApplePayButtonProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
}

function ApplePayInner({
  clientSecret,
  amount,
  onSuccess,
}: {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<ReturnType<
    NonNullable<typeof stripe>['paymentRequest']
  > | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'ArtRoom Purchase',
        amount: Math.round(amount * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setAvailable(true);
      } else {
        setAvailable(false);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
      );

      if (confirmError) {
        ev.complete('fail');
      } else {
        ev.complete('success');
        onSuccess();
      }
    });
  }, [stripe, amount, clientSecret, onSuccess]);

  if (available === null) {
    return (
      <div className="py-6 text-center">
        <div className="font-[family-name:var(--font-syne)] text-[12px] text-[#999]">
          Checking Apple Pay availability...
        </div>
      </div>
    );
  }

  if (!available || !paymentRequest) {
    return (
      <div className="py-6 text-center">
        <div className="text-[28px] mb-3 opacity-30">&#xF8FF;</div>
        <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#999] mb-2">
          Apple Pay Not Available
        </div>
        <p className="text-[12px] text-[#bbb] leading-[1.7] max-w-[280px] mx-auto">
          Apple Pay is not available on this device or browser.
          Try paying with card instead.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: {
            paymentRequestButton: {
              type: 'buy',
              theme: 'dark',
              height: '48px',
            },
          },
        }}
      />
      <p className="text-[11px] text-[#bbb] text-center mt-3">
        Use Face ID or Touch ID to complete your purchase instantly.
      </p>
    </div>
  );
}

export function ApplePayButton({ clientSecret, amount, onSuccess }: ApplePayButtonProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: 'flat' },
      }}
    >
      <ApplePayInner
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
