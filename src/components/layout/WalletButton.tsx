'use client';

import { useSolanaWallet } from '@/contexts/SolanaWalletContext';

export function WalletButton() {
  const wallet = useSolanaWallet();

  if (!wallet.isPhantomInstalled) return null;

  if (wallet.isConnected) {
    return (
      <button
        onClick={() => wallet.disconnect()}
        title={wallet.address ?? ''}
        className="font-[family-name:var(--font-dm-sans)] text-[10px] font-medium px-3.5 py-1.5 rounded-full bg-[#0a0a0a] text-white border-[1.5px] border-[#0a0a0a] cursor-pointer hover:bg-[#333] hover:border-[#333] transition-all whitespace-nowrap self-center"
      >
        {wallet.displayAddress}
      </button>
    );
  }

  return (
    <button
      onClick={() => wallet.connect()}
      disabled={wallet.loading}
      title="Connect Phantom wallet"
      className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full border-[1.5px] border-[#e0e0e0] bg-white text-[#666] cursor-pointer hover:border-[#9945FF] hover:text-[#9945FF] hover:bg-[#faf5ff] transition-all whitespace-nowrap self-center disabled:opacity-50"
    >
      &#x25CE; Connect
    </button>
  );
}
