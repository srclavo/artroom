'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FilterTabs } from '@/components/marketplace/FilterTabs';
import { MasonryGrid, MasonryItem } from '@/components/marketplace/MasonryGrid';
import { DesignCard } from '@/components/marketplace/DesignCard';
import { StudioCard } from '@/components/marketplace/StudioCard';
import { PortfolioCard } from '@/components/marketplace/PortfolioCard';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import type { DesignWithCreator } from '@/types/design';
import type { StudioProfile } from '@/types/user';
import type { Database } from '@/types/database';

type PortfolioWithCreator = Database['public']['Tables']['portfolios']['Row'] & {
  creator: { username: string; display_name: string | null };
};

// Mock data — replace with real Supabase queries
const MOCK_DESIGNS: DesignWithCreator[] = [
  { id: '1', creator_id: 'u1', title: 'Lumis Brand Kit', description: 'Complete brand identity system', price: 129, currency: 'USD', category: 'branding', subcategory: null, tags: ['brand', 'identity'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 2400, download_count: 180, like_count: 847, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u1', username: 'maya', display_name: 'Maya Chen', avatar_url: null, is_verified: true } },
  { id: '2', creator_id: 'u2', title: 'Stellar UI System', description: '200+ components', price: 199, currency: 'USD', category: 'ui-ux', subcategory: null, tags: ['ui', 'system'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1800, download_count: 95, like_count: 561, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u2', username: 'james', display_name: 'James Rivera', avatar_url: null, is_verified: true } },
  { id: '3', creator_id: 'u3', title: 'Neue Display', description: 'Modern display typeface', price: 49, currency: 'USD', category: 'typography', subcategory: null, tags: ['type', 'display'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'personal', view_count: 3200, download_count: 420, like_count: 312, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u3', username: 'kira', display_name: 'Kira Tanaka', avatar_url: null, is_verified: false } },
  { id: '4', creator_id: 'u4', title: 'Motion Kit Pro', description: 'After Effects templates', price: 89, currency: 'USD', category: 'motion', subcategory: null, tags: ['motion', 'ae'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1100, download_count: 63, like_count: 210, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u4', username: 'alex', display_name: 'Alex Storm', avatar_url: null, is_verified: true } },
  { id: '5', creator_id: 'u1', title: 'Coastal Illustrations', description: 'Hand-drawn illustration pack', price: 59, currency: 'USD', category: 'illustration', subcategory: null, tags: ['illustration'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'personal', view_count: 890, download_count: 45, like_count: 178, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u1', username: 'maya', display_name: 'Maya Chen', avatar_url: null, is_verified: true } },
  { id: '6', creator_id: 'u5', title: 'Geo 3D Shapes', description: 'Abstract 3D shapes collection', price: 79, currency: 'USD', category: '3d', subcategory: null, tags: ['3d', 'abstract'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1500, download_count: 88, like_count: 345, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u5', username: 'orion', display_name: 'Orion Vale', avatar_url: null, is_verified: false } },
  { id: '7', creator_id: 'u2', title: 'Dashboard Templates', description: 'Admin dashboard kit', price: 149, currency: 'USD', category: 'ui-ux', subcategory: null, tags: ['dashboard', 'admin'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'extended', view_count: 2100, download_count: 134, like_count: 490, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u2', username: 'james', display_name: 'James Rivera', avatar_url: null, is_verified: true } },
  { id: '8', creator_id: 'u3', title: 'Serif Collection', description: 'Premium serif font family', price: 39, currency: 'USD', category: 'typography', subcategory: null, tags: ['type', 'serif'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'personal', view_count: 670, download_count: 28, like_count: 98, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u3', username: 'kira', display_name: 'Kira Tanaka', avatar_url: null, is_verified: false } },
];

const MOCK_STUDIOS: StudioProfile[] = [
  { id: 'u1', username: 'maya', display_name: 'Maya Chen', bio: 'Brand designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['branding', 'illustration'], is_verified: true, created_at: '', updated_at: '', follower_count: 12400, design_count: 42, total_earnings: 4800 },
  { id: 'u2', username: 'james', display_name: 'James Rivera', bio: 'UI/UX designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['ui-ux', 'template'], is_verified: true, created_at: '', updated_at: '', follower_count: 8900, design_count: 28, total_earnings: 9200 },
  { id: 'u3', username: 'kira', display_name: 'Kira Tanaka', bio: 'Type designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['typography'], is_verified: false, created_at: '', updated_at: '', follower_count: 5600, design_count: 15, total_earnings: 2100 },
  { id: 'u4', username: 'alex', display_name: 'Alex Storm', bio: 'Motion designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['motion', '3d'], is_verified: true, created_at: '', updated_at: '', follower_count: 3200, design_count: 19, total_earnings: 3400 },
  { id: 'u5', username: 'orion', display_name: 'Orion Vale', bio: '3D artist', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['3d', 'illustration'], is_verified: false, created_at: '', updated_at: '', follower_count: 1800, design_count: 11, total_earnings: 1200 },
  { id: 'u6', username: 'nova', display_name: 'Nova Kim', bio: 'Brand strategist', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['branding', 'typography'], is_verified: true, created_at: '', updated_at: '', follower_count: 7100, design_count: 33, total_earnings: 6700 },
];

const MOCK_PORTFOLIOS: PortfolioWithCreator[] = [
  { id: 'p1', creator_id: 'u1', title: 'Fintech App Redesign', description: null, price: 89, thumbnail_url: '', preview_urls: [], category: 'ui-ux', tags: ['fintech', 'app'], view_count: 340, status: 'published', created_at: '', updated_at: '', creator: { username: 'maya', display_name: 'Maya Chen' } },
  { id: 'p2', creator_id: 'u2', title: 'E-commerce Brand System', description: null, price: 149, thumbnail_url: '', preview_urls: [], category: 'branding', tags: ['ecommerce', 'brand'], view_count: 560, status: 'published', created_at: '', updated_at: '', creator: { username: 'james', display_name: 'James Rivera' } },
  { id: 'p3', creator_id: 'u3', title: 'Editorial Layout System', description: null, price: 69, thumbnail_url: '', preview_urls: [], category: 'typography', tags: ['editorial', 'layout'], view_count: 210, status: 'published', created_at: '', updated_at: '', creator: { username: 'kira', display_name: 'Kira Tanaka' } },
  { id: 'p4', creator_id: 'u4', title: 'Animated Logo Pack', description: null, price: 59, thumbnail_url: '', preview_urls: [], category: 'motion', tags: ['logo', 'animation'], view_count: 180, status: 'published', created_at: '', updated_at: '', creator: { username: 'alex', display_name: 'Alex Storm' } },
  { id: 'p5', creator_id: 'u5', title: '3D Icon Collection', description: null, price: 99, thumbnail_url: '', preview_urls: [], category: '3d', tags: ['3d', 'icons'], view_count: 420, status: 'published', created_at: '', updated_at: '', creator: { username: 'orion', display_name: 'Orion Vale' } },
  { id: 'p6', creator_id: 'u6', title: 'SaaS Landing Page', description: null, price: 119, thumbnail_url: '', preview_urls: [], category: 'ui-ux', tags: ['saas', 'landing'], view_count: 690, status: 'published', created_at: '', updated_at: '', creator: { username: 'nova', display_name: 'Nova Kim' } },
];

const CARD_HEIGHTS = [200, 260, 220, 280, 240, 310, 230, 250];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  const filteredDesigns = useMemo(() => {
    if (activeTab === 'all' || activeTab === 'studios' || activeTab === 'portfolios') {
      return MOCK_DESIGNS;
    }
    return MOCK_DESIGNS.filter((d) => d.category === activeTab);
  }, [activeTab]);

  const showDesigns = activeTab !== 'studios' && activeTab !== 'portfolios';
  const showStudios = activeTab === 'studios';
  const showPortfolios = activeTab === 'portfolios';

  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Filter Tabs */}
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Designs Grid */}
        {showDesigns && (
          <MasonryGrid className="mt-4">
            {filteredDesigns.map((design, i) => (
              <MasonryItem key={design.id}>
                <DesignCard
                  design={design}
                  height={CARD_HEIGHTS[i % CARD_HEIGHTS.length]}
                  onBuy={(d) =>
                    openPayment({
                      itemName: d.title,
                      itemPrice: d.price,
                      creatorUsername: d.creator.username,
                      designId: d.id,
                    })
                  }
                />
              </MasonryItem>
            ))}
          </MasonryGrid>
        )}

        {/* Studios Grid */}
        {showStudios && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 px-7 mt-4">
            {MOCK_STUDIOS.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        )}

        {/* Portfolios Grid */}
        {showPortfolios && (
          <div className="columns-1 md:columns-2 xl:columns-3 gap-2.5 px-7 mt-4">
            {MOCK_PORTFOLIOS.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                height={CARD_HEIGHTS[(MOCK_PORTFOLIOS.indexOf(portfolio)) % CARD_HEIGHTS.length]}
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
        )}
      </main>

      <Footer />

      <PaymentModal
        isOpen={isOpen}
        onClose={closePayment}
        paymentIntent={paymentIntent}
      />
    </>
  );
}
