'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { useProfile } from '@/hooks/useProfile';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { CATEGORY_MAP } from '@/constants/categories';
import { formatCompactNumber } from '@/lib/utils';

const TAG_COLORS: Record<string, { bg: string; tc: string }> = {
  branding: { bg: '#ffafd9', tc: '#0a0a0a' },
  'ui-ux': { bg: '#6e87f2', tc: '#fff' },
  typography: { bg: '#e0eb3a', tc: '#0a0a0a' },
  illustration: { bg: '#f07e41', tc: '#fff' },
  motion: { bg: '#2ec66d', tc: '#fff' },
  '3d': { bg: '#d5d1ff', tc: '#0a0a0a' },
  template: { bg: '#98c7f3', tc: '#0a0a0a' },
};

const TABS = ['Designs', 'Portfolios', 'About'] as const;

export default function StudioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user } = useAuth();
  const { profile, designs, portfolios, followerCount: profileFollowerCount, designCount, loading } = useProfile(username);
  const { following, followerCount, toggleFollow } = useFollow(profile?.id ?? '', user?.id);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Designs');
  const [toast, setToast] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  const displayFollowerCount = profile?.id ? followerCount : profileFollowerCount;

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
  }, [designs.length, activeTab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const handleFollow = () => {
    toggleFollow();
    const name = profile?.display_name || username;
    showToast(following ? `Unfollowed ${name}` : `Following ${name}`);
  };

  if (loading) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading studio...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
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

  const avatarInitial = (profile.display_name || username).charAt(0).toUpperCase();
  const skills = (profile.skills as string[]) || [];
  const primaryColor = skills[0] ? (TAG_COLORS[skills[0]]?.bg ?? '#f0f0f0') : '#f0f0f0';

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="px-6 py-6">
        <Link href={ROUTES.home} className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity">
          <ArrowLeft size={16} /> Discover
        </Link>
      </div>

      {/* Banner strip */}
      <div className="flex h-1.5">
        {[primaryColor, '#6e87f2', '#e0eb3a', '#0a0a0a'].map((c, i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      {/* Profile Hero */}
      <div className="flex items-start gap-7 flex-wrap px-7 py-12 pb-10 border-b border-[#e8e8e8]">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-syne)] text-[30px] font-extrabold"
          style={{ background: primaryColor, color: TAG_COLORS[skills[0]]?.tc ?? '#0a0a0a' }}
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name || username} className="w-full h-full rounded-full object-cover" />
          ) : (
            avatarInitial
          )}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="font-[family-name:var(--font-syne)] text-[clamp(24px,4vw,36px)] font-extrabold tracking-[-0.03em] mb-1">
            {profile.display_name || username}
          </h1>
          <p className="text-[13px] text-[#999] mb-3">@{profile.username}.artroom</p>

          <div className="flex gap-1.5 flex-wrap mb-4">
            {skills.map((t) => (
              <span key={t} className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3.5 py-[5px] rounded-full border border-[#e8e8e8] text-[#999]">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-7 mb-[18px]">
            <div>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{designCount}</span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Works</span>
            </div>
            <div>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{formatCompactNumber(displayFollowerCount)}</span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Followers</span>
            </div>
          </div>

          <div className="flex gap-2.5 items-center">
            <button
              onClick={handleFollow}
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
              href={ROUTES.artist(profile.username)}
              className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.06em] uppercase px-7 py-[9px] rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#0a0a0a] no-underline cursor-pointer transition-all hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
            >
              Hire {(profile.display_name || username).split(' ')[0]}
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
              Works ({designs.length})
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            {designs.length === 0 ? (
              <div className="text-center py-16 text-[#999]">
                <p className="font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#0a0a0a] mb-2">No works yet</p>
                <p className="text-[13px]">This creator hasn&apos;t published any works.</p>
              </div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {designs.map((d) => {
                  const cat = CATEGORY_MAP[d.category];
                  const tagColor = TAG_COLORS[d.category];
                  return (
                    <Link key={d.id} href={ROUTES.design(d.id)} className="no-underline">
                      <div
                        className="wc rounded-[10px] overflow-hidden border border-[#e8e8e8] cursor-pointer bg-white opacity-0 translate-y-3.5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:border-[#ccc] group relative"
                      >
                        <div
                          className="w-full flex items-center justify-center relative overflow-hidden h-[250px]"
                          style={{ background: cat?.color ?? '#f0f0f0' }}
                        >
                          {d.thumbnail_url ? (
                            <img src={d.thumbnail_url} alt={d.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-[family-name:var(--font-syne)] text-[42px] font-extrabold opacity-20" style={{ color: cat?.textColor ?? '#0a0a0a' }}>
                              {d.title.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPayment({ itemName: d.title, itemPrice: d.price, creatorUsername: d.creator.username, designId: d.id }); }}
                            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 translate-y-2 bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.08em] px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap border-none cursor-pointer"
                          >
                            Buy →
                          </button>
                        </div>
                        <div className="px-3.5 py-3.5">
                          <div className="text-[13px] text-[#111] mb-1.5 leading-[1.3]">{d.title}</div>
                          <div className="flex items-center justify-between">
                            <span className="font-[family-name:var(--font-syne)] text-[14px] font-bold">${d.price}</span>
                          </div>
                          {tagColor && (
                            <span
                              className="font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.1em] uppercase px-2.5 py-[3px] rounded-full inline-block mt-2"
                              style={{ background: tagColor.bg, color: tagColor.tc }}
                            >
                              {d.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Portfolios */}
        {activeTab === 'Portfolios' && (
          <>
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
              Portfolios ({portfolios.length})
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            {portfolios.length === 0 ? (
              <div className="text-center py-16 text-[#999]">
                <p className="font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#0a0a0a] mb-2">No portfolios yet</p>
                <p className="text-[13px]">This creator hasn&apos;t published any portfolios.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolios.map((p) => {
                  const cat = CATEGORY_MAP[p.category ?? ''];
                  return (
                    <div key={p.id} className="rounded-[10px] border border-[#e8e8e8] overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all cursor-pointer">
                      <div className="h-[180px] flex items-center justify-center" style={{ background: cat?.color ?? primaryColor }}>
                        {p.thumbnail_url ? (
                          <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-[family-name:var(--font-syne)] text-[40px] font-extrabold opacity-20" style={{ color: cat?.textColor ?? '#0a0a0a' }}>P</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-1">{p.title}</div>
                        {p.description && (
                          <p className="text-[12px] text-[#999] mb-2 line-clamp-2">{p.description}</p>
                        )}
                        <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold">${p.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* About */}
        {activeTab === 'About' && (
          <div className="max-w-[560px]">
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-4 flex items-center gap-3.5">
              About
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            <p className="text-[14px] leading-[1.8] text-[#555] mb-8">{profile.bio || 'No bio yet.'}</p>

            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-3 flex items-center gap-3.5">
              Skills
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>
            <div className="flex gap-2 flex-wrap mb-8">
              {skills.length === 0 ? (
                <span className="text-[12px] text-[#999]">No skills listed</span>
              ) : (
                skills.map((t) => (
                  <span key={t} className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.06em] uppercase px-4 py-2 rounded-full border border-[#e8e8e8] text-[#666]">
                    {t}
                  </span>
                ))
              )}
            </div>

            {profile.website_url && (
              <>
                <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] mb-3 flex items-center gap-3.5">
                  Connect
                  <span className="flex-1 h-px bg-[#f0f0f0]" />
                </div>
                <div className="flex gap-3">
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#999] hover:text-[#0a0a0a] cursor-pointer transition-colors no-underline">
                    Website
                  </a>
                </div>
              </>
            )}
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
