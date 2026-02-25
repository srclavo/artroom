/** Platform fee percentage applied to all transactions */
export const PLATFORM_FEE_PERCENT = 12;

/** Calculate platform fee and creator earnings from a price */
export function calculateFees(price: number) {
  const fee = price * (PLATFORM_FEE_PERCENT / 100);
  const earnings = price - fee;
  return {
    feePercent: PLATFORM_FEE_PERCENT,
    fee: Math.round(fee * 100) / 100,
    earnings: Math.round(earnings * 100) / 100,
  };
}
