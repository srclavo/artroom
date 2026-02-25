'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useLike(designId: string, userId?: string | null) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchState = async () => {
      // Get current like count from design
      const { data: design } = await supabase
        .from('designs')
        .select('like_count')
        .eq('id', designId)
        .single();

      const d = design as unknown as { like_count: number } | null;
      if (d) setLikeCount(d.like_count ?? 0);

      // Check if current user liked it
      if (userId) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', userId)
          .eq('design_id', designId)
          .maybeSingle();

        setLiked(!!data);
      }
    };

    fetchState();
  }, [designId, userId]);

  const toggleLike = useCallback(async () => {
    if (!userId || loading) return;
    setLoading(true);

    const wasLiked = liked;
    // Optimistic update
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));

    try {
      if (wasLiked) {
        // Unlike: delete the like record
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('design_id', designId);

        if (error) throw error;
      } else {
        // Like: insert the like record
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: userId, design_id: designId } as never);

        if (error) throw error;
      }

      // Atomic count: always count actual likes rows to avoid drift
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('design_id', designId);

      const actualCount = count ?? 0;

      await supabase
        .from('designs')
        .update({ like_count: actualCount } as never)
        .eq('id', designId);

      setLikeCount(actualCount);
    } catch {
      // Rollback on error
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setLoading(false);
    }
  }, [userId, designId, liked, loading, supabase]);

  return { liked, likeCount, toggleLike, loading };
}
