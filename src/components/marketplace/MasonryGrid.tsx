'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
  children: ReactNode;
  columns?: number;
  className?: string;
}

export function MasonryGrid({ children, className }: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>('[data-masonry-item]');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${(i % 6) * 0.055}s`;
      setTimeout(() => card.classList.add('masonry-visible'), (i % 6) * 55 + 100);
    });
  }, [children]);

  return (
    <div
      ref={gridRef}
      className={cn(
        'columns-2 md:columns-3 xl:columns-4 gap-2.5 px-5 pb-5',
        className
      )}
    >
      {children}
    </div>
  );
}

export function MasonryItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-masonry-item
      className={cn(
        'break-inside-avoid opacity-0 translate-y-4 transition-all duration-[0.45s]',
        className
      )}
    >
      {children}
    </div>
  );
}
