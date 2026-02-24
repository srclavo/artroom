import type { PublicKey, Transaction } from '@solana/web3.js';

export interface PhantomProvider {
  isPhantom: boolean;
  publicKey: PublicKey | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (
    transaction: Transaction
  ) => Promise<{ signature: string }>;
  on: (event: string, callback: (publicKey: PublicKey | null) => void) => void;
  off: (event: string, callback: (publicKey: PublicKey | null) => void) => void;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: PhantomProvider;
  }
}
