'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useFollow(targetUserId: string, currentUserId?: string | null) {
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchState = async () => {
      // Get follower count
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      setFollowerCount(count ?? 0);

      // Check if current user follows
      if (currentUserId) {
        const { data } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId)
          .maybeSingle();

        setFollowing(!!data);
      }
    };

    if (targetUserId) fetchState();
  }, [targetUserId, currentUserId]);

  const toggleFollow = useCallback(async () => {
    if (!currentUserId || loading) return;
    setLoading(true);

    const wasFollowing = following;
    // Optimistic update
    setFollowing(!wasFollowing);
    setFollowerCount((c) => (wasFollowing ? c - 1 : c + 1));

    try {
      if (wasFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: currentUserId, following_id: targetUserId } as never);

        if (error) throw error;
      }
    } catch {
      // Rollback
      setFollowing(wasFollowing);
      setFollowerCount((c) => (wasFollowing ? c + 1 : c - 1));
    } finally {
      setLoading(false);
    }
  }, [currentUserId, targetUserId, following, loading, supabase]);

  return { following, followerCount, toggleFollow, loading };
}
