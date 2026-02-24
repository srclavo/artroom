'use client';

import { CATEGORIES } from '@/constants/categories';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-[200px] flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] border-r border-[#f2f2f2] overflow-y-auto p-5">
      <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb] mb-3">
        Categories
      </div>
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            'text-left px-3 py-2 rounded-lg text-[12px] font-[family-name:var(--font-syne)] font-bold transition-all cursor-pointer border-none',
            activeCategory === null
              ? 'bg-[#0a0a0a] text-white'
              : 'bg-transparent text-[#666] hover:bg-[#f7f7f7] hover:text-[#0a0a0a]'
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              'text-left px-3 py-2 rounded-lg text-[12px] font-[family-name:var(--font-syne)] font-bold transition-all cursor-pointer border-none flex items-center gap-2',
              activeCategory === cat.id
                ? 'bg-[#f7f7f7] text-[#0a0a0a]'
                : 'bg-transparent text-[#666] hover:bg-[#f7f7f7] hover:text-[#0a0a0a]'
            )}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            {cat.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
