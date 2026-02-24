'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // TODO: Fetch portfolio from Supabase
  const portfolio = {
    id,
    title: 'Fintech App Redesign',
    description:
      'A comprehensive mobile app redesign for a fintech startup, including user research, wireframes, high-fidelity mockups, and a complete design system with 80+ components.',
    price: 89,
    category: 'ui-ux',
    tags: ['fintech', 'app', 'redesign', 'mobile'],
    view_count: 340,
    creator: {
      username: 'maya',
      display_name: 'Maya Chen',
      avatar_url: null,
    },
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Preview */}
      <div className="rounded-[12px] border border-[#e8e8e8] overflow-hidden mb-6">
        <div className="h-[400px] bg-[#1B4FE8] flex items-center justify-center">
          <span className="text-white/30 font-[family-name:var(--font-syne)] text-[64px] font-extrabold">
            {portfolio.title.charAt(0)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-[24px] font-bold mb-3">
            {portfolio.title}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <Avatar
              name={portfolio.creator.display_name ?? portfolio.creator.username}
              src={portfolio.creator.avatar_url}
              size="md"
              color="#E8001A"
            />
            <div>
              <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
                {portfolio.creator.display_name}
              </div>
              <div className="text-[11px] text-[#bbb]">
                {portfolio.creator.username}.artroom
              </div>
            </div>
          </div>

          <p className="text-[14px] leading-[1.75] text-[#555] mb-4">
            {portfolio.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {portfolio.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="border border-[#e8e8e8] rounded-[12px] p-5 h-fit sticky top-20">
          <div className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold mb-4">
            ${portfolio.price}
          </div>
          <Button className="w-full mb-2" size="lg">
            Buy Template →
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Bookmark
          </Button>
          <div className="mt-4 pt-4 border-t border-[#f0f0f0] text-[11px] text-[#999]">
            {portfolio.view_count} views
          </div>
        </div>
      </div>
    </div>
  );
}
