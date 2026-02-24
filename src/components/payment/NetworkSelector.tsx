'use client';

import { NETWORKS } from '@/constants/networks';
import { cn } from '@/lib/utils';
import type { CryptoNetwork } from '@/types/payment';

interface NetworkSelectorProps {
  activeNetwork: CryptoNetwork;
  onNetworkChange: (network: CryptoNetwork) => void;
}

export function NetworkSelector({ activeNetwork, onNetworkChange }: NetworkSelectorProps) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {NETWORKS.map((net) => (
        <button
          key={net.id}
          onClick={() => onNetworkChange(net.id)}
          className={cn(
            'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em]',
            'px-4 py-1.5 rounded-full border-[1.5px] cursor-pointer transition-all',
            activeNetwork === net.id
              ? 'text-white'
              : 'bg-white text-[#888] border-[#e0e0e0] hover:border-[#999]'
          )}
          style={
            activeNetwork === net.id
              ? { backgroundColor: net.color, borderColor: net.color }
              : undefined
          }
        >
          {net.name}
        </button>
      ))}
    </div>
  );
}
