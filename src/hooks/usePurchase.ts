'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

export function usePurchase(designId: string | undefined) {
  const { user } = useAuth();
  const supabase = createClient();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !designId) {
      setLoading(false);
      return;
    }

    const check = async () => {
      setLoading(true);

      // Check if user is the creator
      const { data: design } = await supabase
        .from('designs')
        .select('creator_id')
        .eq('id', designId)
        .single();

      const d = design as unknown as { creator_id: string } | null;
      if (d?.creator_id === user.id) {
        setIsOwner(true);
        setLoading(false);
        return;
      }

      // Check for completed purchase
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('design_id', designId)
        .eq('status', 'completed')
        .limit(1)
        .single();

      setHasPurchased(!!purchase);
      setLoading(false);
    };

    check();
  }, [user, designId]);

  const recheck = async () => {
    if (!user || !designId) return;

    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('design_id', designId)
      .eq('status', 'completed')
      .limit(1)
      .single();

    setHasPurchased(!!purchase);
  };

  return { hasPurchased, isOwner, loading, recheck };
}
