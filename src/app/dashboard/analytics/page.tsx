'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Heart, Download, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_MAP } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import { formatCompactNumber } from '@/lib/utils';
import type { DesignWithCreator } from '@/types/design';

interface WorkSection {
  title: string;
  items: DesignWithCreator[];
}

interface Transaction {
  id: string;
  title: string;
  type: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

interface RecentFollower {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState([
    { label: 'Total Views', value: '—', change: '', isPositive: true },
    { label: 'Total Likes', value: '—', change: '', isPositive: true },
    { label: 'Followers', value: '—', change: '', isPositive: true },
    { label: 'Earnings', value: '—', change: '', isPositive: true },
  ]);
  const [workSections, setWorkSections] = useState<WorkSection[]>([]);
  const [topByViews, setTopByViews] = useState<DesignWithCreator[]>([]);
  const [topByRevenue, setTopByRevenue] = useState<{ design: DesignWithCreator; revenue: number }[]>([]);
  const [recentFollowers, setRecentFollowers] = useState<RecentFollower[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const { data: designs } = await supabase
          .from('designs')
          .select(`
            *,
            creator:profiles!designs_creator_id_fkey (
              id, username, display_name, avatar_url, is_verified
            )
          `)
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        const { count: followerCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id);

        const { data: purchases } = await supabase
          .from('purchases')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        const { data: followers } = await supabase
          .from('follows')
          .select(`
            follower_id,
            profiles!follows_follower_id_fkey (
              id, username, display_name, avatar_url
            )
          `)
          .eq('following_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const rows = (designs ?? []) as unknown as DesignWithCreator[];
        const purchaseRows = (purchases ?? []) as { id: string; design_id: string; amount: number; creator_payout: number; status: string; created_at: string }[];

        const totalViews = rows.reduce((sum, d) => sum + (d.view_count ?? 0), 0);
        const totalLikes = rows.reduce((sum, d) => sum + (d.like_count ?? 0), 0);
        const totalDownloads = rows.reduce((sum, d) => sum + (d.download_count ?? 0), 0);
        const totalEarnings = purchaseRows
          .filter((p) => p.status === 'completed')
          .reduce((sum, p) => sum + (p.creator_payout ?? p.amount ?? 0), 0);

        setStats([
          { label: 'Total Views', value: formatCompactNumber(totalViews), change: `${rows.length} designs`, isPositive: true },
          { label: 'Total Likes', value: formatCompactNumber(totalLikes), change: `${formatCompactNumber(totalDownloads)} downloads`, isPositive: true },
          { label: 'Followers', value: formatCompactNumber(followerCount ?? 0), change: '', isPositive: true },
          { label: 'Earnings', value: `$${totalEarnings.toFixed(2)}`, change: `${purchaseRows.length} sales`, isPositive: true },
        ]);

        const sortedByViews = [...rows].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0)).slice(0, 5);
        setTopByViews(sortedByViews);

        const revenueMap: Record<string, number> = {};
        for (const p of purchaseRows.filter((p) => p.status === 'completed')) {
          revenueMap[p.design_id] = (revenueMap[p.design_id] || 0) + (p.creator_payout ?? p.amount ?? 0);
        }
        const designMap = new Map(rows.map((d) => [d.id, d]));
        const sortedByRevenue = Object.entries(revenueMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([designId, revenue]) => ({ design: designMap.get(designId)!, revenue }))
          .filter((item) => item.design);
        setTopByRevenue(sortedByRevenue);

        if (followers) {
          const mapped = (followers as unknown as { profiles: RecentFollower }[])
            .map((f) => f.profiles)
            .filter(Boolean);
          setRecentFollowers(mapped);
        }

        const txns: Transaction[] = purchaseRows.map((p) => {
          const design = designMap.get(p.design_id);
          return {
            id: p.id,
            title: design?.title ?? 'Design Sale',
            type: 'sale',
            amount: p.creator_payout ?? p.amount ?? 0,
            date: new Date(p.created_at).toISOString().split('T')[0],
            status: p.status === 'completed' ? 'paid' as const : 'pending' as const,
          };
        });
        setTransactions(txns);

        if (rows.length > 0) {
          const grouped: Record<string, DesignWithCreator[]> = {};
          for (const d of rows) {
            const cat = d.category || 'other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(d);
          }

          const sections: WorkSection[] = Object.entries(grouped).map(([cat, items]) => ({
            title: CATEGORY_MAP[cat]?.label ?? cat,
            items,
          }));

          setWorkSections(sections);
        }
      } catch (err) {
        console.error('[Analytics] Unexpected error:', err);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Analytics
      </h1>

      <StatsCards stats={stats} />

      {/* Earnings Chart */}
      <div className="mt-6">
        <EarningsChart transactions={transactions} />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Top Designs by Views */}
        <div className="border border-[#e8e8e8] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e8e8e8] flex items-center gap-2">
            <Eye size={13} className="text-[#999]" />
            <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.1em]">
              Top by Views
            </span>
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            {topByViews.length === 0 ? (
              <div className="px-5 py-6 text-center text-[12px] text-[#ccc]">No designs yet</div>
            ) : (
              topByViews.map((d, i) => (
                <Link key={d.id} href={ROUTES.design(d.id)} className="flex items-center gap-3 px-5 py-2.5 no-underline hover:bg-[#fafafa] transition-colors">
                  <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold text-[#ccc] w-4">{i + 1}</span>
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_MAP[d.category]?.color ?? '#f0f0f0' }}
                  >
                    {d.thumbnail_url ? (
                      <img src={d.thumbnail_url} alt="" className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold opacity-30">{d.title.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#333] truncate flex-1">{d.title}</span>
                  <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#0a0a0a]">
                    {formatCompactNumber(d.view_count ?? 0)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top Designs by Revenue */}
        <div className="border border-[#e8e8e8] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e8e8e8] flex items-center gap-2">
            <DollarSign size={13} className="text-[#2ec66d]" />
            <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.1em]">
              Top by Revenue
            </span>
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            {topByRevenue.length === 0 ? (
              <div className="px-5 py-6 text-center text-[12px] text-[#ccc]">No sales yet</div>
            ) : (
              topByRevenue.map((item, i) => (
                <Link key={item.design.id} href={ROUTES.design(item.design.id)} className="flex items-center gap-3 px-5 py-2.5 no-underline hover:bg-[#fafafa] transition-colors">
                  <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold text-[#ccc] w-4">{i + 1}</span>
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_MAP[item.design.category]?.color ?? '#f0f0f0' }}
                  >
                    {item.design.thumbnail_url ? (
                      <img src={item.design.thumbnail_url} alt="" className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold opacity-30">{item.design.title.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#333] truncate flex-1">{item.design.title}</span>
                  <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#2ec66d]">
                    ${item.revenue.toFixed(2)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Followers */}
      {recentFollowers.length > 0 && (
        <div className="mt-6 border border-[#e8e8e8] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e8e8e8] flex items-center gap-2">
            <TrendingUp size={13} className="text-[#6e87f2]" />
            <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.1em]">
              Recent Followers
            </span>
          </div>
          <div className="flex gap-4 px-5 py-4 overflow-x-auto scrollbar-hide">
            {recentFollowers.map((f) => (
              <Link
                key={f.id}
                href={ROUTES.artist(f.username)}
                className="flex flex-col items-center gap-1.5 no-underline flex-shrink-0"
              >
                <Avatar name={f.display_name || f.username} size="md" />
                <span className="text-[10px] text-[#555] truncate max-w-[70px]">
                  @{f.username}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Work sections */}
      {workSections.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <div className="text-[32px] mb-3">🎨</div>
          <p className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">No works yet</p>
          <p className="text-[12px] text-[#ccc] mb-4">Upload your first design to get started</p>
          <Link
            href={ROUTES.dashboardUploads}
            className="inline-block font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-5 py-2.5 rounded-full bg-[#0a0a0a] text-white no-underline hover:bg-[#333] transition-colors"
          >
            Upload Work
          </Link>
        </div>
      ) : (
        workSections.map((section) => (
          <div key={section.title} className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-[family-name:var(--font-syne)] text-[13px] font-bold tracking-[0.03em]">
                {section.title}
              </h2>
              <Link
                href={ROUTES.dashboardUploads}
                className="ml-auto font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full border-none bg-[#ff4625] text-white cursor-pointer hover:bg-[#e03b1e] transition-colors no-underline"
              >
                + Upload
              </Link>
            </div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
              {section.items.map((item) => {
                const cat = CATEGORY_MAP[item.category];
                return (
                  <Link key={item.id} href={ROUTES.design(item.id)} className="no-underline">
                    <div className="flex-shrink-0 w-[118px] rounded-[6px] border border-[#e8e8e8] overflow-hidden cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_8px_22px_rgba(0,0,0,0.1)] transition-all group relative">
                      <div
                        className="h-[88px] flex items-center justify-center"
                        style={{ backgroundColor: cat?.color ?? '#f0f0f0' }}
                      >
                        {item.thumbnail_url ? (
                          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white/40 font-[family-name:var(--font-syne)] text-[22px] font-extrabold transition-transform group-hover:scale-110">
                            {item.title.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="px-2.5 py-2 text-[10px] text-[#111] truncate bg-white whitespace-nowrap">
                        {item.title}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="font-[family-name:var(--font-syne)] text-[9px] font-bold text-white uppercase tracking-[0.08em]">
                          Open ↗
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link href={ROUTES.dashboardUploads} className="no-underline">
                <div className="flex-shrink-0 w-[118px] h-[120px] rounded-[6px] border-[1.5px] border-dashed border-[#ddd] flex flex-col items-center justify-center text-[#ccc] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all bg-transparent">
                  <span className="text-[20px]">+</span>
                  <span className="text-[10px] font-bold">Add Work</span>
                </div>
              </Link>
            </div>
          </div>
        ))
      )}

      <Link href={ROUTES.dashboardUploads} className="no-underline block">
        <button className="mt-6 w-full py-[18px] rounded-[6px] border-[1.5px] border-dashed border-[#ddd] text-[#ccc] font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all bg-transparent">
          + Upload New Work
        </button>
      </Link>
    </div>
  );
}
