import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { calculateStripeFees } from '@/lib/stripe/config';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { designId, designIds } = await req.json();

  // Support single design or cart (multiple designs)
  const ids: string[] = designIds || (designId ? [designId] : []);
  if (ids.length === 0) {
    return NextResponse.json({ error: 'No design specified' }, { status: 400 });
  }

  // Fetch all designs with their creators
  const { data: designs } = await supabase
    .from('designs')
    .select('id, price, creator_id, title, status')
    .in('id', ids);

  const rows = (designs ?? []) as unknown as {
    id: string;
    price: number;
    creator_id: string;
    title: string;
    status: string;
  }[];

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  // For single design — use Stripe Connect split payment
  // For cart — we pay to platform and handle splits via webhooks
  const totalPrice = rows.reduce((sum, d) => sum + d.price, 0);
  const amountInCents = Math.round(totalPrice * 100);
  const { platformFee, creatorPayout } = calculateStripeFees(amountInCents);

  // For single design, use direct transfer to creator's Stripe account
  let transferDestination: string | undefined;
  if (rows.length === 1) {
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', rows[0].creator_id)
      .single();

    const creatorStripeId = (creatorProfile as unknown as { stripe_account_id: string | null })
      ?.stripe_account_id;

    if (creatorStripeId) {
      transferDestination = creatorStripeId;
    }
  }

  // Create Stripe PaymentIntent
  const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
    amount: amountInCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      buyer_id: user.id,
      design_ids: ids.join(','),
    },
  };

  if (transferDestination) {
    paymentIntentParams.application_fee_amount = platformFee;
    paymentIntentParams.transfer_data = { destination: transferDestination };
  }

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

  // Create pending purchase rows
  for (const design of rows) {
    const designAmount = design.price;
    const designFees = calculateStripeFees(Math.round(designAmount * 100));

    await supabase.from('purchases').insert({
      buyer_id: user.id,
      design_id: design.id,
      amount: designAmount,
      platform_fee: designFees.platformFee / 100,
      creator_payout: designFees.creatorPayout / 100,
      payment_method: 'card',
      stripe_payment_id: paymentIntent.id,
      status: 'pending',
    } as never);
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: amountInCents,
  });
}
