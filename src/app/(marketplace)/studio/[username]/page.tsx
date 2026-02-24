'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { ROUTES } from '@/constants/routes';

const STUDIOS = [
  { av: 'M', avBg: '#FFB3C6', avTc: '#0a0a0a', name: 'Maya Chen', username: 'maya', tags: ['Branding', 'Identity'], works: 42, followers: '12k', earned: '$4.8k', bannerColors: ['#FFB3C6', '#1B4FE8', '#FFE500', '#0a0a0a'], bio: 'Creative director and brand designer based in Brooklyn. Specializing in visual identity systems for tech companies and cultural institutions. Currently open to freelance work and long-term collaborations.' },
  { av: 'J', avBg: '#1B4FE8', avTc: '#fff', name: 'James Park', username: 'james', tags: ['UI / UX', 'Systems'], works: 61, followers: '3.4k', earned: '$8.2k', bannerColors: ['#1B4FE8', '#00A896', '#0D1B4B', '#1B4FE8'], bio: 'Product designer building design systems and interfaces for SaaS companies. Passionate about component architecture and scalable design.' },
  { av: 'K', avBg: '#FF5F1F', avTc: '#fff', name: 'Kai Dubois', username: 'kai', tags: ['Illustration', 'Editorial'], works: 55, followers: '4.2k', earned: '$3.1k', bannerColors: ['#FF5F1F', '#FFB3C6', '#FFE500', '#0a0a0a'], bio: 'Illustrator working at the intersection of editorial design and digital art. Available for commissions.' },
  { av: 'T', avBg: '#FFE500', avTc: '#0a0a0a', name: 'Theo Muller', username: 'theo', tags: ['Typography', 'Print'], works: 34, followers: '1.8k', earned: '$2.4k', bannerColors: ['#FFE500', '#f5f0d0', '#E8001A', '#0a0a0a'], bio: 'Type designer and typographer focused on display faces and experimental letterforms.' },
  { av: 'S', avBg: '#7B3FA0', avTc: '#fff', name: 'Seb Laurent', username: 'seb', tags: ['3D', 'Render'], works: 29, followers: '1.6k', earned: '$5.1k', bannerColors: ['#7B3FA0', '#0D1B4B', '#C8375B', '#7B3FA0'], bio: '3D artist creating abstract renders and surreal digital landscapes.' },
  { av: 'R', avBg: '#E8001A', avTc: '#fff', name: 'Rin Nakamura', username: 'rin', tags: ['Motion', '3D'], works: 37, followers: '2.7k', earned: '$3.9k', bannerColors: ['#E8001A', '#A8E63D', '#FF5F1F', '#1A7A3C'], bio: 'Motion designer creating dynamic visual narratives and experimental animations.' },
];

const DESIGNS = [
  { color: '#FFB3C6', tc: '#0a0a0a', label: 'a soft system', by: 'maya', tag: 'brand', price: 79, h: 270 },
  { color: '#1A7A3C', tc: '#fff', label: 'deep roots', by: 'maya', tag: 'brand', price: 89, h: 340 },
  { color: '#5EEAD4', tc: '#0a0a0a', label: 'tidal system', by: 'maya', tag: 'brand', price: 99, h: 250 },
  { color: '#1B4FE8', tc: '#fff', label: 'dashboard v3', by: 'james', tag: 'ui', price: 129, h: 255 },
  { color: '#0D1B4B', tc: '#fff', label: 'night shift', by: 'james', tag: 'motion', price: 109, h: 350 },
  { color: '#A8E63D', tc: '#0a0a0a', label: 'growth data', by: 'james', tag: 'ui', price: 99, h: 275 },
  { color: '#FF5F1F', tc: '#fff', label: 'heat index', by: 'kai', tag: 'illus', price: 39, h: 320 },
  { color: '#C8375B', tc: '#fff', label: 'cut & fold', by: 'kai', tag: 'illus', price: 44, h: 230 },
  { color: '#FDE68A', tc: '#0a0a0a', label: 'golden hour', by: 'kai', tag: 'illus', price: 29, h: 190 },
  { color: '#FFE500', tc: '#0a0a0a', label: 'forma type', by: 'theo', tag: 'type', price: 49, h: 300 },
  { color: '#E8D5B0', tc: '#0a0a0a', label: 'warm logic', by: 'theo', tag: 'type', price: 89, h: 285 },
  { color: '#7B3FA0', tc: '#fff', label: 'inner world', by: 'seb', tag: '3d', price: 149, h: 240 },
  { color: '#2E2E2E', tc: '#fff', label: 'void state', by: 'seb', tag: '3d', price: 149, h: 260 },
  { color: '#E8001A', tc: '#fff', label: 'signal work', by: 'rin', tag: 'motion', price: 59, h: 220 },
];

const TAG_COLORS: Record<string, { bg: string; tc: string }> = {
  brand: { bg: '#FFB3C6', tc: '#0a0a0a' },
  ui: { bg: '#1B4FE8', tc: '#fff' },
  type: { bg: '#FFE500', tc: '#0a0a0a' },
  illus: { bg: '#FF5F1F', tc: '#fff' },
  motion: { bg: '#1A7A3C', tc: '#fff' },
  '3d': { bg: '#7B3FA0', tc: '#fff' },
};

const TABS = ['Designs', 'Portfolios', 'About'] as const;

export default function StudioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const studio = STUDIOS.find((s) => s.username === username);
  const works = studio ? DESIGNS.filter((d) => d.by === studio.username) : [];
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Designs');
  const [following, setFollowing] = useState(false);
  const [toast, setToast] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  useEffect(() => {
    if (!gridRef.current || activeTab !== 'Designs') return;
    const cards = gridRef.current.querySelectorAll('.wc');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('wc-vis'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    cards.forEach((c, i) => {
      (c as HTMLElement).style.transitionDelay = `${(i % 4) * 0.06}s`;
      observer.observe(c);
    });
    return () => observer.disconnect();
  }, [works.length, activeTab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const toggleFollow = () => {
    setFollowing((f) => {
      showToast(!f ? `Following ${studio?.name}` : `Unfollowed ${studio?.name}`);
      return !f;
    });
  };

  if (!studio) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <Link href={ROUTES.home} className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6">
          <ArrowLeft size={16} /> Discover
        </Link>
        <div className="text-center py-20">
          <h1 className="font-[family-name:var(--font-syne)] text-[18px] font-bold mb-2">Studio not found</h1>
          <p className="text-[13px] text-[#999]">This profile doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="px-6 py-6">
        <Link href={ROUTES.home} className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity">
          <ArrowLeft size={16} /> Discover
        </Link>
      </div>

      {/* Banner strip */}
      <div className="flex h-1.5">
        {studio.bannerColors.map((c, i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      {/* Profile Hero */}
      <div className="flex items-start gap-7 flex-wrap px-7 py-12 pb-10 border-b border-[#e8e8e8]">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-syne)] text-[30px] font-extrabold"
          style={{ background: studio.avBg, color: studio.avTc }}
        >
          {studio.av}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="font-[family-name:var(--font-syne)] text-[clamp(24px,4vw,36px)] font-extrabold tracking-[-0.03em] mb-1">
            {studio.name}
          </h1>
          <p className="text-[13px] text-[#999] mb-3">@{studio.username}.artroom</p>

          <div className="flex gap-1.5 flex-wrap mb-4">
            {studio.tags.map((t) => (
              <span key={t} className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3.5 py-[5px] rounded-full border border-[#e8e8e8] text-[#999]">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-7 mb-[18px]">
            <div>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{studio.works}</span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Works</span>
            </div>
            <div>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{studio.followers}</span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Followers</span>
            </div>
            <div>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{studio.earned}</span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Earned</span>
            </div>
          </div>

          <div className="flex gap-2.5 items-center">
            <button
              onClick={toggleFollow}
              className={cn(
                'font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.06em] uppercase px-7 py-[9px] rounded-full border-[1.5px] cursor-pointer transition-all',
                following
                  ? 'bg-white text-[#0a0a0a] border-[#e8e8e8] hover:border-[#0a0a0a]'
                  : 'bg-[#0a0a0a] text-white border-[#0a0a0a] hover:opacity-85'
              )}
            >
              {following ? 'Following' : 'Follow'}
            </button>
            <Link
              href={ROUTES.artist(studio.username)}
              className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.06em] uppercase px-7 py-[9px] rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#0a0a0a] no-underline cursor-pointer transition-all hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
            >
              Hire {studio.name.split(' ')[0]}
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#e8e8e8] px-7">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-5 py-3.5 border-b-[2px] cursor-pointer bg-transparent transition-all',
              activeTab === tab
                ? 'border-[#0a0a0a] text-[#0a0a0a]'
                : 'border-transparent text-[#bbb] hover:text-[#999]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-7 py-7 pb-16">
        {/* Designs */}
        {activeTab === 'Designs' && (
          <>
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
              Works ({works.length})
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            {works.length === 0 ? (
              <div className="text-center py-16 text-[#999]">
                <p className="font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#0a0a0a] mb-2">No works yet</p>
                <p className="text-[13px]">This creator hasn&apos;t published any works.</p>
              </div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {works.map((d, i) => (
                  <div
                    key={i}
                    className="wc rounded-[10px] overflow-hidden border border-[#e8e8e8] cursor-pointer bg-white opacity-0 translate-y-3.5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:border-[#ccc] group relative"
                    onClick={() => openPayment({ itemName: d.label, itemPrice: d.price, creatorUsername: studio.username })}
                  >
                    <div
                      className="w-full flex items-center justify-center relative overflow-hidden"
                      style={{ height: d.h, background: d.color }}
                    >
                      <span className="font-[family-name:var(--font-syne)] text-[42px] font-extrabold opacity-20" style={{ color: d.tc }}>
                        {d.label.charAt(0).toUpperCase()}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); openPayment({ itemName: d.label, itemPrice: d.price, creatorUsername: studio.username }); }}
                        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 translate-y-2 bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.08em] px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap border-none cursor-pointer"
                      >
                        Buy →
                      </button>
                    </div>
                    <div className="px-3.5 py-3.5">
                      <div className="text-[13px] text-[#111] mb-1.5 leading-[1.3]">{d.label}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-syne)] text-[14px] font-bold">${d.price}</span>
                      </div>
                      <span
                        className="font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.1em] uppercase px-2.5 py-[3px] rounded-full inline-block mt-2"
                        style={{ background: TAG_COLORS[d.tag]?.bg || '#eee', color: TAG_COLORS[d.tag]?.tc || '#000' }}
                      >
                        {d.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Portfolios */}
        {activeTab === 'Portfolios' && (
          <>
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
              Portfolios
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[10px] border border-[#e8e8e8] overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all cursor-pointer">
                <div className="h-[180px] flex items-center justify-center" style={{ background: studio.avBg }}>
                  <span className="font-[family-name:var(--font-syne)] text-[40px] font-extrabold opacity-20" style={{ color: studio.avTc }}>P</span>
                </div>
                <div className="p-4">
                  <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-1">Selected Work 2024</div>
                  <p className="text-[12px] text-[#999] mb-2 line-clamp-2">A curated collection of the best projects from this year.</p>
                  <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold">$199</div>
                </div>
              </div>
              <div className="rounded-[10px] border border-[#e8e8e8] overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all cursor-pointer">
                <div className="h-[180px] flex items-center justify-center" style={{ background: studio.bannerColors[1] || '#f0f0f0' }}>
                  <span className="font-[family-name:var(--font-syne)] text-[40px] font-extrabold opacity-20 text-white">P</span>
                </div>
                <div className="p-4">
                  <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-1">Brand Systems Pack</div>
                  <p className="text-[12px] text-[#999] mb-2 line-clamp-2">Complete brand guidelines and asset library for digital brands.</p>
                  <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold">$149</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* About */}
        {activeTab === 'About' && (
          <div className="max-w-[560px]">
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
              About
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            <p className="text-[14px] leading-[1.8] text-[#555] mb-8">{studio.bio}</p>

            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-3 flex items-center gap-3.5">
              Skills
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            <div className="flex gap-2 flex-wrap mb-8">
              {studio.tags.map((t) => (
                <span key={t} className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.06em] uppercase px-4 py-2 rounded-full border border-[#e8e8e8] text-[#666]">
                  {t}
                </span>
              ))}
            </div>

            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-3 flex items-center gap-3.5">
              Connect
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            <div className="flex gap-3">
              {['Twitter', 'Instagram', 'Dribbble'].map((s) => (
                <span key={s} className="text-[11px] text-[#999] hover:text-[#0a0a0a] cursor-pointer transition-colors">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={cn(
        'fixed bottom-7 right-7 z-[600] bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[12px] font-bold px-6 py-3 rounded-full transition-all duration-300 pointer-events-none',
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
      )}>
        {toast}
      </div>

      <PaymentModal isOpen={isOpen} onClose={closePayment} paymentIntent={paymentIntent} />

      <style jsx>{`
        .wc-vis { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </div>
  );
}
