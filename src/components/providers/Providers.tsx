'use client';

import { SolanaWalletProvider } from '@/contexts/SolanaWalletContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider>
      <CartProvider>
        {children}
        <ToastContainer />
      </CartProvider>
    </SolanaWalletProvider>
  );
}
