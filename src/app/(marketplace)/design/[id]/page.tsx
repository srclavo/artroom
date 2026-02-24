'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CATEGORY_MAP } from '@/constants/categories';
import { formatCompactNumber } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

export default function DesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // TODO: Fetch design from Supabase
  const design = {
    id,
    title: 'Lumis Brand Kit',
    description:
      'A complete brand identity system with logos, color palettes, typography guidelines, social media templates, and stationery designs. Perfect for startups and creative agencies looking for a polished, modern brand foundation.',
    price: 129,
    category: 'branding',
    tags: ['brand', 'identity', 'logo', 'systems'],
    view_count: 2400,
    like_count: 847,
    download_count: 180,
    creator: {
      username: 'maya',
      display_name: 'Maya Chen',
      avatar_url: null,
    },
  };

  const category = CATEGORY_MAP[design.category];

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
          <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-[#f0f0f0]">
            <Avatar
              name={design.creator.display_name ?? design.creator.username}
              src={design.creator.avatar_url}
              size="md"
              color="#E8001A"
            />
            <div>
              <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
                {design.creator.display_name}
              </div>
              <div className="text-[11px] text-[#bbb]">
                @{design.creator.username}.artroom
              </div>
            </div>
            <Button variant="primary" size="sm" className="ml-auto">
              Follow
            </Button>
          </div>

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
            <Button className="w-full" size="lg">
              Buy for ${design.price} →
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Save to Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
