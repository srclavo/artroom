import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCirclePaymentIntent, getCirclePaymentIntent } from '@/lib/circle/client';
import { calculatePlatformFee } from '@/lib/utils';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { designId, network } = await req.json();

  if (!designId || !network) {
    return NextResponse.json({ error: 'Missing designId or network' }, { status: 400 });
  }

  // Fetch design
  const { data: design } = await supabase
    .from('designs')
    .select('id, price, creator_id')
    .eq('id', designId)
    .single();

  const d = design as unknown as { id: string; price: number; creator_id: string } | null;
  if (!d) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  const { fee, payout } = calculatePlatformFee(d.price);

  try {
    // Create Circle payment intent
    const circleResult = await createCirclePaymentIntent({
      amount: d.price.toFixed(2),
      network,
      idempotencyKey: randomUUID(),
    });

    const circlePI = circleResult.data;
    const depositAddress =
      circlePI?.paymentMethods?.[0]?.address || circlePI?.depositAddress || null;

    // Create pending purchase
    await supabase.from('purchases').insert({
      buyer_id: user.id,
      design_id: designId,
      amount: d.price,
      platform_fee: fee,
      creator_payout: payout,
      payment_method: 'usdc',
      payment_network: network,
      stripe_payment_id: circlePI?.id || null, // reusing field for Circle PI ID
      status: 'pending',
    } as never);

    return NextResponse.json({
      paymentIntentId: circlePI?.id,
      depositAddress,
      amount: d.price.toFixed(2),
      network,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Circle API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const paymentIntentId = req.nextUrl.searchParams.get('id');

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing payment intent ID' }, { status: 400 });
  }

  try {
    const result = await getCirclePaymentIntent(paymentIntentId);
    const status = result.data?.timeline?.[0]?.status || result.data?.status || 'pending';

    return NextResponse.json({
      status,
      transactionHash: result.data?.timeline?.[0]?.transactionHash || null,
    });
  } catch {
    return NextResponse.json({ status: 'pending' });
  }
}
