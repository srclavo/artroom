'use client';

import { SolanaWalletProvider } from '@/contexts/SolanaWalletContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <SolanaWalletProvider>{children}</SolanaWalletProvider>;
}
