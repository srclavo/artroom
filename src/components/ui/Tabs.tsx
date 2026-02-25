'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  color?: string;
  textColor?: string;
  gradientBorder?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex gap-3.5 overflow-x-auto scrollbar-hide px-7 py-4 border-t border-[#f2f2f2]',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.06em] uppercase',
              'px-4 py-1.5 rounded-full border-none cursor-pointer whitespace-nowrap flex-shrink-0',
              'transition-all duration-200 hover:opacity-[0.78] active:scale-[0.95]',
              !isActive && 'opacity-30'
            )}
            style={{
              background: tab.gradientBorder
                ? `linear-gradient(#fff, #fff) padding-box, ${tab.gradientBorder} border-box`
                : tab.color ?? '#0a0a0a',
              color: tab.textColor ?? '#fff',
              border: tab.gradientBorder ? '2px solid transparent' : undefined,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
