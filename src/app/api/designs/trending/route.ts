import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Get designs with high recent engagement
  // Score: likes (weight 3) + views (weight 1) + downloads/purchases (weight 5)
  const { data: designs } = await supabase
    .from('designs')
    .select(`
      *,
      creator:profiles!designs_creator_id_fkey (
        id, username, display_name, avatar_url, is_verified
      )
    `)
    .eq('status', 'published')
    .order('like_count', { ascending: false })
    .limit(12);

  // Also get recent likes to boost recently-liked designs
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentLikes } = await supabase
    .from('likes')
    .select('design_id')
    .gte('created_at', sevenDaysAgo);

  const likeBoosts: Record<string, number> = {};
  (recentLikes ?? []).forEach((l: { design_id: string }) => {
    likeBoosts[l.design_id] = (likeBoosts[l.design_id] || 0) + 1;
  });

  // Score and sort
  const scored = (designs ?? []).map((d: { id: string; like_count: number; view_count: number; download_count: number }) => ({
    ...d,
    _score: (likeBoosts[d.id] || 0) * 3 + d.like_count * 2 + d.view_count + d.download_count * 5,
  }));

  scored.sort((a: { _score: number }, b: { _score: number }) => b._score - a._score);

  return NextResponse.json(scored.slice(0, 12));
}
