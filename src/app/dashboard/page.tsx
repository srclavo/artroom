'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_MAP } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import type { DesignWithCreator } from '@/types/design';

interface WorkSection {
  title: string;
  items: DesignWithCreator[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState([
    { label: 'Total Views', value: '—', change: '', isPositive: true },
    { label: 'Followers', value: '—', change: '', isPositive: true },
    { label: 'Earnings', value: '—', change: '', isPositive: true },
  ]);
  const [workSections, setWorkSections] = useState<WorkSection[]>([]);
  const [aiMessages, setAiMessages] = useState([
    { from: 'ai', text: 'Welcome to your studio! I can help you manage your portfolio, analyze trends, and optimize your listings. What would you like to work on?' },
  ]);
  const [aiInput, setAiInput] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      // Fetch designs by the current user
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

      // Fetch follower count
      const { count: followerCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

      const rows = (designs ?? []) as unknown as DesignWithCreator[];

      if (rows.length > 0) {
        const totalViews = rows.reduce((sum, d) => sum + (d.view_count ?? 0), 0);

        setStats([
          { label: 'Total Views', value: totalViews.toLocaleString(), change: `${rows.length} published`, isPositive: true },
          { label: 'Followers', value: `${followerCount ?? 0}`, change: '', isPositive: true },
          { label: 'Works', value: `${rows.length}`, change: '', isPositive: true },
        ]);

        // Group designs by category
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
    };

    fetchDashboardData();
  }, [user]);

  const sendAI = () => {
    if (!aiInput.trim()) return;
    setAiMessages((prev) => [
      ...prev,
      { from: 'user', text: aiInput },
      { from: 'ai', text: 'Great question! Let me look into that for you. Based on your portfolio analytics, I recommend focusing on your branding work — it gets 3× more engagement than other categories.' },
    ]);
    setAiInput('');
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Studio Overview
      </h1>

      <StatsCards stats={stats} />

      {/* AI Panel */}
      <div className="mt-6 border border-[#e8e8e8] rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 bg-[#fafafa] border-b border-[#e8e8e8]">
          <span className="w-[7px] h-[7px] rounded-full bg-[#1A7A3C] animate-ai-pulse" />
          <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
            Claude — Studio AI
          </span>
          <span className="ml-auto text-[10px] text-[#999]">
            Powered by Anthropic
          </span>
        </div>

        <div className="p-4 max-h-[180px] overflow-y-auto thin-scrollbar">
          {aiMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} mb-2 last:mb-0`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-[9px] text-[12px] leading-[1.65] ${
                  msg.from === 'user'
                    ? 'bg-[#0a0a0a] text-white rounded-br-[4px]'
                    : 'bg-[#f5f5f5] text-[#333] rounded-bl-[4px]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <input
            type="text"
            placeholder="Ask Claude anything..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendAI()}
            className="flex-1 px-3.5 py-2 rounded-full border border-[#e8e8e8] text-[12px] outline-none focus:border-[#0a0a0a] transition-all font-[family-name:var(--font-dm-sans)]"
          />
          <button
            onClick={sendAI}
            className="px-4 py-2 rounded-full bg-[#0a0a0a] text-white text-[10px] font-[family-name:var(--font-syne)] font-bold uppercase tracking-[0.06em] border-none cursor-pointer hover:bg-[#333] transition-colors"
          >
            Send →
          </button>
        </div>
      </div>

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
                className="ml-auto font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full border-none bg-[#E8001A] text-white cursor-pointer hover:bg-[#c5001a] transition-colors no-underline"
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
