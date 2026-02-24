export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  platformFeePercent: 12,
  currency: 'usd' as const,
  statementDescriptor: 'ArtRoom',
} as const;

export function calculateStripeFees(amountInCents: number) {
  const platformFee = Math.round(
    (amountInCents * STRIPE_CONFIG.platformFeePercent) / 100
  );
  const creatorPayout = amountInCents - platformFee;
  return { platformFee, creatorPayout, total: amountInCents };
}
