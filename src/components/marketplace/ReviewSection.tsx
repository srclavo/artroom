'use client';

import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ReviewSectionProps {
  designId: string;
  hasPurchased: boolean;
}

function StarRating({ rating, onRate, size = 16 }: { rating: number; onRate?: (r: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => onRate?.(i)}
          onMouseEnter={() => onRate && setHover(i)}
          onMouseLeave={() => setHover(0)}
          className={cn(
            'bg-transparent border-none p-0 transition-colors',
            onRate ? 'cursor-pointer' : 'cursor-default'
          )}
        >
          <Star
            size={size}
            fill={(hover || rating) >= i ? '#f59e0b' : 'none'}
            className={(hover || rating) >= i ? 'text-[#f59e0b]' : 'text-[#ddd]'}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewSection({ designId, hasPurchased }: ReviewSectionProps) {
  const { user } = useAuth();
  const {
    reviews,
    loading,
    averageRating,
    reviewCount,
    distribution,
    addReview,
    deleteReview,
    userReview,
  } = useReviews(designId);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (newRating === 0) return;
    setSubmitting(true);
    try {
      await addReview(newRating, newComment);
      setNewRating(0);
      setNewComment('');
    } catch {
      // Review exists or error
    }
    setSubmitting(false);
  };

  if (loading) return null;

  const maxDist = Math.max(...distribution, 1);

  return (
    <div className="border-t border-[#f0f0f0] pt-8 mt-8">
      <h3 className="font-[family-name:var(--font-syne)] text-[16px] font-bold mb-5">
        Reviews {reviewCount > 0 && `(${reviewCount})`}
      </h3>

      {reviewCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 mb-8">
          {/* Average rating */}
          <div className="text-center sm:text-left">
            <div className="font-[family-name:var(--font-syne)] text-[42px] font-extrabold leading-none text-[#0a0a0a]">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(averageRating)} size={14} />
            <div className="text-[11px] text-[#999] mt-1">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</div>
          </div>

          {/* Distribution bars */}
          <div className="flex flex-col gap-1.5 justify-center">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] text-[#999] w-3 text-right">{star}</span>
                <Star size={10} fill="#f59e0b" className="text-[#f59e0b]" />
                <div className="flex-1 h-[6px] bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f59e0b] rounded-full transition-all"
                    style={{ width: `${(distribution[star - 1] / maxDist) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#ccc] w-4">{distribution[star - 1]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review form */}
      {user && hasPurchased && !userReview && (
        <div className="mb-8 p-5 bg-[#fafafa] rounded-[12px] border border-[#e8e8e8]">
          <div className="font-[family-name:var(--font-syne)] text-[12px] font-bold mb-3">Write a Review</div>
          <div className="mb-3">
            <StarRating rating={newRating} onRate={setNewRating} size={22} />
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this design..."
            className="w-full border border-[#e8e8e8] rounded-[8px] px-3.5 py-2.5 text-[13px] outline-none resize-y min-h-[80px] focus:border-[#0a0a0a] transition-colors font-[family-name:var(--font-dm-sans)]"
          />
          <button
            onClick={handleSubmit}
            disabled={newRating === 0 || submitting}
            className={cn(
              'mt-2.5 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-5 py-2.5 rounded-full border-none cursor-pointer transition-all',
              newRating > 0
                ? 'bg-[#0a0a0a] text-white hover:bg-[#333]'
                : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
            )}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-[#ccc]">
          No reviews yet. {hasPurchased ? 'Be the first to review!' : 'Purchase to leave a review.'}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f0f0f0] flex-shrink-0 overflow-hidden flex items-center justify-center">
                {review.user.avatar_url ? (
                  <img src={review.user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#999]">
                    {(review.user.display_name || review.user.username).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold">
                    {review.user.display_name || review.user.username}
                  </span>
                  <StarRating rating={review.rating} size={10} />
                  <span className="text-[10px] text-[#ccc] ml-auto">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {user?.id === review.user_id && (
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="ml-1 bg-transparent border-none cursor-pointer text-[#ccc] hover:text-[#E8001A] transition-colors p-0"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
                {review.comment && (
                  <p className="text-[13px] text-[#555] leading-[1.7] m-0">{review.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
