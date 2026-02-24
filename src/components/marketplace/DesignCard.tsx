'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DesignWithCreator } from '@/types/design';
import { CATEGORY_MAP } from '@/constants/categories';

interface DesignCardProps {
  design: DesignWithCreator;
  height?: number;
  onOpen?: (design: DesignWithCreator) => void;
  onBuy?: (design: DesignWithCreator) => void;
}

export function DesignCard({ design, height = 220, onOpen, onBuy }: DesignCardProps) {
  const [liked, setLiked] = useState(false);
  const category = CATEGORY_MAP[design.category];

  return (
    <div
      className="break-inside-avoid mb-2.5 rounded-[6px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-[0.25s] hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] group"
      onClick={() => onOpen?.(design)}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden rounded-t-[6px]"
        style={{
          height: `${height}px`,
          backgroundColor: category?.color ?? '#f0f0f0',
        }}
      >
        {design.thumbnail_url ? (
          <img
            src={design.thumbnail_url}
            alt={design.title}
            className="w-full h-full object-cover transition-transform duration-[0.4s] group-hover:scale-[1.04]"
          />
        ) : (
          <span className="text-white/60 font-[family-name:var(--font-syne)] text-[24px] font-extrabold">
            {design.title.charAt(0)}
          </span>
        )}

        {/* Save label */}
        <button
          className="absolute top-2 right-2 bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer border-none hover:bg-[#333]"
          onClick={(e) => {
            e.stopPropagation();
            onBuy?.(design);
          }}
        >
          ${design.price}
        </button>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 border-t border-[rgba(0,0,0,0.04)] bg-white">
        <div className="text-[12px] text-[#111] leading-[1.35] mb-1 line-clamp-1">
          {design.title}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#bbb]">
            {design.creator.username}.artroom
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={cn(
              'text-[12px] cursor-pointer bg-transparent border-none p-0 transition-colors',
              liked ? 'text-[#E8001A]' : 'text-[#ddd]'
            )}
          >
            <Heart size={12} fill={liked ? '#E8001A' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
