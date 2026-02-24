'use client';

import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/constants/categories';

interface CategoryFilterProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  return (
    <div
      className={cn(
        'flex gap-1.5 overflow-x-auto scrollbar-hide px-7 py-3.5 border-b border-[#e8e8e8]',
        className
      )}
    >
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          'font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.06em] uppercase',
          'px-4 py-[7px] rounded-full border-none cursor-pointer whitespace-nowrap flex-shrink-0',
          'transition-all duration-200 hover:opacity-[0.78] active:scale-[0.95]',
          'bg-[#0a0a0a] text-white',
          activeCategory !== null && 'opacity-[0.28]'
        )}
      >
        All Designs
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={cn(
            'font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.06em] uppercase',
            'px-4 py-[7px] rounded-full border-none cursor-pointer whitespace-nowrap flex-shrink-0',
            'transition-all duration-200 hover:opacity-[0.78] active:scale-[0.95]',
            activeCategory !== null && activeCategory !== cat.id && 'opacity-[0.28]'
          )}
          style={{ backgroundColor: cat.color, color: cat.textColor }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
