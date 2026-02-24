'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';

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
  const [stripeConnected, setStripeConnected] = useState<boolean | null>(null);

  // Check Stripe Connect status
  useEffect(() => {
    const checkStripe = async () => {
      try {
        const res = await fetch('/api/stripe/connect');
        if (res.ok) {
          const data = await res.json();
          setStripeConnected(data.chargesEnabled === true);
        } else {
          setStripeConnected(false);
        }
      } catch {
        setStripeConnected(false);
      }
    };
    checkStripe();
  }, []);

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

      {stripeConnected === false && (
        <div className="mb-6 rounded-[14px] border border-[#e8e8e8] bg-[#fafafa] p-5 flex items-center justify-between gap-4">
          <div>
            <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a] mb-1">
              Connect Stripe to receive payments
            </div>
            <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#888] leading-[1.6] m-0">
              Set up your Stripe account to receive card and Apple Pay payouts directly to your bank.
            </p>
          </div>
          <Link
            href={ROUTES.dashboardSettings}
            className="flex-shrink-0 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] bg-[#0a0a0a] text-white px-5 py-2.5 rounded-[10px] no-underline hover:opacity-80 transition-opacity"
          >
            Connect Stripe
          </Link>
        </div>
      )}

      <StatsCards stats={stats} />

      <div className="mt-6">
        <EarningsChart transactions={transactions} />
      </div>
    </div>
  );
}
