import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className={cn(
      'rounded-lg border border-[#e8e8e8] divide-y sm:divide-y-0 sm:divide-x divide-[#e8e8e8]',
      stats.length === 4 ? 'grid grid-cols-2 sm:grid-cols-4' : 'grid grid-cols-1 sm:grid-cols-3'
    )}>
      {stats.map((stat) => (
        <div key={stat.label} className="p-5 text-center">
          <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#999] mb-1">
            {stat.label}
          </div>
          <div className="font-[family-name:var(--font-syne)] text-[36px] font-extrabold text-[#0a0a0a] leading-tight">
            {stat.value}
          </div>
          <div
            className={cn(
              'text-[10px] mt-1',
              stat.isPositive ? 'text-[#1A7A3C]' : 'text-[#E8001A]'
            )}
          >
            {stat.isPositive ? '↑' : '↓'} {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
