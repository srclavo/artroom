'use client';

import { useState } from 'react';
import { X, Heart, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_MAP } from '@/constants/categories';
import type { DesignWithCreator } from '@/types/design';

interface DesignViewerProps {
  design: DesignWithCreator | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: (design: DesignWithCreator) => void;
}

export function DesignViewer({ design, isOpen, onClose, onBuy }: DesignViewerProps) {
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');

  if (!isOpen || !design) return null;

  const category = CATEGORY_MAP[design.category];

  return (
    <div
      className="fixed inset-0 z-[900] bg-white/90 backdrop-blur-[14px] flex items-center justify-center transition-opacity duration-[0.28s]"
      onClick={onClose}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_340px] w-[88vw] max-w-[1060px] h-[82vh] bg-white rounded-[10px] border border-[#e5e5e5] shadow-[0_24px_80px_rgba(0,0,0,0.1)] overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left - Preview */}
        <div
          className="flex items-center justify-center border-r border-[#e8e8e8]"
          style={{ backgroundColor: category?.color ?? '#f0f0f0' }}
        >
          {design.thumbnail_url ? (
            <img src={design.thumbnail_url} alt={design.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white/50 font-[family-name:var(--font-syne)] text-[64px] font-extrabold">
              {design.title.charAt(0)}
            </span>
          )}
        </div>

        {/* Right - Details */}
        <div className="p-7 overflow-y-auto thin-scrollbar">
          {/* Close */}
          <button
            onClick={onClose}
            className="float-right w-7 h-7 rounded-full border border-[#e5e5e5] bg-transparent flex items-center justify-center cursor-pointer text-[#999] hover:bg-[#f0f0f0] transition-colors"
          >
            <X size={12} />
          </button>

          {/* Title */}
          <h2 className="font-[family-name:var(--font-syne)] text-[20px] font-bold leading-[1.25] mb-3 pr-8">
            {design.title}
          </h2>

          {/* Creator */}
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#f0f0f0]">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-[family-name:var(--font-syne)] text-[13px] font-bold"
              style={{ backgroundColor: category?.color ?? '#f0f0f0', color: category?.textColor ?? '#000' }}
            >
              {(design.creator.display_name ?? design.creator.username).charAt(0)}
            </div>
            <div>
              <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
                {design.creator.display_name ?? design.creator.username}
              </div>
              <div className="text-[11px] text-[#bbb]">
                {design.creator.username}.artroom
              </div>
            </div>
          </div>

          {/* Description */}
          {design.description && (
            <p className="text-[13px] leading-[1.75] text-[#555] mb-4">
              {design.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {design.tags.map((tag) => (
              <span
                key={tag}
                className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full border border-[#e5e5e5] text-[#888]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-5">
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {(design.view_count ?? 0).toLocaleString()}
              </strong>
              views
            </div>
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {(design.like_count ?? 0).toLocaleString()}
              </strong>
              likes
            </div>
            <div className="text-[11px] text-[#aaa]">
              <strong className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] block">
                {(design.download_count ?? 0).toLocaleString()}
              </strong>
              saves
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mb-5">
            <button
              onClick={() => onBuy?.(design)}
              className="w-full py-3 rounded-full bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.08em] border-[1.5px] border-[#0a0a0a] cursor-pointer hover:bg-[#333] transition-all"
            >
              Buy — ${design.price}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={cn(
                'w-full py-3 rounded-full font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.08em] border-[1.5px] cursor-pointer transition-all flex items-center justify-center gap-2',
                saved
                  ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                  : 'bg-white text-[#0a0a0a] border-[#0a0a0a] hover:bg-[#f5f5f5]'
              )}
            >
              <Bookmark size={12} fill={saved ? '#fff' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Comments */}
          <div className="border-t border-[#f0f0f0] pt-4">
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#bbb] mb-3 flex items-center gap-2.5">
              Comments
              <span className="flex-1 h-px bg-[#f0f0f0]" />
            </div>

            <div className="mb-3 flex items-center gap-2.5 p-2 rounded-lg border border-[#e5e5e5]">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 text-[12px] bg-transparent border-none outline-none placeholder:text-[#ccc]"
              />
              <button className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1.5 rounded-full bg-[#0a0a0a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors">
                Post
              </button>
            </div>

            <div className="text-center text-[11px] text-[#ccc] py-4">
              No comments yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
