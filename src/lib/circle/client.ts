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
