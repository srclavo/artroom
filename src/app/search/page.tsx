'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DesignCard } from '@/components/marketplace/DesignCard';
import { MasonryGrid, MasonryItem } from '@/components/marketplace/MasonryGrid';
import { JobCard } from '@/components/marketplace/JobCard';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { DesignWithCreator } from '@/types/design';
import type { Job } from '@/types/job';

const CARD_HEIGHTS = [200, 260, 220, 280, 240, 310, 230, 250];

interface SearchResults {
  designs: DesignWithCreator[];
  profiles: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    role: string;
    skills: string[];
    is_verified: boolean;
  }[];
  jobs: Job[];
}

const TABS = ['all', 'designs', 'studios', 'jobs'] as const;

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('all');
  const [results, setResults] = useState<SearchResults>({ designs: [], profiles: [], jobs: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ designs: [], profiles: [], jobs: [] });
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const type = activeTab === 'studios' ? 'studios' : activeTab;
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch {
        // Search failed
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [query, activeTab]);

  const totalCount = results.designs.length + results.profiles.length + results.jobs.length;

  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Header */}
        <div className="px-7 pt-10 pb-6 border-b border-[#e8e8e8]">
          <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] mb-2">
            Search Results
          </div>
          <h1 className="font-[family-name:var(--font-syne)] text-[clamp(22px,3.5vw,36px)] font-extrabold tracking-[-0.02em]">
            {query ? `"${query}"` : 'Search ArtRoom'}
          </h1>
          {!loading && query && (
            <p className="text-[13px] text-[#999] mt-1">
              {totalCount} result{totalCount !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="px-7 py-3 border-b border-[#e8e8e8] flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-4 py-[7px] rounded-full border-none cursor-pointer transition-all',
                activeTab === tab
                  ? 'bg-[#0a0a0a] text-white'
                  : 'bg-[#f5f5f5] text-[#999] hover:bg-[#e8e8e8]'
              )}
            >
              {tab}
              {tab === 'designs' && results.designs.length > 0 && ` (${results.designs.length})`}
              {tab === 'studios' && results.profiles.length > 0 && ` (${results.profiles.length})`}
              {tab === 'jobs' && results.jobs.length > 0 && ` (${results.jobs.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Searching...</div>
          </div>
        ) : !query ? (
          <div className="py-20 text-center">
            <div className="text-[32px] mb-3">🔍</div>
            <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">Start typing to search</div>
          </div>
        ) : totalCount === 0 ? (
          <div className="py-20 text-center">
            <div className="text-[32px] mb-3">🤷</div>
            <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">No results found</div>
            <p className="text-[12px] text-[#ccc]">Try different keywords or browse the gallery</p>
          </div>
        ) : (
          <div className="px-7 py-6">
            {/* Designs */}
            {(activeTab === 'all' || activeTab === 'designs') && results.designs.length > 0 && (
              <div className="mb-10">
                {activeTab === 'all' && (
                  <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
                    Designs ({results.designs.length})
                  </h2>
                )}
                <MasonryGrid>
                  {results.designs.map((design, i) => (
                    <MasonryItem key={design.id}>
                      <DesignCard
                        design={design}
                        height={CARD_HEIGHTS[i % CARD_HEIGHTS.length]}
                        onOpen={() => window.location.href = ROUTES.design(design.id)}
                      />
                    </MasonryItem>
                  ))}
                </MasonryGrid>
              </div>
            )}

            {/* Studios / Profiles */}
            {(activeTab === 'all' || activeTab === 'studios') && results.profiles.length > 0 && (
              <div className="mb-10">
                {activeTab === 'all' && (
                  <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
                    Studios ({results.profiles.length})
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.profiles.map((profile) => (
                    <Link key={profile.id} href={ROUTES.studio(profile.username)} className="no-underline">
                      <div className="flex items-center gap-3 p-4 border border-[#e8e8e8] rounded-[12px] hover:border-[#0a0a0a] transition-colors cursor-pointer">
                        <div className="w-11 h-11 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#999]">
                              {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a] flex items-center gap-1">
                            {profile.display_name || profile.username}
                            {profile.is_verified && <span className="text-[10px]">✓</span>}
                          </div>
                          <div className="text-[11px] text-[#999] truncate">
                            {profile.bio || `@${profile.username}`}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Jobs */}
            {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
              <div className="mb-10">
                {activeTab === 'all' && (
                  <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
                    Jobs ({results.jobs.length})
                  </h2>
                )}
                <div className="border border-[#e8e8e8] rounded-[12px] overflow-hidden">
                  {results.jobs.map((job) => (
                    <Link key={job.id} href={ROUTES.job(job.id)} className="no-underline">
                      <JobCard job={job} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
