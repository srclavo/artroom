'use client';

import { SolanaWalletProvider } from '@/contexts/SolanaWalletContext';
import { CartProvider } from '@/contexts/CartContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider>
      <CartProvider>{children}</CartProvider>
    </SolanaWalletProvider>
  );
}
