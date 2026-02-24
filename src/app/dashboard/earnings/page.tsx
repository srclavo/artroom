'use client';

import { useState, useEffect } from 'react';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface Transaction {
  id: string;
  title: string;
  type: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

interface PurchaseRow {
  id: string;
  amount: number;
  creator_payout: number;
  status: string;
  created_at: string;
  design: { title: string; category: string } | null;
}

export default function EarningsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState([
    { label: 'Total Earned', value: '—', change: '', isPositive: true },
    { label: 'Pending Payout', value: '—', change: '', isPositive: true },
    { label: 'Avg. Per Sale', value: '—', change: '', isPositive: true },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchEarnings = async () => {
      // Fetch purchases where the user's designs were sold
      // Note: This requires the creator_sales_policy migration to be applied
      const { data: purchases } = await supabase
        .from('purchases')
        .select(`
          id,
          amount,
          creator_payout,
          status,
          created_at,
          design:designs (
            title,
            category
          )
        `)
        .order('created_at', { ascending: false });

      const rows = (purchases ?? []) as unknown as PurchaseRow[];

      if (rows.length > 0) {
        const completed = rows.filter((p) => p.status === 'completed');
        const pending = rows.filter((p) => p.status === 'pending');

        const totalEarned = completed.reduce((sum, p) => sum + Number(p.creator_payout), 0);
        const pendingAmount = pending.reduce((sum, p) => sum + Number(p.creator_payout), 0);
        const avgPerSale = completed.length > 0 ? totalEarned / completed.length : 0;

        setStats([
          { label: 'Total Earned', value: `$${totalEarned.toLocaleString()}`, change: `${completed.length} sales`, isPositive: true },
          { label: 'Pending Payout', value: `$${pendingAmount.toLocaleString()}`, change: pending.length > 0 ? `${pending.length} pending` : '', isPositive: true },
          { label: 'Avg. Per Sale', value: `$${avgPerSale.toFixed(0)}`, change: '', isPositive: true },
        ]);

        const txns: Transaction[] = rows.map((p) => {
          const date = new Date(p.created_at);
          return {
            id: p.id,
            title: p.design?.title ?? 'Unknown Design',
            type: 'Gallery',
            amount: Number(p.creator_payout),
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            status: p.status === 'completed' ? 'paid' as const : 'pending' as const,
          };
        });

        setTransactions(txns);
      } else {
        setStats([
          { label: 'Total Earned', value: '$0', change: 'No sales yet', isPositive: true },
          { label: 'Pending Payout', value: '$0', change: '', isPositive: true },
          { label: 'Avg. Per Sale', value: '$0', change: '', isPositive: true },
        ]);
      }
    };

    fetchEarnings();
  }, [user]);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Earnings
      </h1>

      <StatsCards stats={stats} />

      <div className="mt-6">
        <EarningsChart transactions={transactions} />
      </div>
    </div>
  );
}
