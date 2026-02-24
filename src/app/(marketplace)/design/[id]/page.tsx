'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag, Download } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';
import { useLike } from '@/hooks/useLike';
import { usePurchase } from '@/hooks/usePurchase';
import { useCart } from '@/contexts/CartContext';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_MAP } from '@/constants/categories';
import { formatCompactNumber } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import type { DesignWithCreator } from '@/types/design';

export default function DesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();
  const { user } = useAuth();
  const supabase = createClient();

  const [design, setDesign] = useState<DesignWithCreator | null>(null);
  const [moreFromCreator, setMoreFromCreator] = useState<DesignWithCreator[]>([]);
  const [similarDesigns, setSimilarDesigns] = useState<DesignWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  const { liked, likeCount, toggleLike } = useLike(id, user?.id);
  const { hasPurchased, isOwner, recheck: recheckPurchase } = usePurchase(id);
  const { addItem, isInCart } = useCart();

  useEffect(() => {
    const fetchDesign = async () => {
      setLoading(true);

      const { data } = await supabase
        .from('designs')
        .select(`
          *,
          creator:profiles!designs_creator_id_fkey (
            id, username, display_name, avatar_url, is_verified
          )
        `)
        .eq('id', id)
        .single();

      if (!data) {
        setLoading(false);
        return;
      }

      const d = data as unknown as DesignWithCreator;
      setDesign(d);

      // Fetch more from creator and similar designs in parallel
      const [moreRes, similarRes] = await Promise.all([
        supabase
          .from('designs')
          .select(`
            *,
            creator:profiles!designs_creator_id_fkey (
              id, username, display_name, avatar_url, is_verified
            )
          `)
          .eq('creator_id', d.creator_id)
          .eq('status', 'published')
          .neq('id', id)
          .limit(4),
        supabase
          .from('designs')
          .select(`
            *,
            creator:profiles!designs_creator_id_fkey (
              id, username, display_name, avatar_url, is_verified
            )
          `)
          .eq('category', d.category)
          .eq('status', 'published')
          .neq('id', id)
          .neq('creator_id', d.creator_id)
          .limit(4),
      ]);

      if (moreRes.data) setMoreFromCreator(moreRes.data as unknown as DesignWithCreator[]);
      if (similarRes.data) setSimilarDesigns(similarRes.data as unknown as DesignWithCreator[]);
      setLoading(false);
    };

    fetchDesign();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1060px] mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading...</div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="max-w-[1060px] mx-auto px-6 py-8">
        <Link
          href={ROUTES.home}
          className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
        >
          <ArrowLeft size={16} /> Back to Gallery
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-[32px] mb-3">🔍</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">Design not found</div>
        </div>
      </div>
    );
  }

  const category = CATEGORY_MAP[design.category];

  const handleBuy = () => {
    openPayment({
      itemName: design.title,
      itemPrice: design.price,
      creatorUsername: design.creator.username,
      designId: design.id,
    });
  };

  return (
    <div className="max-w-[1060px] mx-auto px-6 py-8">
      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
      >
        <ArrowLeft size={16} /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 border border-[#e5e5e5] rounded-[10px] overflow-hidden bg-white">
        {/* Left: Preview */}
        <div
          className="flex items-center justify-center min-h-[400px] border-r border-[#e8e8e8]"
          style={{ backgroundColor: category?.color ?? '#f0f0f0' }}
        >
          {design.thumbnail_url ? (
            <img src={design.thumbnail_url} alt={design.title} className="w-full h-full object-cover" />
          ) : (
            <span
              className="font-[family-name:var(--font-syne)] text-[72px] font-extrabold opacity-30"
              style={{ color: category?.textColor ?? '#0a0a0a' }}
            >
              {design.title.charAt(0)}
            </span>
          )}
        </div>

        {/* Right: Details */}
        <div className="p-7 flex flex-col overflow-y-auto max-h-[80vh]">
          <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold leading-[1.25] mb-3.5">
            {design.title}
          </h1>

          {/* Creator */}
          <Link
            href={ROUTES.artist(design.creator.username)}
            className="flex items-center gap-2.5 mb-4 pb-4 border-b border-[#f0f0f0] no-underline"
          >
            <Avatar
              name={design.creator.display_name || design.creator.username}
              size="md"
              color={category?.color}
            />
            <div>
              <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a]">
                {design.creator.display_name || design.creator.username}
              </div>
              <div className="text-[11px] text-[#bbb]">
                @{design.creator.username}.artroom
              </div>
            </div>
            <Button variant="primary" size="sm" className="ml-auto">
              Follow
            </Button>
          </Link>

          {/* Description */}
          <p className="text-[13px] leading-[1.75] text-[#555] mb-4">
            {design.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(design.tags ?? []).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-5 mb-5 pb-4 border-b border-[#f0f0f0]">
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {formatCompactNumber(design.view_count ?? 0)}
              </strong>
              views
            </div>
            <button
              onClick={(e) => { e.preventDefault(); toggleLike(); }}
              className="text-[11px] text-[#aaa] bg-transparent border-none cursor-pointer text-left p-0"
            >
              <strong className={`font-[family-name:var(--font-syne)] text-[18px] font-bold block flex items-center gap-1.5 ${liked ? 'text-[#E8001A]' : 'text-[#0a0a0a]'}`}>
                <Heart size={14} fill={liked ? '#E8001A' : 'none'} />
                {formatCompactNumber(likeCount)}
              </strong>
              likes
            </button>
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {formatCompactNumber(design.download_count ?? 0)}
              </strong>
              downloads
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            {hasPurchased || isOwner ? (
              <Button
                className="w-full"
                size="lg"
                onClick={() => window.open(`/api/designs/${design.id}/download`, '_blank')}
              >
                <Download size={14} className="mr-1.5" />
                Download
              </Button>
            ) : (
              <>
                <Button className="w-full" size="lg" onClick={handleBuy}>
                  Buy for ${design.price} &rarr;
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    addItem({
                      designId: design.id,
                      title: design.title,
                      price: design.price,
                      thumbnailUrl: design.thumbnail_url,
                      creatorUsername: design.creator.username,
                      category: design.category,
                    });
                  }}
                  disabled={isInCart(design.id)}
                >
                  <ShoppingBag size={14} className="mr-1.5" />
                  {isInCart(design.id) ? 'In Cart' : 'Add to Cart'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* More from this creator */}
      {moreFromCreator.length > 0 && (
        <div className="mt-12">
          <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
            More from {design.creator.display_name || design.creator.username}
            <span className="flex-1 h-px bg-[#f0f0f0]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {moreFromCreator.map((d) => {
              const cat = CATEGORY_MAP[d.category];
              return (
                <Link key={d.id} href={ROUTES.design(d.id)} className="no-underline group">
                  <div className="rounded-[10px] overflow-hidden border border-[#e8e8e8] bg-white hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all">
                    <div
                      className="h-[140px] flex items-center justify-center"
                      style={{ background: cat?.color ?? '#f0f0f0' }}
                    >
                      {d.thumbnail_url ? (
                        <img src={d.thumbnail_url} alt={d.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-[family-name:var(--font-syne)] text-[32px] font-extrabold opacity-25" style={{ color: cat?.textColor ?? '#0a0a0a' }}>
                          {d.title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-[12px] text-[#111] truncate mb-1">{d.title}</div>
                      <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold">${d.price}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Similar designs */}
      {similarDesigns.length > 0 && (
        <div className="mt-12">
          <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
            Similar Designs
            <span className="flex-1 h-px bg-[#f0f0f0]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {similarDesigns.map((d) => {
              const cat = CATEGORY_MAP[d.category];
              return (
                <Link key={d.id} href={ROUTES.design(d.id)} className="no-underline group">
                  <div className="rounded-[10px] overflow-hidden border border-[#e8e8e8] bg-white hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all">
                    <div
                      className="h-[140px] flex items-center justify-center"
                      style={{ background: cat?.color ?? '#f0f0f0' }}
                    >
                      {d.thumbnail_url ? (
                        <img src={d.thumbnail_url} alt={d.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-[family-name:var(--font-syne)] text-[32px] font-extrabold opacity-25" style={{ color: cat?.textColor ?? '#0a0a0a' }}>
                          {d.title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-[12px] text-[#111] truncate mb-1">{d.title}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold">${d.price}</span>
                        <span className="text-[10px] text-[#bbb]">@{d.creator.username}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <PaymentModal isOpen={isOpen} onClose={closePayment} paymentIntent={paymentIntent} onPurchaseComplete={recheckPurchase} />
    </div>
  );
}
