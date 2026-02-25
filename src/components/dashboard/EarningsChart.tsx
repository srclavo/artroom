'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  title: string;
  type: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

interface EarningsChartProps {
  transactions: Transaction[];
}

const PERIODS = ['7d', '30d', 'all'] as const;

export function EarningsChart({ transactions }: EarningsChartProps) {
  const [period, setPeriod] = useState<typeof PERIODS[number]>('30d');
  const [showChart, setShowChart] = useState(true);

  // Aggregate transactions by date for chart
  const chartData = useMemo(() => {
    const paidTxns = transactions.filter((t) => t.status === 'paid');
    if (paidTxns.length === 0) return [];

    const grouped: Record<string, number> = {};
    paidTxns.forEach((t) => {
      const key = t.date;
      grouped[key] = (grouped[key] || 0) + t.amount;
    });

    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .slice(period === '7d' ? -7 : period === '30d' ? -30 : 0);
  }, [transactions, period]);

  return (
    <div className="border border-[#e8e8e8] rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-[#e8e8e8] flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowChart(true)}
            className={cn(
              'font-[family-name:var(--font-syne)] text-[11px] font-bold cursor-pointer bg-transparent border-none transition-colors',
              showChart ? 'text-[#0a0a0a]' : 'text-[#ccc]'
            )}
          >
            Chart
          </button>
          <button
            onClick={() => setShowChart(false)}
            className={cn(
              'font-[family-name:var(--font-syne)] text-[11px] font-bold cursor-pointer bg-transparent border-none transition-colors',
              !showChart ? 'text-[#0a0a0a]' : 'text-[#ccc]'
            )}
          >
            Transactions
          </button>
        </div>
        {showChart && (
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'font-[family-name:var(--font-syne)] text-[9px] font-bold px-2.5 py-1 rounded-full cursor-pointer border transition-all',
                  period === p
                    ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                    : 'border-[#e8e8e8] bg-white text-[#999] hover:border-[#0a0a0a]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {showChart ? (
        <div className="px-4 py-5">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#bbb' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#bbb' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e8e8e8', fontSize: 12 }}
                  formatter={(value) => [`$${value}`, 'Earnings']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2ec66d"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2ec66d' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-10 text-[12px] text-[#ccc]">No earnings data yet</div>
          )}
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0f0f0]">
              {['Title', 'Type', 'Amount', 'Date', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[12px] text-[#ccc]">No transactions yet</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-5 py-3 text-[13px] text-[#111]">{tx.title}</td>
                  <td className="px-5 py-3 text-[11px] text-[#888]">{tx.type}</td>
                  <td className="px-5 py-3 font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#2ec66d]">
                    ${tx.amount}
                  </td>
                  <td className="px-5 py-3 text-[11px] text-[#888]">{tx.date}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-[family-name:var(--font-syne)] font-bold uppercase tracking-[0.06em] ${
                        tx.status === 'paid'
                          ? 'bg-[rgba(46,198,109,0.1)] text-[#2ec66d]'
                          : 'bg-[rgba(245,200,0,0.15)] text-[#92400e]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
