'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_MAP } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import { formatCompactNumber } from '@/lib/utils';
import type { DesignWithCreator } from '@/types/design';

const TAG_COLORS: Record<string, { bg: string; tc: string }> = {
  branding: { bg: '#ffafd9', tc: '#0a0a0a' },
  'ui-ux': { bg: '#6e87f2', tc: '#fff' },
  typography: { bg: '#e0eb3a', tc: '#0a0a0a' },
  illustration: { bg: '#f07e41', tc: '#fff' },
  motion: { bg: '#2ec66d', tc: '#fff' },
  '3d': { bg: '#d5d1ff', tc: '#0a0a0a' },
  template: { bg: '#98c7f3', tc: '#0a0a0a' },
};

const SOCIAL_LABELS: Record<string, string> = {
  twitter: '\u{1D54F}',
  instagram: 'IG',
  behance: 'B\u0113',
  dribbble: 'Dr',
  linkedin: 'in',
};

const STATUS_STYLES: Record<string, { bg: string; tc: string; label: string }> = {
  published: { bg: '#f0fdf4', tc: '#16a34a', label: 'Live' },
  draft: { bg: '#fffbeb', tc: '#d97706', label: 'Draft' },
  archived: { bg: '#fef2f2', tc: '#dc2626', label: 'Archived' },
};

export default function StudioHomePage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [designs, setDesigns] = useState<DesignWithCreator[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [designsRes, followersRes] = await Promise.all([
          supabase
            .from('designs')
            .select(`
              *,
              creator:profiles!designs_creator_id_fkey (
                id, username, display_name, avatar_url, is_verified
              )
            `)
            .eq('creator_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', user.id),
        ]);

        if (designsRes.data) {
          setDesigns(designsRes.data as unknown as DesignWithCreator[]);
        }
        setFollowerCount(followersRes.count ?? 0);
      } catch (err) {
        console.error('[StudioHome] Unexpected error:', err);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  /* Staggered card animation */
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.wc');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('wc-vis');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    cards.forEach((c, i) => {
      (c as HTMLElement).style.transitionDelay = `${(i % 4) * 0.06}s`;
      observer.observe(c);
    });
    return () => observer.disconnect();
  }, [designs.length]);

  // Derived values
  const displayName = profile?.display_name || profile?.username || 'Creator';
  const username = profile?.username || 'user';
  const skills = (profile?.skills as string[]) || [];
  const primaryColor = skills[0] ? (TAG_COLORS[skills[0]]?.bg ?? '#ffafd9') : '#ffafd9';
  const primaryTc = skills[0] ? (TAG_COLORS[skills[0]]?.tc ?? '#0a0a0a') : '#0a0a0a';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const socialLinks = profile?.social_links as Record<string, string> | null;
  const publishedCount = designs.filter((d) => d.status === 'published').length;

  return (
    <div>
      {/* Cover Banner — negative margin to go full-bleed within the padded content area */}
      <div className="-mx-8 -mt-8 mb-0 overflow-hidden">
        {profile?.cover_image_url ? (
          <div className="h-[140px] md:h-[170px] w-full overflow-hidden">
            <img
              src={profile.cover_image_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-1.5">
            {[primaryColor, '#6e87f2', '#e0eb3a', '#0a0a0a'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
        )}
      </div>

      {/* Profile Hero */}
      <div className="flex items-start gap-7 flex-wrap py-8 pb-6 border-b border-[#e8e8e8]">
        {/* Avatar */}
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-syne)] text-[30px] font-extrabold overflow-hidden"
          style={{ background: primaryColor, color: primaryTc }}
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            avatarInitial
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h1 className="font-[family-name:var(--font-syne)] text-[clamp(24px,4vw,36px)] font-extrabold tracking-[-0.03em]">
              {displayName}
            </h1>
            <Link
              href={ROUTES.dashboardSettings}
              className="flex-shrink-0 font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.06em] uppercase px-6 py-[9px] rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#0a0a0a] no-underline cursor-pointer transition-all hover:border-[#0a0a0a] mt-1"
            >
              Edit Profile
            </Link>
          </div>
          <p className="text-[13px] text-[#999] mb-3">
            @{username}.artroom
          </p>

          {/* Skills tags */}
          {skills.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {skills.map((t) => (
                <span
                  key={t}
                  className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3.5 py-[5px] rounded-full border border-[#e8e8e8] text-[#999]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-7 mb-[18px]">
            <div>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">
                {publishedCount}
              </span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">
                Works
              </span>
            </div>
            <div>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">
                {formatCompactNumber(followerCount)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">
                Followers
              </span>
            </div>
          </div>

          {/* Social Links */}
          {(() => {
            if (!socialLinks || Object.values(socialLinks).every((v) => !v))
              return null;
            return (
              <div className="flex gap-2 mt-3">
                {Object.entries(socialLinks).map(([key, value]) => {
                  if (!value) return null;
                  const href = value.startsWith('http')
                    ? value
                    : key === 'twitter'
                      ? `https://x.com/${value.replace('@', '')}`
                      : key === 'instagram'
                        ? `https://instagram.com/${value.replace('@', '')}`
                        : `https://${value}`;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-[5px] rounded-full border border-[#e8e8e8] text-[#999] no-underline hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all"
                    >
                      {SOCIAL_LABELS[key] || key}
                    </a>
                  );
                })}
              </div>
            );
          })()}

          {/* Bio */}
          {profile?.bio && (
            <p className="text-[13px] text-[#555] leading-[1.6] mt-4 max-w-[520px]">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Works Header */}
      <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] pt-7 pb-4 flex items-center gap-3.5">
        Works ({designs.length})
        <span className="flex-1 h-px bg-[#f0f0f0]" />
        <Link
          href={ROUTES.dashboardUploads}
          className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-4 py-1.5 rounded-full bg-[#0a0a0a] text-white no-underline hover:bg-[#333] transition-colors"
        >
          + Upload
        </Link>
      </div>

      {/* Designs Grid */}
      {loading ? (
        <div className="py-12 text-center text-[13px] text-[#999]">Loading...</div>
      ) : designs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-[40px] mb-3 opacity-30">🎨</div>
          <p className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
            No works yet
          </p>
          <p className="text-[12px] text-[#ccc] mb-4">
            Upload your first design to get started
          </p>
          <Link
            href={ROUTES.dashboardUploads}
            className="inline-block font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-5 py-2.5 rounded-full bg-[#0a0a0a] text-white no-underline hover:bg-[#333] transition-colors"
          >
            Upload Work
          </Link>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-16"
        >
          {designs.map((d) => {
            const cat = CATEGORY_MAP[d.category];
            const tagColor = TAG_COLORS[d.category];
            const statusStyle = STATUS_STYLES[d.status] ?? STATUS_STYLES.draft;

            return (
              <Link key={d.id} href={ROUTES.design(d.id)} className="no-underline">
                <div className="wc rounded-[10px] overflow-hidden border border-[#e8e8e8] cursor-pointer bg-white opacity-0 translate-y-3.5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:border-[#ccc] group relative">
                  {/* Thumbnail */}
                  <div
                    className="w-full flex items-center justify-center relative overflow-hidden h-[200px]"
                    style={{ background: cat?.color ?? '#f0f0f0' }}
                  >
                    {d.thumbnail_url ? (
                      <img
                        src={d.thumbnail_url}
                        alt={d.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="font-[family-name:var(--font-syne)] text-[42px] font-extrabold opacity-20"
                        style={{ color: cat?.textColor ?? '#0a0a0a' }}
                      >
                        {d.title.charAt(0).toUpperCase()}
                      </span>
                    )}

                    {/* Status badge — only show for non-published designs */}
                    {d.status !== 'published' && (
                      <span
                        className="absolute top-2 left-2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-full"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.tc,
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="px-3.5 py-3.5">
                    <div className="text-[13px] text-[#111] mb-1.5 leading-[1.3] truncate">
                      {d.title}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-syne)] text-[14px] font-bold">
                        {d.price > 0 ? `$${d.price}` : 'Free'}
                      </span>
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

          {/* Add Work card */}
          <Link href={ROUTES.dashboardUploads} className="no-underline">
            <div className="rounded-[10px] border-[1.5px] border-dashed border-[#ddd] h-full min-h-[260px] flex flex-col items-center justify-center text-[#ccc] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all bg-transparent">
              <span className="text-[28px] mb-1">+</span>
              <span className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em]">
                Add Work
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .wc-vis {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
