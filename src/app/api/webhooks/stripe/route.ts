import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createNotification } from '@/lib/notifications';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const designIds = pi.metadata.design_ids?.split(',') ?? [];
      const buyerId = pi.metadata.buyer_id;

      // Update all purchases linked to this PaymentIntent
      await supabaseAdmin
        .from('purchases')
        .update({ status: 'completed' } as never)
        .eq('stripe_payment_id', pi.id);

      // Increment download count + notify creator for each design
      for (const designId of designIds) {
        if (!designId) continue;

        await supabaseAdmin.rpc('increment_download_count' as never, {
          design_id_param: designId,
        } as never);

        // Get design info for notification
        const { data: design } = await supabaseAdmin
          .from('designs')
          .select('title, creator_id, price')
          .eq('id', designId)
          .single();

        if (design) {
          const d = design as unknown as { title: string; creator_id: string; price: number };

          // Get buyer name
          const { data: buyer } = await supabaseAdmin
            .from('profiles')
            .select('display_name, username')
            .eq('id', buyerId)
            .single();
          const b = buyer as unknown as { display_name: string | null; username: string } | null;
          const buyerName = b?.display_name || b?.username || 'Someone';

          // Notify creator
          await createNotification(
            d.creator_id,
            'sale',
            'New sale!',
            `${buyerName} purchased "${d.title}" for $${d.price}`,
            { design_id: designId, buyer_id: buyerId, amount: d.price }
          );

          // Notify buyer
          if (buyerId) {
            await createNotification(
              buyerId,
              'purchase',
              'Purchase complete',
              `You now have access to "${d.title}"`,
              { design_id: designId }
            );
          }
        }
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;

      await supabaseAdmin
        .from('purchases')
        .update({ status: 'failed' } as never)
        .eq('stripe_payment_id', pi.id);

      break;
    }

    case 'account.updated': {
      // Stripe Connect account status update — handled by settings page polling
      break;
    }
  }

  return NextResponse.json({ received: true });
}
