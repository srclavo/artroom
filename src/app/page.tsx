'use client';

import { useState, useMemo } from 'react';
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
import type { DesignWithCreator } from '@/types/design';
import type { StudioProfile } from '@/types/user';
import type { Database } from '@/types/database';

type PortfolioWithCreator = Database['public']['Tables']['portfolios']['Row'] & {
  creator: { username: string; display_name: string | null };
};

// Mock data — 16 designs
const MOCK_DESIGNS: DesignWithCreator[] = [
  { id: '1', creator_id: 'u1', title: 'Lumis Brand Kit', description: 'Complete brand identity system with logos, colors, and guidelines', price: 129, currency: 'USD', category: 'branding', subcategory: null, tags: ['brand', 'identity', 'minimal'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 2400, download_count: 180, like_count: 847, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u1', username: 'maya', display_name: 'Maya Chen', avatar_url: null, is_verified: true } },
  { id: '2', creator_id: 'u2', title: 'Stellar UI System', description: '200+ components for modern interfaces', price: 199, currency: 'USD', category: 'ui-ux', subcategory: null, tags: ['ui', 'system', 'components'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1800, download_count: 95, like_count: 561, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u2', username: 'james', display_name: 'James Rivera', avatar_url: null, is_verified: true } },
  { id: '3', creator_id: 'u3', title: 'Neue Display', description: 'Modern display typeface with 12 weights', price: 49, currency: 'USD', category: 'typography', subcategory: null, tags: ['type', 'display', 'modern'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'personal', view_count: 3200, download_count: 420, like_count: 312, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u3', username: 'kira', display_name: 'Kira Tanaka', avatar_url: null, is_verified: false } },
  { id: '4', creator_id: 'u4', title: 'Motion Kit Pro', description: 'After Effects templates and transitions', price: 89, currency: 'USD', category: 'motion', subcategory: null, tags: ['motion', 'ae', 'animation'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1100, download_count: 63, like_count: 210, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u4', username: 'alex', display_name: 'Alex Storm', avatar_url: null, is_verified: true } },
  { id: '5', creator_id: 'u1', title: 'Coastal Illustrations', description: 'Hand-drawn illustration pack with 50+ assets', price: 59, currency: 'USD', category: 'illustration', subcategory: null, tags: ['illustration', 'hand-drawn'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'personal', view_count: 890, download_count: 45, like_count: 178, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u1', username: 'maya', display_name: 'Maya Chen', avatar_url: null, is_verified: true } },
  { id: '6', creator_id: 'u5', title: 'Geo 3D Shapes', description: 'Abstract 3D shapes and renders', price: 79, currency: 'USD', category: '3d', subcategory: null, tags: ['3d', 'abstract', 'shapes'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1500, download_count: 88, like_count: 345, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u5', username: 'orion', display_name: 'Orion Vale', avatar_url: null, is_verified: false } },
  { id: '7', creator_id: 'u2', title: 'Dashboard Templates', description: 'Admin dashboard kit with charts and tables', price: 149, currency: 'USD', category: 'ui-ux', subcategory: null, tags: ['dashboard', 'admin', 'charts'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'extended', view_count: 2100, download_count: 134, like_count: 490, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u2', username: 'james', display_name: 'James Rivera', avatar_url: null, is_verified: true } },
  { id: '8', creator_id: 'u3', title: 'Serif Collection', description: 'Premium serif font family', price: 39, currency: 'USD', category: 'typography', subcategory: null, tags: ['type', 'serif', 'elegant'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'personal', view_count: 670, download_count: 28, like_count: 98, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u3', username: 'kira', display_name: 'Kira Tanaka', avatar_url: null, is_verified: false } },
  { id: '9', creator_id: 'u6', title: 'Night Shift Brand', description: 'Dark mode brand identity system', price: 109, currency: 'USD', category: 'branding', subcategory: null, tags: ['brand', 'dark', 'identity'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1800, download_count: 76, like_count: 420, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u6', username: 'nova', display_name: 'Nova Kim', avatar_url: null, is_verified: true } },
  { id: '10', creator_id: 'u4', title: 'Lottie Pack', description: 'Animated Lottie illustrations for web', price: 69, currency: 'USD', category: 'motion', subcategory: null, tags: ['lottie', 'animation', 'web'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 920, download_count: 52, like_count: 189, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u4', username: 'alex', display_name: 'Alex Storm', avatar_url: null, is_verified: true } },
  { id: '11', creator_id: 'u7', title: 'Deep Roots Campaign', description: 'Environmental campaign design kit', price: 99, currency: 'USD', category: 'branding', subcategory: null, tags: ['campaign', 'environmental', 'brand'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1450, download_count: 98, like_count: 356, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u7', username: 'kai', display_name: 'Kai Dubois', avatar_url: null, is_verified: true } },
  { id: '12', creator_id: 'u5', title: 'Crystal Renders', description: 'Premium 3D crystal and glass renders', price: 119, currency: 'USD', category: '3d', subcategory: null, tags: ['3d', 'crystal', 'glass'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 2100, download_count: 110, like_count: 502, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u5', username: 'orion', display_name: 'Orion Vale', avatar_url: null, is_verified: false } },
  { id: '13', creator_id: 'u8', title: 'Forma Type System', description: 'Variable font with optical sizing', price: 79, currency: 'USD', category: 'typography', subcategory: null, tags: ['type', 'variable', 'system'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'commercial', view_count: 1650, download_count: 89, like_count: 278, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u8', username: 'seb', display_name: 'Seb Laurent', avatar_url: null, is_verified: false } },
  { id: '14', creator_id: 'u1', title: 'Signal Work', description: 'Bold editorial design system', price: 159, currency: 'USD', category: 'branding', subcategory: null, tags: ['editorial', 'bold', 'brand'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'extended', view_count: 3100, download_count: 200, like_count: 890, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u1', username: 'maya', display_name: 'Maya Chen', avatar_url: null, is_verified: true } },
  { id: '15', creator_id: 'u7', title: 'Wild Botanicals', description: 'Botanical illustration collection', price: 45, currency: 'USD', category: 'illustration', subcategory: null, tags: ['botanical', 'illustration', 'nature'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'personal', view_count: 780, download_count: 42, like_count: 156, is_featured: false, status: 'published', created_at: '', updated_at: '', creator: { id: 'u7', username: 'kai', display_name: 'Kai Dubois', avatar_url: null, is_verified: true } },
  { id: '16', creator_id: 'u6', title: 'App UI System (Final)', description: 'Complete mobile app UI kit', price: 189, currency: 'USD', category: 'ui-ux', subcategory: null, tags: ['mobile', 'app', 'ui-kit'], thumbnail_url: '', preview_urls: [], file_url: null, file_size: null, file_format: null, license_type: 'extended', view_count: 2900, download_count: 185, like_count: 710, is_featured: true, status: 'published', created_at: '', updated_at: '', creator: { id: 'u6', username: 'nova', display_name: 'Nova Kim', avatar_url: null, is_verified: true } },
];

// 8 studios
const MOCK_STUDIOS: StudioProfile[] = [
  { id: 'u1', username: 'maya', display_name: 'Maya Chen', bio: 'Brand designer & illustrator', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['branding', 'illustration'], is_verified: true, created_at: '', updated_at: '', follower_count: 12400, design_count: 42, total_earnings: 4800 },
  { id: 'u2', username: 'james', display_name: 'James Rivera', bio: 'UI/UX systems designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['ui-ux'], is_verified: true, created_at: '', updated_at: '', follower_count: 8900, design_count: 28, total_earnings: 9200 },
  { id: 'u3', username: 'kira', display_name: 'Kira Tanaka', bio: 'Type designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['typography'], is_verified: false, created_at: '', updated_at: '', follower_count: 5600, design_count: 15, total_earnings: 2100 },
  { id: 'u4', username: 'alex', display_name: 'Alex Storm', bio: 'Motion & 3D', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['motion', '3d'], is_verified: true, created_at: '', updated_at: '', follower_count: 3200, design_count: 19, total_earnings: 3400 },
  { id: 'u5', username: 'orion', display_name: 'Orion Vale', bio: '3D artist & visualizer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['3d', 'illustration'], is_verified: false, created_at: '', updated_at: '', follower_count: 1800, design_count: 11, total_earnings: 1200 },
  { id: 'u6', username: 'nova', display_name: 'Nova Kim', bio: 'Brand strategist & product designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['branding', 'ui-ux'], is_verified: true, created_at: '', updated_at: '', follower_count: 7100, design_count: 33, total_earnings: 6700 },
  { id: 'u7', username: 'kai', display_name: 'Kai Dubois', bio: 'Illustrator & environmental designer', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['illustration', 'branding'], is_verified: true, created_at: '', updated_at: '', follower_count: 4300, design_count: 22, total_earnings: 3800 },
  { id: 'u8', username: 'seb', display_name: 'Seb Laurent', bio: 'Type & lettering artist', avatar_url: null, cover_image_url: null, role: 'creator', wallet_address: null, stripe_account_id: null, website_url: null, social_links: {}, skills: ['typography', 'branding'], is_verified: false, created_at: '', updated_at: '', follower_count: 2900, design_count: 14, total_earnings: 1900 },
];

// 12 portfolios
const MOCK_PORTFOLIOS: PortfolioWithCreator[] = [
  { id: 'p1', creator_id: 'u1', title: 'Fintech App Redesign', description: null, price: 89, thumbnail_url: '', preview_urls: [], category: 'ui-ux', tags: ['fintech', 'app'], view_count: 340, status: 'published', created_at: '', updated_at: '', creator: { username: 'maya', display_name: 'Maya Chen' } },
  { id: 'p2', creator_id: 'u2', title: 'E-commerce Brand System', description: null, price: 149, thumbnail_url: '', preview_urls: [], category: 'branding', tags: ['ecommerce', 'brand'], view_count: 560, status: 'published', created_at: '', updated_at: '', creator: { username: 'james', display_name: 'James Rivera' } },
  { id: 'p3', creator_id: 'u3', title: 'Editorial Layout System', description: null, price: 69, thumbnail_url: '', preview_urls: [], category: 'typography', tags: ['editorial', 'layout'], view_count: 210, status: 'published', created_at: '', updated_at: '', creator: { username: 'kira', display_name: 'Kira Tanaka' } },
  { id: 'p4', creator_id: 'u4', title: 'Animated Logo Pack', description: null, price: 59, thumbnail_url: '', preview_urls: [], category: 'motion', tags: ['logo', 'animation'], view_count: 180, status: 'published', created_at: '', updated_at: '', creator: { username: 'alex', display_name: 'Alex Storm' } },
  { id: 'p5', creator_id: 'u5', title: '3D Icon Collection', description: null, price: 99, thumbnail_url: '', preview_urls: [], category: '3d', tags: ['3d', 'icons'], view_count: 420, status: 'published', created_at: '', updated_at: '', creator: { username: 'orion', display_name: 'Orion Vale' } },
  { id: 'p6', creator_id: 'u6', title: 'SaaS Landing Page', description: null, price: 119, thumbnail_url: '', preview_urls: [], category: 'ui-ux', tags: ['saas', 'landing'], view_count: 690, status: 'published', created_at: '', updated_at: '', creator: { username: 'nova', display_name: 'Nova Kim' } },
  { id: 'p7', creator_id: 'u7', title: 'Eco Branding Suite', description: null, price: 109, thumbnail_url: '', preview_urls: [], category: 'branding', tags: ['eco', 'sustainable'], view_count: 380, status: 'published', created_at: '', updated_at: '', creator: { username: 'kai', display_name: 'Kai Dubois' } },
  { id: 'p8', creator_id: 'u8', title: 'Lettering Portfolio', description: null, price: 49, thumbnail_url: '', preview_urls: [], category: 'typography', tags: ['lettering', 'custom'], view_count: 270, status: 'published', created_at: '', updated_at: '', creator: { username: 'seb', display_name: 'Seb Laurent' } },
  { id: 'p9', creator_id: 'u1', title: 'Startup Rebrand', description: null, price: 179, thumbnail_url: '', preview_urls: [], category: 'branding', tags: ['startup', 'rebrand'], view_count: 520, status: 'published', created_at: '', updated_at: '', creator: { username: 'maya', display_name: 'Maya Chen' } },
  { id: 'p10', creator_id: 'u4', title: 'Product Showreel', description: null, price: 79, thumbnail_url: '', preview_urls: [], category: 'motion', tags: ['showreel', 'product'], view_count: 310, status: 'published', created_at: '', updated_at: '', creator: { username: 'alex', display_name: 'Alex Storm' } },
  { id: 'p11', creator_id: 'u5', title: 'Architectural Renders', description: null, price: 139, thumbnail_url: '', preview_urls: [], category: '3d', tags: ['architecture', 'renders'], view_count: 450, status: 'published', created_at: '', updated_at: '', creator: { username: 'orion', display_name: 'Orion Vale' } },
  { id: 'p12', creator_id: 'u2', title: 'Design System Docs', description: null, price: 89, thumbnail_url: '', preview_urls: [], category: 'ui-ux', tags: ['design-system', 'docs'], view_count: 610, status: 'published', created_at: '', updated_at: '', creator: { username: 'james', display_name: 'James Rivera' } },
];

const CARD_HEIGHTS = [200, 260, 220, 280, 240, 310, 230, 250, 270, 190, 300, 210, 240, 280, 220, 260];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewerDesign, setViewerDesign] = useState<DesignWithCreator | null>(null);
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
          <MasonryGrid className="mt-4">
            {filteredDesigns.map((design, i) => (
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
        )}

        {/* Studios Grid */}
        {showStudios && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 px-5 mt-4 pb-6">
            {MOCK_STUDIOS.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        )}

        {/* Portfolios Grid */}
        {showPortfolios && (
          <div className="columns-1 md:columns-2 xl:columns-3 gap-2.5 px-5 mt-4 pb-6">
            {MOCK_PORTFOLIOS.map((portfolio, i) => (
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
