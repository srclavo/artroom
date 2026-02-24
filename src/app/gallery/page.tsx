'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { CATEGORIES, CATEGORY_MAP } from '@/constants/categories';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DesignItem {
  id: string;
  title: string;
  creator: string;
  creatorUsername: string;
  price: number;
  category: string;
  views: number;
  likes: number;
}

interface FeaturedPack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  creator: string;
  creatorUsername: string;
  price: number;
  category: string;
  itemCount: number;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_DESIGNS: DesignItem[] = [
  { id: 'd1', title: 'Lumis Brand Kit', creator: 'Maya Chen', creatorUsername: 'maya', price: 129, category: 'branding', views: 2400, likes: 847 },
  { id: 'd2', title: 'Stellar UI System', creator: 'James Rivera', creatorUsername: 'james', price: 199, category: 'ui-ux', views: 1800, likes: 561 },
  { id: 'd3', title: 'Neue Display', creator: 'Kira Tanaka', creatorUsername: 'kira', price: 49, category: 'typography', views: 3200, likes: 312 },
  { id: 'd4', title: 'Motion Kit Pro', creator: 'Alex Storm', creatorUsername: 'alex', price: 89, category: 'motion', views: 1100, likes: 210 },
  { id: 'd5', title: 'Coastal Illustrations', creator: 'Maya Chen', creatorUsername: 'maya', price: 59, category: 'illustration', views: 890, likes: 178 },
  { id: 'd6', title: 'Geo 3D Shapes', creator: 'Orion Vale', creatorUsername: 'orion', price: 79, category: '3d', views: 1500, likes: 345 },
  { id: 'd7', title: 'Dashboard Templates', creator: 'James Rivera', creatorUsername: 'james', price: 149, category: 'ui-ux', views: 2100, likes: 490 },
  { id: 'd8', title: 'Serif Collection', creator: 'Kira Tanaka', creatorUsername: 'kira', price: 39, category: 'typography', views: 670, likes: 98 },
  { id: 'd9', title: 'Neon Glow Pack', creator: 'Nova Kim', creatorUsername: 'nova', price: 69, category: 'illustration', views: 1350, likes: 267 },
  { id: 'd10', title: 'Abstract Patterns', creator: 'Orion Vale', creatorUsername: 'orion', price: 45, category: '3d', views: 980, likes: 156 },
  { id: 'd11', title: 'Kinetic Type Kit', creator: 'Alex Storm', creatorUsername: 'alex', price: 99, category: 'motion', views: 760, likes: 189 },
  { id: 'd12', title: 'Monoline Logo Set', creator: 'Nova Kim', creatorUsername: 'nova', price: 79, category: 'branding', views: 1420, likes: 304 },
];

const FEATURED_PACKS: FeaturedPack[] = [
  {
    id: 'fp1',
    title: 'The Brand Architect Bundle',
    subtitle: 'Everything you need for a complete brand identity.',
    description:
      'Logos, color systems, typography specs, social templates, stationery mockups, and brand guidelines -- all in one pack.',
    creator: 'Maya Chen',
    creatorUsername: 'maya',
    price: 299,
    category: 'branding',
    itemCount: 48,
  },
  {
    id: 'fp2',
    title: 'UI Starter System',
    subtitle: 'Ship faster with a production-ready design system.',
    description:
      '200+ components, dark mode variants, responsive layouts, and Figma tokens ready for handoff.',
    creator: 'James Rivera',
    creatorUsername: 'james',
    price: 249,
    category: 'ui-ux',
    itemCount: 200,
  },
];

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
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  /* Filtered + sorted designs */
  const designs = useMemo(() => {
    let list =
      activeCategory === 'all'
        ? [...MOCK_DESIGNS]
        : MOCK_DESIGNS.filter((d) => d.category === activeCategory);

    switch (sortBy) {
      case 'popular':
        list.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
        list.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
    }

    return list;
  }, [activeCategory, sortBy]);

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

        {/* ── Featured Packs ────────────────────────────────────── */}
        <section className="px-7 pb-10">
          <h2 className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold tracking-[-0.01em] mb-5">
            Featured Packs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURED_PACKS.map((pack) => {
              const catMeta = CATEGORY_MAP[pack.category];
              return (
                <div
                  key={pack.id}
                  className="group grid grid-cols-[1fr_1fr] border border-[#e8e8e8] rounded-[14px] overflow-hidden bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                >
                  {/* Left: Image area */}
                  <div
                    className="flex items-center justify-center min-h-[220px] relative"
                    style={{ backgroundColor: catMeta?.color ?? '#f0f0f0' }}
                  >
                    <span
                      className="font-[family-name:var(--font-syne)] text-[64px] font-extrabold opacity-20 select-none"
                      style={{ color: catMeta?.textColor ?? '#0a0a0a' }}
                    >
                      {pack.title.charAt(0)}
                    </span>
                    <div
                      className="absolute top-3 left-3 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        color: '#0a0a0a',
                      }}
                    >
                      {pack.itemCount} items
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <div
                        className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-[3px] rounded-full inline-block mb-3"
                        style={{
                          backgroundColor: catMeta?.color ?? '#f0f0f0',
                          color: catMeta?.textColor ?? '#0a0a0a',
                        }}
                      >
                        {catMeta?.label ?? pack.category}
                      </div>
                      <h3 className="font-[family-name:var(--font-syne)] text-[16px] font-bold leading-[1.25] mb-1.5">
                        {pack.title}
                      </h3>
                      <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#888] leading-[1.6] mb-1">
                        {pack.subtitle}
                      </p>
                      <p className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#aaa] leading-[1.6] hidden lg:block">
                        {pack.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold text-[#0a0a0a]">
                          ${pack.price}
                        </span>
                        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#bbb] ml-1.5">
                          by @{pack.creatorUsername}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          openPayment({
                            itemName: pack.title,
                            itemPrice: pack.price,
                            creatorUsername: pack.creatorUsername,
                            designId: pack.id,
                          })
                        }
                        className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.05em] bg-[#0a0a0a] text-white px-4 py-2 rounded-full border-none cursor-pointer hover:bg-[#333] transition-colors"
                      >
                        Buy Pack
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── All Designs grid ──────────────────────────────────── */}
        <section className="px-7 pb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold tracking-[-0.01em] mb-5">
            {activeCategory === 'all'
              ? 'All Designs'
              : GALLERY_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? 'Designs'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {designs.map((item) => {
              const catMeta = CATEGORY_MAP[item.category];
              return (
                <div
                  key={item.id}
                  className="group relative border border-[#e8e8e8] rounded-[12px] overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
                >
                  {/* Thumbnail area */}
                  <div
                    className="relative w-full aspect-[4/3] flex items-center justify-center"
                    style={{ backgroundColor: catMeta?.color ?? '#f0f0f0' }}
                  >
                    <span
                      className="font-[family-name:var(--font-syne)] text-[48px] font-extrabold opacity-15 select-none"
                      style={{ color: catMeta?.textColor ?? '#0a0a0a' }}
                    >
                      {item.title.charAt(0)}
                    </span>

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
                      onClick={() =>
                        openPayment({
                          itemName: item.title,
                          itemPrice: item.price,
                          creatorUsername: item.creatorUsername,
                          designId: item.id,
                        })
                      }
                      className="absolute bottom-3 right-3 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.04em] bg-[#0a0a0a] text-white px-4 py-2 rounded-full border-none cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#333]"
                    >
                      Buy ${item.price}
                    </button>
                  </div>

                  {/* Card info */}
                  <div className="p-3.5">
                    <h3 className="font-[family-name:var(--font-syne)] text-[13px] font-bold leading-[1.3] mb-1 truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#aaa]">
                        {item.creator}
                      </span>
                      <span className="font-[family-name:var(--font-syne)] text-[13px] font-extrabold text-[#0a0a0a]">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {designs.length === 0 && (
            <div className="text-center py-16">
              <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#bbb]">
                No designs found in this category.
              </p>
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
