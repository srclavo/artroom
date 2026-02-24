'use client';

import { Tabs } from '@/components/ui/Tabs';
import { CATEGORIES } from '@/constants/categories';

const MAIN_TABS = [
  { id: 'all', label: 'All Designs', color: '#0a0a0a', textColor: '#fff' },
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
  const allTabs = [...MAIN_TABS, ...CATEGORY_TABS];

  return (
    <Tabs
      tabs={allTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}
