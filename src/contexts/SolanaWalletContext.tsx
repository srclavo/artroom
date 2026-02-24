'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { SOLANA_CONFIG } from '@/constants/solana';
import type { PhantomProvider } from '@/types/phantom';

interface SolanaWalletState {
  isPhantomInstalled: boolean;
  isConnected: boolean;
  address: string | null;
  displayAddress: string;
  balance: number | null;
  loading: boolean;
  connect: () => Promise<string | null>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  transferSOL: (amountUSD: number) => Promise<string>;
}

const SolanaWalletContext = createContext<SolanaWalletState | null>(null);

function truncate(addr: string) {
  return `${addr.slice(0, 4)}..${addr.slice(-4)}`;
}

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [phantomDetected, setPhantomDetected] = useState(false);
  const connectionRef = useRef<Connection | null>(null);

  const getProvider = useCallback((): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    const p = window.phantom?.solana ?? window.solana ?? null;
    return p?.isPhantom ? p : null;
  }, []);

  const getConnection = useCallback((): Connection => {
    if (!connectionRef.current) {
      connectionRef.current = new Connection(SOLANA_CONFIG.rpcUrl, 'confirmed');
    }
    return connectionRef.current;
  }, []);

  // Detect Phantom + silent reconnect on mount
  useEffect(() => {
    const provider = getProvider();
    setPhantomDetected(!!provider);
    if (!provider) return;

    const savedAddr = localStorage.getItem(SOLANA_CONFIG.localStorageKey);
    if (!savedAddr) return;

    provider
      .connect({ onlyIfTrusted: true })
      .then((resp) => {
        const addr = resp.publicKey.toString();
        setAddress(addr);
        localStorage.setItem(SOLANA_CONFIG.localStorageKey, addr);
      })
      .catch(() => {
        // User didn't pre-approve — that's fine
      });
  }, [getProvider]);

  // Auto-fetch balance when address changes
  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }
    const conn = getConnection();
    conn
      .getBalance(new PublicKey(address))
      .then((lamports) => setBalance(lamports / LAMPORTS_PER_SOL))
      .catch(() => setBalance(null));
  }, [address, getConnection]);

  const connect = useCallback(async (): Promise<string | null> => {
    const provider = getProvider();
    if (!provider) return null;

    setLoading(true);
    try {
      const resp = await provider.connect();
      const addr = resp.publicKey.toString();
      setAddress(addr);
      localStorage.setItem(SOLANA_CONFIG.localStorageKey, addr);

      // Listen for account changes
      const handleAccountChanged = (pk: PublicKey | null) => {
        if (pk) {
          const newAddr = pk.toString();
          setAddress(newAddr);
          localStorage.setItem(SOLANA_CONFIG.localStorageKey, newAddr);
        } else {
          setAddress(null);
          localStorage.removeItem(SOLANA_CONFIG.localStorageKey);
        }
      };
      provider.on('accountChanged', handleAccountChanged);

      return addr;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProvider]);

  const disconnect = useCallback(async () => {
    const provider = getProvider();
    if (provider) {
      try { await provider.disconnect(); } catch { /* silent */ }
    }
    setAddress(null);
    setBalance(null);
    localStorage.removeItem(SOLANA_CONFIG.localStorageKey);
  }, [getProvider]);

  const refreshBalance = useCallback(async () => {
    if (!address) return;
    try {
      const conn = getConnection();
      const lamports = await conn.getBalance(new PublicKey(address));
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch {
      // silent
    }
  }, [address, getConnection]);

  const transferSOL = useCallback(
    async (amountUSD: number): Promise<string> => {
      if (!address) throw new Error('Wallet not connected');
      const provider = getProvider();
      const conn = getConnection();
      if (!provider) throw new Error('Phantom not available');

      const recipient = new PublicKey(SOLANA_CONFIG.recipient);
      const solAmount = amountUSD * SOLANA_CONFIG.solPerUsd;
      let lamports = Math.round(solAmount * LAMPORTS_PER_SOL);
      if (lamports < 1) lamports = 1;

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(address),
          toPubkey: recipient,
          lamports,
        })
      );

      const bh = await conn.getLatestBlockhash('confirmed');
      tx.recentBlockhash = bh.blockhash;
      tx.feePayer = new PublicKey(address);

      const signed = await provider.signAndSendTransaction(tx);

      await conn.confirmTransaction(
        {
          signature: signed.signature,
          blockhash: bh.blockhash,
          lastValidBlockHeight: bh.lastValidBlockHeight,
        },
        'confirmed'
      );

      // Refresh balance after transfer
      refreshBalance();

      return signed.signature;
    },
    [address, getProvider, getConnection, refreshBalance]
  );

  const value: SolanaWalletState = {
    isPhantomInstalled: phantomDetected,
    isConnected: !!address,
    address,
    displayAddress: address ? truncate(address) : '',
    balance,
    loading,
    connect,
    disconnect,
    refreshBalance,
    transferSOL,
  };

  return (
    <SolanaWalletContext.Provider value={value}>
      {children}
    </SolanaWalletContext.Provider>
  );
}

export function useSolanaWallet(): SolanaWalletState {
  const ctx = useContext(SolanaWalletContext);
  if (!ctx) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return ctx;
}
