'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { CATEGORY_MAP } from '@/constants/categories';
import { formatCompactNumber } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const MOCK_DESIGNS = [
  { id: 'd1', title: 'Lumis Brand Kit', price: 129, category: 'branding', tags: ['brand', 'identity', 'logo', 'systems'], view_count: 2400, like_count: 847, download_count: 180, creator: { username: 'maya', display_name: 'Maya Chen', avatar_color: '#FFB3C6' }, description: 'A complete brand identity system with logos, color palettes, typography guidelines, social media templates, and stationery designs. Perfect for startups and creative agencies looking for a polished, modern brand foundation.' },
  { id: 'd2', title: 'Dashboard v3', price: 89, category: 'ui-ux', tags: ['ui', 'dashboard', 'saas'], view_count: 1800, like_count: 520, download_count: 95, creator: { username: 'james', display_name: 'James Park', avatar_color: '#1B4FE8' }, description: 'A modern SaaS dashboard template with data visualization components, dark mode support, and responsive layouts.' },
  { id: 'd3', title: 'Forma Type', price: 49, category: 'typography', tags: ['type', 'font', 'display'], view_count: 3100, like_count: 1120, download_count: 340, creator: { username: 'theo', display_name: 'Theo Muller', avatar_color: '#FFE500' }, description: 'A geometric display typeface with 6 weights, ideal for headlines, posters, and brand typography.' },
  { id: 'd4', title: 'Signal Work', price: 59, category: 'motion', tags: ['motion', 'animation', 'loop'], view_count: 980, like_count: 310, download_count: 60, creator: { username: 'rin', display_name: 'Rin Nakamura', avatar_color: '#E8001A' }, description: 'Animated signal processing visualizations — perfect for music, tech, and data-driven brand content.' },
  { id: 'd5', title: 'Heat Index', price: 39, category: 'illustration', tags: ['illustration', 'editorial', 'color'], view_count: 1400, like_count: 690, download_count: 150, creator: { username: 'kai', display_name: 'Kai Dubois', avatar_color: '#FF5F1F' }, description: 'A vibrant set of editorial illustrations exploring themes of warmth, energy, and data.' },
  { id: 'd6', title: 'Inner World', price: 149, category: '3d', tags: ['3d', 'render', 'abstract'], view_count: 750, like_count: 280, download_count: 40, creator: { username: 'seb', display_name: 'Seb Laurent', avatar_color: '#7B3FA0' }, description: 'Abstract 3D renders exploring inner landscapes and surreal geometry. High resolution files included.' },
  { id: 'd7', title: 'Deep Roots', price: 89, category: 'branding', tags: ['brand', 'nature', 'identity'], view_count: 1200, like_count: 430, download_count: 85, creator: { username: 'maya', display_name: 'Maya Chen', avatar_color: '#FFB3C6' }, description: 'Nature-inspired brand identity with organic forms, earth tones, and sustainable design principles.' },
  { id: 'd8', title: 'Tidal System', price: 99, category: 'branding', tags: ['brand', 'system', 'ocean'], view_count: 890, like_count: 360, download_count: 70, creator: { username: 'maya', display_name: 'Maya Chen', avatar_color: '#FFB3C6' }, description: 'A fluid brand system inspired by ocean patterns and tidal rhythms.' },
  { id: 'd9', title: 'Coastal Drift', price: 69, category: 'branding', tags: ['brand', 'coastal', 'minimal'], view_count: 670, like_count: 240, download_count: 55, creator: { username: 'lara', display_name: 'Lara Voss', avatar_color: '#00A896' }, description: 'Minimalist coastal branding with clean lines and ocean-inspired palette.' },
  { id: 'd10', title: 'Night Shift', price: 109, category: 'motion', tags: ['motion', 'dark', 'loop'], view_count: 1560, like_count: 590, download_count: 120, creator: { username: 'arc', display_name: 'Arc Studio', avatar_color: '#0D1B4B' }, description: 'Dark mode motion graphics kit for nocturnal brand storytelling.' },
  { id: 'd11', title: 'Growth Data', price: 99, category: 'ui-ux', tags: ['ui', 'charts', 'data'], view_count: 1100, like_count: 400, download_count: 90, creator: { username: 'noa', display_name: 'Noa Becker', avatar_color: '#A8E63D' }, description: 'Data visualization UI components for growth dashboards and analytics.' },
  { id: 'd12', title: 'Void State', price: 149, category: '3d', tags: ['3d', 'abstract', 'dark'], view_count: 640, like_count: 220, download_count: 30, creator: { username: 'seb', display_name: 'Seb Laurent', avatar_color: '#7B3FA0' }, description: 'Stark, abstract 3D compositions exploring emptiness and negative space.' },
];

export default function DesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  const design = MOCK_DESIGNS.find((d) => d.id === id) || MOCK_DESIGNS[0];
  const category = CATEGORY_MAP[design.category];

  const moreFromCreator = MOCK_DESIGNS.filter(
    (d) => d.creator.username === design.creator.username && d.id !== design.id
  ).slice(0, 4);

  const similarDesigns = MOCK_DESIGNS.filter(
    (d) => d.category === design.category && d.id !== design.id
  ).slice(0, 4);

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
          <span
            className="font-[family-name:var(--font-syne)] text-[72px] font-extrabold opacity-30"
            style={{ color: category?.textColor ?? '#0a0a0a' }}
          >
            {design.title.charAt(0)}
          </span>
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
              name={design.creator.display_name}
              size="md"
              color={design.creator.avatar_color}
            />
            <div>
              <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a]">
                {design.creator.display_name}
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
            {design.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-5 mb-5 pb-4 border-b border-[#f0f0f0]">
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {formatCompactNumber(design.view_count)}
              </strong>
              views
            </div>
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {formatCompactNumber(design.like_count)}
              </strong>
              likes
            </div>
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {formatCompactNumber(design.download_count)}
              </strong>
              downloads
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            <Button className="w-full" size="lg" onClick={handleBuy}>
              Buy for ${design.price} →
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Save to Library
            </Button>
          </div>
        </div>
      </div>

      {/* More from this creator */}
      {moreFromCreator.length > 0 && (
        <div className="mt-12">
          <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
            More from {design.creator.display_name}
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
                      <span className="font-[family-name:var(--font-syne)] text-[32px] font-extrabold opacity-25" style={{ color: cat?.textColor ?? '#0a0a0a' }}>
                        {d.title.charAt(0)}
                      </span>
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
                      <span className="font-[family-name:var(--font-syne)] text-[32px] font-extrabold opacity-25" style={{ color: cat?.textColor ?? '#0a0a0a' }}>
                        {d.title.charAt(0)}
                      </span>
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

      <PaymentModal isOpen={isOpen} onClose={closePayment} paymentIntent={paymentIntent} />
    </div>
  );
}
