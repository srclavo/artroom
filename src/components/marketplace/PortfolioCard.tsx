'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { CATEGORY_MAP } from '@/constants/categories';
import type { Database } from '@/types/database';

type Portfolio = Database['public']['Tables']['portfolios']['Row'] & {
  creator: {
    username: string;
    display_name: string | null;
  };
};

interface PortfolioCardProps {
  portfolio: Portfolio;
  height?: number;
  onBuy?: (portfolio: Portfolio) => void;
  onHire?: (portfolio: Portfolio) => void;
}

export function PortfolioCard({ portfolio, height = 220, onBuy, onHire }: PortfolioCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const category = CATEGORY_MAP[portfolio.category ?? ''];

  return (
    <div className="break-inside-avoid mb-2.5 rounded-[10px] border border-[#ebebeb] bg-white cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] hover:border-[#ccc] group">
      {/* Thumbnail */}
      <Link href={ROUTES.portfolio(portfolio.id)} className="no-underline">
        <div
          className="relative w-full flex items-center justify-center overflow-hidden rounded-t-[10px]"
          style={{
            height: `${height}px`,
            backgroundColor: category?.color ?? '#f0f0f0',
          }}
        >
          {portfolio.thumbnail_url ? (
            <img
              src={portfolio.thumbnail_url}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/50 font-[family-name:var(--font-syne)] text-[28px] font-extrabold">
              {portfolio.title.charAt(0)}
            </span>
          )}

          {/* Action buttons */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex gap-2 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setBookmarked(!bookmarked);
              }}
              className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3.5 py-1.5 rounded-full border-none cursor-pointer bg-white text-[#0a0a0a] hover:bg-[#f0f0f0] active:scale-[0.95] transition-all"
            >
              {bookmarked ? '🔖 Saved' : 'Bookmark'}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBuy?.(portfolio);
              }}
              className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3.5 py-1.5 rounded-full border-none cursor-pointer bg-[#0a0a0a] text-white hover:bg-[#333] active:scale-[0.95] transition-all"
            >
              Buy
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="px-3 py-3 border-t border-[#f0f0f0]">
        <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#111] mb-1">
          {portfolio.title}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#bbb]">
            {portfolio.creator.username}.artroom
          </span>
          <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold">
            {portfolio.price > 0 ? formatPrice(portfolio.price) : 'Free'}
          </span>
        </div>

        {/* Hire button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onHire?.(portfolio);
          }}
          className={cn(
            'mt-2 inline-flex items-center gap-1.5',
            'font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.08em]',
            'px-2.5 py-1 rounded-full bg-[#f5f5f5] border border-[#e8e8e8] text-[#888]',
            'hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] transition-all cursor-pointer'
          )}
        >
          <span className="w-[5px] h-[5px] rounded-full bg-[#A8E63D]" />
          Hire
        </button>
      </div>
    </div>
  );
}
