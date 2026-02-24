'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import type { DesignWithCreator } from '@/types/design';

const FALLBACK_ITEMS = [
  { label: 'Lumis', color: '#FFB3C6', tc: '#0a0a0a' },
  { label: 'Stellar', color: '#1B4FE8', tc: '#fff' },
  { label: 'Neue', color: '#FFE500', tc: '#0a0a0a' },
  { label: 'Coastal', color: '#1A7A3C', tc: '#fff' },
  { label: 'Geo', color: '#7B3FA0', tc: '#fff' },
  { label: 'Motion', color: '#FF5F1F', tc: '#fff' },
  { label: 'Forma', color: '#0D1B4B', tc: '#fff' },
  { label: 'Signal', color: '#E8001A', tc: '#fff' },
  { label: 'Heat', color: '#00A896', tc: '#fff' },
  { label: 'Logic', color: '#E8D5B0', tc: '#0a0a0a' },
];

export function ArtOfTheWeek() {
  const [designs, setDesigns] = useState<DesignWithCreator[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/designs/trending')
      .then((r) => (r.ok ? r.json() : []))
      .then(setDesigns)
      .catch(() => {});
  }, []);

  // Manual scroll animation (like Footer marquee)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.4;
    let isPaused = false;

    const animate = () => {
      if (!isPaused) {
        position -= speed;
        if (Math.abs(position) >= track.scrollWidth / 2) {
          position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    const onEnter = () => { isPaused = true; };
    const onLeave = () => { isPaused = false; };

    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
    };
  }, [designs]);

  const hasDesigns = designs.length > 0;
  // Duplicate for seamless loop
  const displayDesigns = hasDesigns ? [...designs, ...designs] : [];
  const fallbackItems = [...FALLBACK_ITEMS, ...FALLBACK_ITEMS];

  return (
    <div className="py-5 px-7">
      {/* Label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#bbb] whitespace-nowrap">
          Art of the Week
        </span>
        <span className="flex-1 h-px bg-[#f0f0f0]" />
      </div>

      {/* Scrolling strip */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-[80px] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[80px] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div ref={trackRef} className="flex will-change-transform whitespace-nowrap">
          {hasDesigns
            ? displayDesigns.map((design, i) => (
                <Link
                  key={`${design.id}-${i}`}
                  href={ROUTES.design(design.id)}
                  className="no-underline flex-shrink-0 mx-2 group"
                >
                  <div className="relative w-[280px] h-[320px] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]">
                    {/* Thumbnail */}
                    {design.thumbnail_url ? (
                      <img
                        src={design.thumbnail_url}
                        alt={design.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor: FALLBACK_ITEMS[i % FALLBACK_ITEMS.length].color,
                        }}
                      >
                        <span className="font-[family-name:var(--font-syne)] text-[48px] font-extrabold opacity-40 text-white">
                          {design.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Title + Creator overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="font-[family-name:var(--font-syne)] text-[15px] font-bold text-white leading-tight truncate">
                        {design.title}
                      </div>
                      <div className="font-[family-name:var(--font-dm-sans)] text-[11px] text-white/70 mt-1">
                        {design.creator?.display_name || design.creator?.username}
                      </div>
                    </div>

                    {/* Category badge */}
                    {design.category && (
                      <div className="absolute top-3 left-3">
                        <span className="font-[family-name:var(--font-syne)] text-[8px] font-bold uppercase tracking-[0.1em] bg-white/90 text-[#0a0a0a] px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {design.category}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            : fallbackItems.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] h-[320px] rounded-[14px] mx-2 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
                  style={{ backgroundColor: item.color }}
                >
                  <span
                    className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold opacity-50"
                    style={{ color: item.tc }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
