'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CATEGORIES } from '@/constants/categories';

const MAIN_TABS = [
  { id: 'all', label: 'All Designs', color: '#fff', textColor: '#0a0a0a', gradientBorder: 'linear-gradient(90deg, #ff4625, #f07e41, #e0eb3a, #2ec66d, #98c7f3, #6e87f2, #d5d1ff, #ffafd9)' },
  { id: 'studios', label: 'Studios', color: '#1A1A2E', textColor: '#fff' },
  { id: 'portfolios', label: 'Portfolios', color: '#E8D5B0', textColor: '#0a0a0a' },
];

const CATEGORY_TABS = CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
  color: c.color,
  textColor: c.textColor,
}));

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const allTabs = [...MAIN_TABS, ...CATEGORY_TABS];

  const handleTabChange = useCallback(
    (tab: string) => {
      onTabChange(tab);
      const params = new URLSearchParams(searchParams.toString());
      if (tab === 'all') {
        params.delete('tab');
      } else {
        params.set('tab', tab);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [onTabChange, searchParams, router, pathname]
  );

  return (
    <Tabs
      tabs={allTabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}
