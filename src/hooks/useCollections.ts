'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/types/database';

type Collection = Database['public']['Tables']['collections']['Row'];

export function useCollections() {
  const supabase = createClient();
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      setCollections((data ?? []) as unknown as Collection[]);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const createCollection = useCallback(async (name: string, description?: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('collections')
      .insert({ user_id: user.id, name, description: description ?? null } as never)
      .select()
      .single();
    if (error) throw error;
    const col = data as unknown as Collection;
    setCollections((prev) => [col, ...prev]);
    return col;
  }, [user]);

  const addToCollection = useCallback(async (collectionId: string, designId: string) => {
    await supabase
      .from('collection_items')
      .insert({ collection_id: collectionId, design_id: designId } as never);
    // Update the collection's updated_at
    await supabase
      .from('collections')
      .update({ updated_at: new Date().toISOString() } as never)
      .eq('id', collectionId);
  }, []);

  const removeFromCollection = useCallback(async (collectionId: string, designId: string) => {
    await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('design_id', designId);
  }, []);

  const deleteCollection = useCallback(async (id: string) => {
    await supabase.from('collections').delete().eq('id', id);
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    collections,
    loading,
    createCollection,
    addToCollection,
    removeFromCollection,
    deleteCollection,
  };
}
