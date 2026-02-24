'use client';

import { useState, useCallback } from 'react';
import type { PaymentIntent } from '@/types/payment';

export function usePayment() {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  const openPayment = useCallback(
    (intent: PaymentIntent) => {
      setPaymentIntent(intent);
      setIsOpen(true);
    },
    []
  );

  const closePayment = useCallback(() => {
    setIsOpen(false);
    setPaymentIntent(null);
  }, []);

  return {
    isOpen,
    paymentIntent,
    openPayment,
    closePayment,
  };
}
