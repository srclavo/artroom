'use client';

import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DesignWithCreator } from '@/types/design';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DesignWithCreator[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const supabase = createClient();

  const search = useCallback(
    (q: string) => {
      setQuery(q);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!q.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        const { data } = await supabase
          .from('designs')
          .select(`
            *,
            creator:profiles!designs_creator_id_fkey (
              id, username, display_name, avatar_url, is_verified
            )
          `)
          .eq('status', 'published')
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .limit(20);

        if (data) {
          setResults(data as unknown as DesignWithCreator[]);
        }
        setLoading(false);
      }, 300);
    },
    []
  );

  return { query, results, loading, search };
}
