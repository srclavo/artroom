import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch profile to check existing stripe_account_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id, username, display_name')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  let accountId = (profile as unknown as { stripe_account_id: string | null }).stripe_account_id;

  // Create a new Stripe Express account if none exists
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      metadata: { user_id: user.id },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    accountId = account.id;

    // Save to profile
    await supabase
      .from('profiles')
      .update({ stripe_account_id: accountId } as never)
      .eq('id', user.id);
  }

  // Generate onboarding link
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/dashboard/settings?stripe=refresh`,
    return_url: `${appUrl}/dashboard/settings/stripe-return`,
    type: 'account_onboarding',
  });

  return NextResponse.json({ url: accountLink.url });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', user.id)
    .single();

  const stripeAccountId = (profile as unknown as { stripe_account_id: string | null })
    ?.stripe_account_id;

  if (!stripeAccountId) {
    return NextResponse.json({
      connected: false,
      chargesEnabled: false,
      detailsSubmitted: false,
      stripeAccountId: null,
    });
  }

  const account = await stripe.accounts.retrieve(stripeAccountId);

  return NextResponse.json({
    connected: true,
    chargesEnabled: account.charges_enabled,
    detailsSubmitted: account.details_submitted,
    stripeAccountId: account.id,
  });
}
