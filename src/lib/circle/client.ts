const CIRCLE_BASE_URL =
  process.env.CIRCLE_ENVIRONMENT === 'production'
    ? 'https://api.circle.com'
    : 'https://api-sandbox.circle.com';

export async function circleRequest(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${CIRCLE_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Circle API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Network mapping for Circle API
const CIRCLE_CHAIN_MAP: Record<string, string> = {
  polygon: 'MATIC',
  base: 'BASE',
  ethereum: 'ETH',
  solana: 'SOL',
};

export function getCircleChain(network: string): string {
  return CIRCLE_CHAIN_MAP[network] || network.toUpperCase();
}

export async function createCirclePaymentIntent(params: {
  amount: string;
  network: string;
  idempotencyKey: string;
}) {
  return circleRequest('/v1/paymentIntents', {
    method: 'POST',
    body: JSON.stringify({
      amount: { amount: params.amount, currency: 'USD' },
      settlementCurrency: 'USD',
      paymentMethods: [
        {
          type: 'blockchain',
          chain: getCircleChain(params.network),
        },
      ],
      idempotencyKey: params.idempotencyKey,
    }),
  });
}

export async function getCirclePaymentIntent(paymentIntentId: string) {
  return circleRequest(`/v1/paymentIntents/${paymentIntentId}`);
}
