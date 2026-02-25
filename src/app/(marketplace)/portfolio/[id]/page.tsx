'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { CATEGORY_MAP } from '@/constants/categories';
import { createClient } from '@/lib/supabase/client';

interface PortfolioData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  tags: string[];
  view_count: number;
  thumbnail_url: string | null;
  preview_urls: string[] | null;
  creator: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export default function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          id, title, description, price, category, tags, view_count,
          thumbnail_url, preview_urls,
          creator:profiles!portfolios_creator_id_fkey (
            username, display_name, avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPortfolio(data as unknown as PortfolioData);
      }
      setLoading(false);
    };

    fetchPortfolio();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <div className="h-6 w-20 bg-[#f0f0f0] rounded animate-pulse mb-6" />
        <div className="rounded-[12px] border border-[#e8e8e8] overflow-hidden mb-6">
          <div className="h-[400px] bg-[#f5f5f5] animate-pulse" />
        </div>
        <div className="h-8 bg-[#f0f0f0] rounded w-1/2 animate-pulse mb-4" />
        <div className="h-4 bg-[#f5f5f5] rounded w-3/4 animate-pulse" />
      </div>
    );
  }

  if (notFound || !portfolio) {
    return (
      <div className="max-w-[900px] mx-auto px-6 py-20 text-center">
        <div className="font-[family-name:var(--font-syne)] text-[48px] mb-4 opacity-20">📁</div>
        <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold mb-2">
          Portfolio not found
        </h1>
        <p className="text-[13px] text-[#999] mb-6">
          This portfolio may have been removed or doesn&apos;t exist.
        </p>
        <Link
          href={ROUTES.home}
          className="inline-block font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.04em] bg-[#0a0a0a] text-white px-6 py-2.5 rounded-full no-underline hover:bg-[#333] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const catMeta = CATEGORY_MAP[portfolio.category];

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Preview */}
      <div className="rounded-[12px] border border-[#e8e8e8] overflow-hidden mb-6">
        <div
          className="h-[400px] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: catMeta?.color ?? '#6e87f2' }}
        >
          {portfolio.thumbnail_url ? (
            <img
              src={portfolio.thumbnail_url}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/30 font-[family-name:var(--font-syne)] text-[64px] font-extrabold">
              {portfolio.title.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-[24px] font-bold mb-3">
            {portfolio.title}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <Avatar
              name={portfolio.creator.display_name ?? portfolio.creator.username}
              src={portfolio.creator.avatar_url}
              size="md"
              color="#ff4625"
            />
            <div>
              <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
                {portfolio.creator.display_name ?? portfolio.creator.username}
              </div>
              <div className="text-[11px] text-[#bbb]">
                {portfolio.creator.username}.artroom
              </div>
            </div>
          </div>

          {portfolio.description && (
            <p className="text-[14px] leading-[1.75] text-[#555] mb-4">
              {portfolio.description}
            </p>
          )}

          {portfolio.tags && portfolio.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {portfolio.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="border border-[#e8e8e8] rounded-[12px] p-5 h-fit sticky top-20">
          <div className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold mb-4">
            {portfolio.price > 0 ? `$${portfolio.price}` : 'Free'}
          </div>
          <Button className="w-full mb-2" size="lg">
            Buy Template →
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Bookmark
          </Button>
          <div className="mt-4 pt-4 border-t border-[#f0f0f0] text-[11px] text-[#999]">
            {portfolio.view_count} views
          </div>
        </div>
      </div>
    </div>
  );
}
