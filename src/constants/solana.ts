export const SOLANA_CONFIG = {
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'devnet') as 'devnet' | 'mainnet-beta',
  rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
  recipient: process.env.NEXT_PUBLIC_SOLANA_RECIPIENT ?? '11111111111111111111111111111112',
  explorer: 'https://explorer.solana.com',
  /** Demo rate: 0.01 SOL per $1 on devnet */
  solPerUsd: 0.01,
  localStorageKey: 'artroom_wallet',
} as const;

export function explorerUrl(signature: string): string {
  const cluster = SOLANA_CONFIG.network === 'mainnet-beta'
    ? ''
    : `?cluster=${SOLANA_CONFIG.network}`;
  return `${SOLANA_CONFIG.explorer}/tx/${signature}${cluster}`;
}
