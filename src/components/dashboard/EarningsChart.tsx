'use client';

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

export function EarningsChart({ transactions }: EarningsChartProps) {
  return (
    <div className="border border-[#e8e8e8] rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-[#e8e8e8]">
        <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
          Recent Transactions
        </span>
      </div>
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
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
            >
              <td className="px-5 py-3 text-[13px] text-[#111]">{tx.title}</td>
              <td className="px-5 py-3 text-[11px] text-[#888]">{tx.type}</td>
              <td className="px-5 py-3 font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#1A7A3C]">
                ${tx.amount}
              </td>
              <td className="px-5 py-3 text-[11px] text-[#888]">{tx.date}</td>
              <td className="px-5 py-3">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-[family-name:var(--font-syne)] font-bold uppercase tracking-[0.06em] ${
                    tx.status === 'paid'
                      ? 'bg-[rgba(26,122,58,0.1)] text-[#1A7A3C]'
                      : 'bg-[rgba(245,200,0,0.15)] text-[#92400e]'
                  }`}
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
