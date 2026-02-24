import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in — return trending instead
    const { data } = await supabase
      .from('designs')
      .select(`
        *,
        creator:profiles!designs_creator_id_fkey (
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('status', 'published')
      .order('like_count', { ascending: false })
      .limit(8);

    return NextResponse.json(data ?? []);
  }

  // Get categories of designs the user has liked
  const { data: likedDesigns } = await supabase
    .from('likes')
    .select('design:designs (category)')
    .eq('user_id', user.id)
    .limit(20);

  const categories = new Set<string>();
  (likedDesigns ?? []).forEach((l: { design: { category: string } | null }) => {
    if (l.design?.category) categories.add(l.design.category);
  });

  // Get creators the user follows
  const { data: following } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  const followingIds = (following ?? []).map((f: { following_id: string }) => f.following_id);

  // Fetch designs from followed creators
  let recommended: unknown[] = [];
  if (followingIds.length > 0) {
    const { data } = await supabase
      .from('designs')
      .select(`
        *,
        creator:profiles!designs_creator_id_fkey (
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('status', 'published')
      .in('creator_id', followingIds)
      .neq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8);
    recommended = data ?? [];
  }

  // If not enough from follows, add from liked categories
  if (recommended.length < 8 && categories.size > 0) {
    const { data } = await supabase
      .from('designs')
      .select(`
        *,
        creator:profiles!designs_creator_id_fkey (
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('status', 'published')
      .in('category', Array.from(categories))
      .neq('creator_id', user.id)
      .order('like_count', { ascending: false })
      .limit(8 - recommended.length);

    const existingIds = new Set(recommended.map((r: unknown) => (r as { id: string }).id));
    const extra = (data ?? []).filter((d: unknown) => !existingIds.has((d as { id: string }).id));
    recommended = [...recommended, ...extra];
  }

  // Fallback: popular designs
  if (recommended.length < 4) {
    const { data } = await supabase
      .from('designs')
      .select(`
        *,
        creator:profiles!designs_creator_id_fkey (
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('status', 'published')
      .neq('creator_id', user.id)
      .order('like_count', { ascending: false })
      .limit(8);

    const existingIds = new Set(recommended.map((r: unknown) => (r as { id: string }).id));
    const extra = (data ?? []).filter((d: unknown) => !existingIds.has((d as { id: string }).id));
    recommended = [...recommended, ...extra].slice(0, 8);
  }

  return NextResponse.json(recommended);
}
