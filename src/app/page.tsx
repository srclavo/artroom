'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FilterTabs } from '@/components/marketplace/FilterTabs';
import { ArtOfTheWeek } from '@/components/marketplace/ArtOfTheWeek';
import { MasonryGrid, MasonryItem } from '@/components/marketplace/MasonryGrid';
import { DesignCard } from '@/components/marketplace/DesignCard';
import { DesignViewer } from '@/components/marketplace/DesignViewer';
import { StudioCard } from '@/components/marketplace/StudioCard';
import { PortfolioCard } from '@/components/marketplace/PortfolioCard';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { useDesigns } from '@/hooks/useDesigns';
import { createClient } from '@/lib/supabase/client';
import type { DesignWithCreator } from '@/types/design';
import type { StudioProfile } from '@/types/user';
import type { Database } from '@/types/database';

type PortfolioWithCreator = Database['public']['Tables']['portfolios']['Row'] & {
  creator: { username: string; display_name: string | null };
};

const CARD_HEIGHTS = [200, 260, 220, 280, 240, 310, 230, 250, 270, 190, 300, 210, 240, 280, 220, 260];

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'all');
  const [viewerDesign, setViewerDesign] = useState<DesignWithCreator | null>(null);
  const [studios, setStudios] = useState<StudioProfile[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioWithCreator[]>([]);
  const [studiosLoading, setStudiosLoading] = useState(false);
  const [portfoliosLoading, setPortfoliosLoading] = useState(false);
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  const category = useMemo(() => {
    if (activeTab === 'all' || activeTab === 'studios' || activeTab === 'portfolios') return undefined;
    return activeTab;
  }, [activeTab]);

  const { designs, loading: designsLoading } = useDesigns({ category, limit: 40 });

  const supabase = createClient();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) setActiveTab(tab);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch studios when tab is active
  useEffect(() => {
    if (activeTab !== 'studios') return;
    const fetchStudios = async () => {
      setStudiosLoading(true);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'creator')
        .limit(12);

      if (profiles) {
        // Get follower counts and design counts for each profile
        const rows = profiles as unknown as StudioProfile[];
        const studioProfiles: StudioProfile[] = await Promise.all(
          rows.map(async (p) => {
            const [followRes, designRes] = await Promise.all([
              supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', p.id),
              supabase.from('designs').select('*', { count: 'exact', head: true }).eq('creator_id', p.id).eq('status', 'published'),
            ]);
            return {
              ...p,
              follower_count: followRes.count ?? 0,
              design_count: designRes.count ?? 0,
              total_earnings: 0,
            };
          })
        );
        setStudios(studioProfiles);
      }
      setStudiosLoading(false);
    };
    fetchStudios();
  }, [activeTab]);

  // Fetch portfolios when tab is active
  useEffect(() => {
    if (activeTab !== 'portfolios') return;
    const fetchPortfolios = async () => {
      setPortfoliosLoading(true);
      const { data } = await supabase
        .from('portfolios')
        .select(`
          *,
          creator:profiles!portfolios_creator_id_fkey (
            username, display_name
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setPortfolios(data as unknown as PortfolioWithCreator[]);
      }
      setPortfoliosLoading(false);
    };
    fetchPortfolios();
  }, [activeTab]);

  const showDesigns = activeTab !== 'studios' && activeTab !== 'portfolios';
  const showStudios = activeTab === 'studios';
  const showPortfolios = activeTab === 'portfolios';

  const handleBuy = (design: DesignWithCreator) => {
    openPayment({
      itemName: design.title,
      itemPrice: design.price,
      creatorUsername: design.creator.username,
      designId: design.id,
    });
  };

  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Art of the Week */}
        <ArtOfTheWeek />

        {/* Filter Tabs */}
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Designs Grid */}
        {showDesigns && (
          designsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading designs...</div>
            </div>
          ) : designs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-[32px] mb-3">🎨</div>
              <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">No designs yet</div>
              <div className="text-[12px] text-[#ccc] mt-1">Be the first to upload!</div>
            </div>
          ) : (
            <MasonryGrid className="mt-4">
              {designs.map((design, i) => (
                <MasonryItem key={design.id}>
                  <DesignCard
                    design={design}
                    height={CARD_HEIGHTS[i % CARD_HEIGHTS.length]}
                    onOpen={(d) => setViewerDesign(d)}
                    onBuy={handleBuy}
                  />
                </MasonryItem>
              ))}
            </MasonryGrid>
          )
        )}

        {/* Studios Grid */}
        {showStudios && (
          studiosLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading studios...</div>
            </div>
          ) : studios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-[32px] mb-3">🏠</div>
              <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">No studios yet</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 px-5 mt-4 pb-6">
              {studios.map((studio) => (
                <StudioCard key={studio.id} studio={studio} />
              ))}
            </div>
          )
        )}

        {/* Portfolios Grid */}
        {showPortfolios && (
          portfoliosLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading portfolios...</div>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-[32px] mb-3">📁</div>
              <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">No portfolios yet</div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-2.5 px-5 mt-4 pb-6">
              {portfolios.map((portfolio, i) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  height={CARD_HEIGHTS[i % CARD_HEIGHTS.length]}
                  onBuy={(p) =>
                    openPayment({
                      itemName: p.title,
                      itemPrice: p.price,
                      creatorUsername: p.creator.username,
                      portfolioId: p.id,
                    })
                  }
                />
              ))}
            </div>
          )
        )}
      </main>

      <Footer />

      {/* Design Viewer Modal */}
      <DesignViewer
        design={viewerDesign}
        isOpen={!!viewerDesign}
        onClose={() => setViewerDesign(null)}
        onBuy={(d) => {
          setViewerDesign(null);
          handleBuy(d);
        }}
      />

      <PaymentModal
        isOpen={isOpen}
        onClose={closePayment}
        paymentIntent={paymentIntent}
      />
    </>
  );
}
