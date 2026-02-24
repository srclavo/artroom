import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get design
  const { data: design } = await supabase
    .from('designs')
    .select('id, creator_id, file_url, title')
    .eq('id', id)
    .single();

  const d = design as unknown as {
    id: string;
    creator_id: string;
    file_url: string | null;
    title: string;
  } | null;

  if (!d) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  // Check: is creator or has purchased
  const isCreator = d.creator_id === user.id;

  if (!isCreator) {
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('design_id', id)
      .eq('status', 'completed')
      .limit(1)
      .single();

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase required' }, { status: 403 });
    }
  }

  if (!d.file_url) {
    return NextResponse.json({ error: 'No file available for download' }, { status: 404 });
  }

  // Generate signed URL from Supabase Storage (5 min)
  const { data: signedData, error: signedError } = await supabase.storage
    .from('design-files')
    .createSignedUrl(d.file_url, 300);

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
  }

  return NextResponse.redirect(signedData.signedUrl);
}
