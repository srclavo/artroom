'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { CATEGORIES, CATEGORY_MAP } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import { createClient } from '@/lib/supabase/client';
import type { DesignWithCreator } from '@/types/design';

/* ------------------------------------------------------------------ */
/*  Filter pills (category tabs)                                       */
/* ------------------------------------------------------------------ */

const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Designs' },
  ...CATEGORIES.filter((c) =>
    ['branding', 'ui-ux', 'typography', 'illustration', 'motion', '3d'].includes(c.id)
  ),
];

/* ------------------------------------------------------------------ */
/*  Sort options                                                       */
/* ------------------------------------------------------------------ */

type SortKey = 'popular' | 'newest' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low\u2013High' },
  { value: 'price-desc', label: 'Price: High\u2013Low' },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [designs, setDesigns] = useState<DesignWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();
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
      .eq('status', 'published');

    if (activeCategory !== 'all') {
      query = query.eq('category', activeCategory);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        query = query.order('like_count', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
    }

    query = query.limit(40);

    const { data } = await query;
    setDesigns((data as unknown as DesignWithCreator[]) ?? []);
    setLoading(false);
  }, [activeCategory, sortBy, supabase]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return (
    <>
      <Navbar />

      <main className="page-content">
        {/* ── Back link ─────────────────────────────────────────── */}
        <div className="px-7 pt-8 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity"
          >
            &larr; Discover
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="px-7 pt-4 pb-8 max-w-3xl">
          <h1 className="font-[family-name:var(--font-syne)] text-[clamp(28px,5vw,44px)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-3">
            Explore the Gallery
          </h1>
          <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.7] text-[#777] max-w-[540px]">
            Curated design assets from independent creators around the world.
            Find brand kits, UI systems, type families, illustrations, motion
            packs and more.
          </p>
        </section>

        {/* ── Filter bar ────────────────────────────────────────── */}
        <div className="px-7 pb-6 flex flex-wrap items-center gap-3">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const catMeta = CATEGORY_MAP[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.04em] px-4 py-[7px] rounded-full border cursor-pointer transition-all duration-200 whitespace-nowrap"
                  style={
                    isActive && catMeta
                      ? {
                          backgroundColor: catMeta.color,
                          color: catMeta.textColor,
                          borderColor: catMeta.color,
                        }
                      : isActive
                        ? {
                            backgroundColor: '#0a0a0a',
                            color: '#fff',
                            borderColor: '#0a0a0a',
                          }
                        : {
                            backgroundColor: 'transparent',
                            color: '#999',
                            borderColor: '#e8e8e8',
                          }
                  }
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#555] bg-white border border-[#e8e8e8] rounded-full px-4 py-[7px] outline-none cursor-pointer hover:border-[#ccc] transition-colors appearance-none pr-8"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%23999\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── All Designs grid ──────────────────────────────────── */}
        <section className="px-7 pb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold tracking-[-0.01em] mb-5">
            {activeCategory === 'all'
              ? 'All Designs'
              : GALLERY_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? 'Designs'}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-[#e8e8e8] rounded-[12px] overflow-hidden bg-white">
                  <div className="w-full aspect-[4/3] bg-[#f5f5f5] animate-pulse" />
                  <div className="p-3.5">
                    <div className="h-4 bg-[#f0f0f0] rounded mb-2 w-3/4 animate-pulse" />
                    <div className="h-3 bg-[#f5f5f5] rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {designs.map((item) => {
                const catMeta = CATEGORY_MAP[item.category];
                return (
                  <Link
                    key={item.id}
                    href={ROUTES.design(item.id)}
                    className="group relative border border-[#e8e8e8] rounded-[12px] overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] no-underline"
                  >
                    {/* Thumbnail area */}
                    <div
                      className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: catMeta?.color ?? '#f0f0f0' }}
                    >
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="font-[family-name:var(--font-syne)] text-[48px] font-extrabold opacity-15 select-none"
                          style={{ color: catMeta?.textColor ?? '#0a0a0a' }}
                        >
                          {item.title.charAt(0)}
                        </span>
                      )}

                      {/* Category tag */}
                      <div
                        className="absolute top-2.5 left-2.5 font-[family-name:var(--font-syne)] text-[8px] font-bold uppercase tracking-[0.06em] px-2 py-[3px] rounded-full"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.85)',
                          color: '#0a0a0a',
                        }}
                      >
                        {catMeta?.label ?? item.category}
                      </div>

                      {/* Buy button (hover) */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openPayment({
                            itemName: item.title,
                            itemPrice: item.price,
                            creatorUsername: item.creator?.username ?? 'creator',
                            designId: item.id,
                          });
                        }}
                        className="absolute bottom-3 right-3 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.04em] bg-[#0a0a0a] text-white px-4 py-2 rounded-full border-none cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#333]"
                      >
                        Buy ${item.price}
                      </button>
                    </div>

                    {/* Card info */}
                    <div className="p-3.5">
                      <h3 className="font-[family-name:var(--font-syne)] text-[13px] font-bold leading-[1.3] mb-1 truncate text-[#0a0a0a]">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#aaa]">
                          {item.creator?.display_name ?? item.creator?.username ?? 'Unknown'}
                        </span>
                        <span className="font-[family-name:var(--font-syne)] text-[13px] font-extrabold text-[#0a0a0a]">
                          {item.price > 0 ? `$${item.price}` : 'Free'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && designs.length === 0 && (
            <div className="text-center py-16">
              <div className="font-[family-name:var(--font-syne)] text-[48px] mb-4 opacity-20">🎨</div>
              <p className="font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#bbb] mb-2">
                No designs yet
              </p>
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#ccc]">
                Be the first to publish in this category!
              </p>
              <Link
                href={ROUTES.dashboardUploads}
                className="inline-block mt-4 font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.04em] bg-[#0a0a0a] text-white px-6 py-2.5 rounded-full no-underline hover:bg-[#333] transition-colors"
              >
                Upload a Design
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <PaymentModal
        isOpen={isOpen}
        onClose={closePayment}
        paymentIntent={paymentIntent}
      />
    </>
  );
}
