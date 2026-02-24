import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  const body = await request.json();

  // Circle uses SNS-style notifications — verify if header present
  // For sandbox, we accept all events
  const { type } = body;

  switch (type) {
    case 'payment.confirmed': {
      const paymentIntentId = body.data?.id;
      const transactionHash = body.data?.transactionHash;

      if (paymentIntentId) {
        // Update purchase status
        await supabaseAdmin
          .from('purchases')
          .update({
            status: 'completed',
            transaction_hash: transactionHash || null,
          } as never)
          .eq('stripe_payment_id', paymentIntentId); // reused field for Circle PI ID

        // Get purchase details for notification
        const { data: purchase } = await supabaseAdmin
          .from('purchases')
          .select('buyer_id, design_id, amount')
          .eq('stripe_payment_id', paymentIntentId)
          .single();

        const p = purchase as unknown as {
          buyer_id: string;
          design_id: string | null;
          amount: number;
        } | null;

        if (p?.design_id) {
          const { data: design } = await supabaseAdmin
            .from('designs')
            .select('title, creator_id')
            .eq('id', p.design_id)
            .single();

          const d = design as unknown as { title: string; creator_id: string } | null;

          if (d) {
            // Increment download count
            await supabaseAdmin.rpc('increment_download_count' as never, {
              design_id_param: p.design_id,
            } as never);

            // Notify creator
            await createNotification(
              d.creator_id,
              'sale',
              'New USDC sale!',
              `Someone purchased "${d.title}" for $${p.amount} USDC`,
              { design_id: p.design_id, amount: p.amount }
            );

            // Notify buyer
            await createNotification(
              p.buyer_id,
              'purchase',
              'Purchase complete',
              `You now have access to "${d.title}"`,
              { design_id: p.design_id }
            );
          }
        }
      }

      break;
    }

    case 'payment.failed': {
      const paymentIntentId = body.data?.id;

      if (paymentIntentId) {
        await supabaseAdmin
          .from('purchases')
          .update({ status: 'failed' } as never)
          .eq('stripe_payment_id', paymentIntentId);
      }

      break;
    }
  }

  return NextResponse.json({ received: true });
}
