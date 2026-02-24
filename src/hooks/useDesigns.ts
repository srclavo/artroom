'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DesignWithCreator } from '@/types/design';

interface UseDesignsOptions {
  category?: string | null;
  limit?: number;
  featured?: boolean;
}

export function useDesigns(options: UseDesignsOptions = {}) {
  const { category, limit = 20, featured } = options;
  const [designs, setDesigns] = useState<DesignWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('designs')
      .select(`
        *,
        creator:profiles!designs_creator_id_fkey (
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (!error && data) {
      setDesigns(data as unknown as DesignWithCreator[]);
    }
    setLoading(false);
  }, [category, limit, featured]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return { designs, loading, refetch: fetchDesigns };
}
