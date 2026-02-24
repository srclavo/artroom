'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DesignCard } from '@/components/marketplace/DesignCard';
import { MasonryGrid, MasonryItem } from '@/components/marketplace/MasonryGrid';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCollections } from '@/hooks/useCollections';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';
import type { Database } from '@/types/database';
import type { DesignWithCreator } from '@/types/design';

type Collection = Database['public']['Tables']['collections']['Row'];

const CARD_HEIGHTS = [200, 260, 220, 280, 240, 310, 230, 250];

export default function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const { deleteCollection, removeFromCollection } = useCollections();
  const supabase = createClient();
  const [collection, setCollection] = useState<Collection & { user: { username: string; display_name: string | null } } | null>(null);
  const [designs, setDesigns] = useState<DesignWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data: col } = await supabase
        .from('collections')
        .select('*, user:profiles!collections_user_id_fkey (username, display_name)')
        .eq('id', id)
        .single();

      if (col) {
        setCollection(col as unknown as typeof collection);

        const { data: items } = await supabase
          .from('collection_items')
          .select(`
            design_id,
            design:designs (
              *,
              creator:profiles!designs_creator_id_fkey (
                id, username, display_name, avatar_url, is_verified
              )
            )
          `)
          .eq('collection_id', id)
          .order('added_at', { ascending: false });

        if (items) {
          const ds = (items as unknown as { design: DesignWithCreator }[])
            .map((i) => i.design)
            .filter(Boolean);
          setDesigns(ds);
        }
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const isOwner = user && collection && user.id === collection.user_id;

  const handleRemove = async (designId: string) => {
    await removeFromCollection(id, designId);
    setDesigns((prev) => prev.filter((d) => d.id !== designId));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-content max-w-5xl mx-auto px-6 py-8">
          <div className="py-20 text-center text-[13px] text-[#999]">Loading...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!collection) {
    return (
      <>
        <Navbar />
        <main className="page-content max-w-5xl mx-auto px-6 py-8 text-center py-20">
          <div className="text-[32px] mb-3">📁</div>
          <div className="font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#999]">Collection not found</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-content max-w-5xl mx-auto px-6 py-8">
        <Link
          href={ROUTES.home}
          className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold tracking-[-0.02em] mb-1">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-[14px] text-[#888] mb-3">{collection.description}</p>
          )}
          <div className="flex items-center gap-4 text-[12px] text-[#999]">
            <span>By {(collection as unknown as { user: { display_name: string | null; username: string } }).user?.display_name || (collection as unknown as { user: { username: string } }).user?.username}</span>
            <span>&middot; {designs.length} design{designs.length !== 1 ? 's' : ''}</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e8e8e8] bg-white text-[11px] font-[family-name:var(--font-syne)] font-bold cursor-pointer hover:border-[#0a0a0a] transition-colors"
              >
                <Share2 size={11} /> {copied ? 'Copied!' : 'Share'}
              </button>
              {isOwner && (
                <button
                  onClick={async () => { await deleteCollection(id); window.location.href = ROUTES.home; }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e8e8e8] bg-white text-[11px] font-[family-name:var(--font-syne)] font-bold cursor-pointer hover:border-[#E8001A] hover:text-[#E8001A] transition-colors"
                >
                  <Trash2 size={11} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Designs grid */}
        {designs.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-[32px] mb-3">📌</div>
            <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">No designs in this collection yet</div>
          </div>
        ) : (
          <MasonryGrid>
            {designs.map((design, i) => (
              <MasonryItem key={design.id}>
                <div className="relative group/col">
                  <DesignCard
                    design={design}
                    height={CARD_HEIGHTS[i % CARD_HEIGHTS.length]}
                    onOpen={() => window.location.href = ROUTES.design(design.id)}
                  />
                  {isOwner && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(design.id); }}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 border border-[#e8e8e8] flex items-center justify-center cursor-pointer opacity-0 group-hover/col:opacity-100 transition-opacity hover:bg-[#fef2f2] hover:border-[#E8001A]"
                    >
                      <Trash2 size={11} className="text-[#999]" />
                    </button>
                  )}
                </div>
              </MasonryItem>
            ))}
          </MasonryGrid>
        )}
      </main>
      <Footer />
    </>
  );
}
