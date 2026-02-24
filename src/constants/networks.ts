import type { CryptoNetwork } from '@/types/payment';

export interface NetworkConfig {
  id: CryptoNetwork;
  name: string;
  color: string;
  tokenSymbol: string;
  explorerUrl: string;
}

export const NETWORKS: NetworkConfig[] = [
  {
    id: 'polygon',
    name: 'Polygon',
    color: '#8247E5',
    tokenSymbol: 'USDC',
    explorerUrl: 'https://polygonscan.com',
  },
  {
    id: 'base',
    name: 'Base',
    color: '#0052FF',
    tokenSymbol: 'USDC',
    explorerUrl: 'https://basescan.org',
  },
  {
    id: 'solana',
    name: 'Solana',
    color: '#9945FF',
    tokenSymbol: 'USDC',
    explorerUrl: 'https://solscan.io',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    color: '#627EEA',
    tokenSymbol: 'USDC',
    explorerUrl: 'https://etherscan.io',
  },
];

export const NETWORK_MAP = Object.fromEntries(
  NETWORKS.map((n) => [n.id, n])
);

export const PLATFORM_FEE_PERCENT = 15;
