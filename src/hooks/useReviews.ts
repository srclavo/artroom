'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  id: string;
  user_id: string;
  design_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useReviews(designId: string) {
  const supabase = createClient();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [distribution, setDistribution] = useState<number[]>([0, 0, 0, 0, 0]); // index 0 = 1 star

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles!reviews_user_id_fkey (
          username, display_name, avatar_url
        )
      `)
      .eq('design_id', designId)
      .order('created_at', { ascending: false });

    const rows = (data ?? []) as unknown as Review[];
    setReviews(rows);
    setReviewCount(rows.length);

    if (rows.length > 0) {
      const sum = rows.reduce((acc, r) => acc + r.rating, 0);
      setAverageRating(sum / rows.length);

      const dist = [0, 0, 0, 0, 0];
      rows.forEach((r) => { dist[r.rating - 1]++; });
      setDistribution(dist);
    }
    setLoading(false);
  }, [designId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = useCallback(async (rating: number, comment?: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        design_id: designId,
        rating,
        comment: comment || null,
      } as never);
    if (error) throw error;
    await fetchReviews();
  }, [user, designId, fetchReviews]);

  const deleteReview = useCallback(async (reviewId: string) => {
    await supabase.from('reviews').delete().eq('id', reviewId);
    await fetchReviews();
  }, [fetchReviews]);

  const userReview = reviews.find((r) => r.user_id === user?.id);

  return {
    reviews,
    loading,
    averageRating,
    reviewCount,
    distribution,
    addReview,
    deleteReview,
    userReview,
  };
}
