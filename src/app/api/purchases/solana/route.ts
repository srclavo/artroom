import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculatePlatformFee } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { designId, txSignature, amount } = await req.json();

  if (!designId || !txSignature) {
    return NextResponse.json({ error: 'Missing designId or txSignature' }, { status: 400 });
  }

  // Verify the design exists
  const { data: design } = await supabase
    .from('designs')
    .select('id, price')
    .eq('id', designId)
    .single();

  if (!design) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  const d = design as unknown as { id: string; price: number };
  const finalAmount = amount || d.price;
  const { fee, payout } = calculatePlatformFee(finalAmount);

  // Insert completed purchase
  const { error } = await supabase.from('purchases').insert({
    buyer_id: user.id,
    design_id: designId,
    amount: finalAmount,
    platform_fee: fee,
    creator_payout: payout,
    payment_method: 'usdc',
    payment_network: 'solana',
    transaction_hash: txSignature,
    status: 'completed',
  } as never);

  if (error) {
    return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
