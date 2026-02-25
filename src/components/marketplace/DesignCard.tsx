'use client';

import { useState } from 'react';
import { Heart, Bookmark, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SaveToCollectionModal } from '@/components/ui/SaveToCollectionModal';
import type { DesignWithCreator } from '@/types/design';
import { CATEGORY_MAP } from '@/constants/categories';

interface DesignCardProps {
  design: DesignWithCreator;
  height?: number;
  onOpen?: (design: DesignWithCreator) => void;
  onBuy?: (design: DesignWithCreator) => void;
  showRating?: boolean;
}

export function DesignCard({ design, height = 220, onOpen, onBuy, showRating }: DesignCardProps) {
  const [liked, setLiked] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
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

        {/* Price label on hover */}
        <button
          className="absolute top-2 right-2 bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer border-none hover:bg-[#333]"
          onClick={(e) => {
            e.stopPropagation();
            onBuy?.(design);
          }}
        >
          ${design.price}
        </button>

        {/* Bookmark button on hover */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSaveOpen(!saveOpen);
              }}
              className="w-7 h-7 rounded-full bg-white/90 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
            >
              <Bookmark size={12} className="text-[#333]" />
            </button>
            {saveOpen && (
              <SaveToCollectionModal
                designId={design.id}
                isOpen={saveOpen}
                onClose={() => setSaveOpen(false)}
              />
            )}
          </div>
        </div>
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
          <div className="flex items-center gap-1.5">
            {showRating && (design as unknown as { avg_rating?: number }).avg_rating && (
              <span className="flex items-center gap-0.5 text-[10px] text-[#f59e0b]">
                <Star size={9} fill="#f59e0b" /> {((design as unknown as { avg_rating: number }).avg_rating).toFixed(1)}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className={cn(
                'text-[12px] cursor-pointer bg-transparent border-none p-0 transition-colors',
                liked ? 'text-[#ff4625]' : 'text-[#ddd]'
              )}
            >
              <Heart size={12} fill={liked ? '#ff4625' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
