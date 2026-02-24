'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import type { StudioProfile } from '@/types/user';
import { CATEGORY_MAP } from '@/constants/categories';

interface StudioCardProps {
  studio: StudioProfile;
}

export function StudioCard({ studio }: StudioCardProps) {
  const [following, setFollowing] = useState(false);

  return (
    <Link
      href={ROUTES.studio(studio.username)}
      className="no-underline block rounded-[12px] border border-[#ebebeb] bg-white cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:border-[#ccc] group"
    >
      {/* Banner */}
      <div className="h-[90px] grid grid-cols-2 gap-0.5 overflow-hidden rounded-t-[12px]">
        <div className="bg-[#FFB3C6] flex items-center justify-center">
          <span className="text-white/40 font-[family-name:var(--font-syne)] text-[32px] font-extrabold transition-transform duration-300 group-hover:scale-[1.08]">
            {studio.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="bg-[#1B4FE8] flex items-center justify-center">
          <span className="text-white/40 font-[family-name:var(--font-syne)] text-[32px] font-extrabold transition-transform duration-300 group-hover:scale-[1.08]">
            ✦
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 pb-4 pt-0">
        {/* Avatar row */}
        <div className="flex items-end gap-2.5 -mt-8 mb-2.5">
          <Avatar
            name={studio.display_name ?? studio.username}
            src={studio.avatar_url}
            size="lg"
            className="border-[3px] border-white relative z-[1]"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFollowing(!following);
            }}
            className={cn(
              'ml-auto font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em]',
              'px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-200',
              following
                ? 'bg-[#0a0a0a] text-white border-[1.5px] border-[#0a0a0a]'
                : 'bg-white text-[#0a0a0a] border-[1.5px] border-[#e0e0e0] hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a]'
            )}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Name */}
        <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#111] mb-0.5">
          {studio.display_name ?? studio.username}
        </div>
        <div className="text-[11px] text-[#bbb] mb-2">
          {studio.username}.artroom
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {studio.skills.slice(0, 3).map((skill) => {
            const cat = CATEGORY_MAP[skill];
            return (
              <Badge
                key={skill}
                color={cat?.color ?? '#f5f5f5'}
                textColor={cat?.textColor ?? '#0a0a0a'}
              >
                {cat?.label ?? skill}
              </Badge>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex gap-4 border-t border-[#f0f0f0] pt-2.5">
          <div className="text-[11px] text-[#bbb]">
            <strong className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#0a0a0a]">
              {studio.design_count}
            </strong>{' '}
            works
          </div>
          <div className="text-[11px] text-[#bbb]">
            <strong className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#0a0a0a]">
              {formatCompactNumber(studio.follower_count)}
            </strong>{' '}
            followers
          </div>
        </div>
      </div>
    </Link>
  );
}
