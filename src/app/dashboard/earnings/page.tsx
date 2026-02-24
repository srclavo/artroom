import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { StatsCards } from '@/components/dashboard/StatsCards';

const EARNINGS_STATS = [
  { label: 'Total Earned', value: '$4,812', change: '+$320 this month', isPositive: true },
  { label: 'Pending Payout', value: '$1,200', change: 'Next payout Feb 28', isPositive: true },
  { label: 'Avg. Per Sale', value: '$86', change: '+12% vs last month', isPositive: true },
];

const MOCK_TRANSACTIONS = [
  { id: 't1', title: 'Lumis Brand Identity Kit', type: 'Gallery', amount: 129, date: 'Feb 20', status: 'paid' as const },
  { id: 't2', title: 'Brand Identity Studio Skill', type: 'AI Skill', amount: 147, date: 'Feb 19', status: 'paid' as const },
  { id: 't3', title: 'Commission — Startup Rebrand', type: 'Commission', amount: 750, date: 'Feb 18', status: 'paid' as const },
  { id: 't4', title: 'App UI System (Final)', type: 'Commission', amount: 1200, date: 'Feb 21', status: 'pending' as const },
  { id: 't5', title: 'Editorial Layout System', type: 'Gallery', amount: 89, date: 'Feb 17', status: 'paid' as const },
];

export default function EarningsPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Earnings
      </h1>

      <StatsCards stats={EARNINGS_STATS} />

      <div className="mt-6">
        <EarningsChart transactions={MOCK_TRANSACTIONS} />
      </div>
    </div>
  );
}
