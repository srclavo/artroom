import type { Database } from './database';

export type Purchase = Database['public']['Tables']['purchases']['Row'];
export type PurchaseInsert = Database['public']['Tables']['purchases']['Insert'];

export type PaymentMethod = 'card' | 'apple_pay' | 'usdc';

export type CryptoNetwork = 'polygon' | 'base' | 'solana' | 'ethereum';

export interface PaymentIntent {
  itemName: string;
  itemPrice: number;
  creatorUsername: string;
  designId?: string;
  portfolioId?: string;
  creatorStripeAccountId?: string;
}

export interface StripePaymentData {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface USDCPaymentDetails {
  network: CryptoNetwork;
  walletAddress: string;
  amount: number;
  tokenSymbol: string;
}
