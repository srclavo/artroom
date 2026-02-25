'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Trash2, Archive, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';
import { CATEGORY_MAP } from '@/constants/categories';
import { formatPrice } from '@/lib/utils';
import type { Database } from '@/types/database';

type Design = Database['public']['Tables']['designs']['Row'];

const STATUS_STYLES: Record<string, { bg: string; tc: string }> = {
  published: { bg: '#f0fdf4', tc: '#16a34a' },
  draft: { bg: '#fef9c3', tc: '#92400e' },
  archived: { bg: '#fef2f2', tc: '#dc2626' },
};

export default function DashboardListingsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDesigns = async () => {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('[Listings] Fetch error:', error.message);
      setDesigns((data ?? []) as Design[]);
      setLoading(false);
    };
    fetchDesigns();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('designs').update({ status } as never).eq('id', id);
    setDesigns((prev) => prev.map((d) => d.id === id ? { ...d, status: status as Design['status'] } : d));
  };

  const deleteDesign = async (id: string) => {
    await supabase.from('designs').delete().eq('id', id);
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold">My Listings</h1>
        <Link href={ROUTES.dashboardUploads}>
          <Button size="sm">New Listing</Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[13px] text-[#999]">Loading...</div>
      ) : designs.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-[40px] mb-3 opacity-30">🖼</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
            No listings yet — time to create!
          </div>
          <p className="text-[12px] text-[#ccc] mb-4">
            Upload your first design and start selling to creators worldwide.
          </p>
          <Link href={ROUTES.dashboardUploads}>
            <Button size="sm">Upload a Design</Button>
          </Link>
        </div>
      ) : (
        <div className="border border-[#e8e8e8] rounded-[12px] overflow-hidden">
          {designs.map((design) => {
            const style = STATUS_STYLES[design.status] ?? STATUS_STYLES.draft;
            const catMeta = CATEGORY_MAP[design.category];
            return (
              <div
                key={design.id}
                className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
              >
                {/* Thumbnail */}
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: catMeta?.color ?? '#f0f0f0' }}
                >
                  {design.thumbnail_url ? (
                    <img src={design.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span
                      className="font-[family-name:var(--font-syne)] text-[14px] font-extrabold opacity-40"
                      style={{ color: catMeta?.textColor ?? '#0a0a0a' }}
                    >
                      {design.title.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#0a0a0a] mb-0.5 truncate">
                    {design.title}
                  </div>
                  <div className="text-[11px] text-[#999]">
                    {catMeta?.label ?? design.category} &middot;{' '}
                    {new Date(design.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Status */}
                <Badge color={style.bg} textColor={style.tc}>
                  {design.status}
                </Badge>

                {/* Price */}
                <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a] w-16 text-right">
                  {design.price > 0 ? formatPrice(design.price) : 'Free'}
                </div>

                {/* Actions */}
                <div className="flex gap-1.5">
                  <Link href={ROUTES.design(design.id)}>
                    <button className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#0a0a0a] transition-colors">
                      <Eye size={13} className="text-[#999]" />
                    </button>
                  </Link>
                  {design.status === 'published' ? (
                    <button
                      onClick={() => updateStatus(design.id, 'archived')}
                      className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#ff4625] transition-colors"
                      title="Archive"
                    >
                      <Archive size={13} className="text-[#999]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(design.id, 'published')}
                      className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#16a34a] transition-colors"
                      title="Publish"
                    >
                      <RotateCcw size={13} className="text-[#999]" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteDesign(design.id)}
                    className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#ff4625] hover:bg-[#fef2f2] transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} className="text-[#999]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
