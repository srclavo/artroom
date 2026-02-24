'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ROUTES } from '@/constants/routes';
import { formatCompactNumber } from '@/lib/utils';

export default function StudioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  // TODO: Fetch studio from Supabase
  const studio = {
    username,
    display_name: username.charAt(0).toUpperCase() + username.slice(1) + ' Studio',
    bio: 'Creating beautiful design systems and brand identities. Available for commissions.',
    skills: ['branding', 'illustration', 'typography'],
    follower_count: 12400,
    design_count: 42,
    is_verified: true,
  };

  const stats = [
    { label: 'Works', value: studio.design_count.toString(), change: '+3 this month', isPositive: true },
    { label: 'Followers', value: formatCompactNumber(studio.follower_count), change: '+12% this week', isPositive: true },
    { label: 'Total Earned', value: '$4.8k', change: '+8% vs last month', isPositive: true },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
      >
        <ArrowLeft size={16} /> Discover
      </Link>

      {/* Profile header */}
      <div className="flex items-start gap-5 mb-8">
        <Avatar
          name={studio.display_name}
          size="lg"
          color="#E8001A"
          className="w-16 h-16 text-[24px]"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold">
              {studio.display_name}
            </h1>
            {studio.is_verified && (
              <span className="text-[#1B4FE8] text-sm">✓</span>
            )}
          </div>
          <div className="text-[12px] text-[#999] mb-2">
            @{studio.username}.artroom
          </div>
          <p className="text-[13px] text-[#666] leading-[1.6] mb-3 max-w-md">
            {studio.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {studio.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
        <Button>Follow</Button>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Works placeholder */}
      <div className="mt-8">
        <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold uppercase tracking-[0.1em] text-[#999] mb-4">
          Works
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-[10px] border border-[#e8e8e8] flex items-center justify-center bg-[#fafafa]"
            >
              <span className="text-[#ddd] text-[11px] font-[family-name:var(--font-syne)] font-bold uppercase tracking-widest">
                Work {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
