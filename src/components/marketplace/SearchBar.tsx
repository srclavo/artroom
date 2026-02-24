'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search designs, studios, portfolios...',
  onSearch,
  className,
}: SearchBarProps) {
  const [value, setValue] = useState('');

  return (
    <div className={cn('relative', className)}>
      <Search
        size={14}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#e8e8e8] bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[13px] text-[#111] outline-none placeholder:text-[#bbb] focus:bg-white focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.05)] transition-all"
      />
    </div>
  );
}
