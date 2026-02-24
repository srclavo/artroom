'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/user';
import type { DesignWithCreator } from '@/types/design';
import type { Database } from '@/types/database';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];

export function useProfile(username: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [designs, setDesigns] = useState<DesignWithCreator[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [designCount, setDesignCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    setLoading(true);

    // Fetch profile by username
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    const prof = profileData as unknown as Profile | null;
    if (!prof) {
      setLoading(false);
      return;
    }

    setProfile(prof);

    // Fetch designs, portfolios, and follower count in parallel
    const [designsRes, portfoliosRes, followersRes] = await Promise.all([
      supabase
        .from('designs')
        .select(`
          *,
          creator:profiles!designs_creator_id_fkey (
            id, username, display_name, avatar_url, is_verified
          )
        `)
        .eq('creator_id', prof.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      supabase
        .from('portfolios')
        .select('*')
        .eq('creator_id', prof.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', prof.id),
    ]);

    if (designsRes.data) {
      setDesigns(designsRes.data as unknown as DesignWithCreator[]);
      setDesignCount(designsRes.data.length);
    }

    if (portfoliosRes.data) {
      setPortfolios(portfoliosRes.data as unknown as Portfolio[]);
    }

    setFollowerCount(followersRes.count ?? 0);
    setLoading(false);
  }, [username]);

  useEffect(() => {
    if (username) fetchProfile();
  }, [fetchProfile, username]);

  return { profile, designs, portfolios, followerCount, designCount, loading, refetch: fetchProfile };
}
