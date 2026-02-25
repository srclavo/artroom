'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Bookmark, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { cn, formatPrice } from '@/lib/utils';
import { CATEGORY_MAP } from '@/constants/categories';
import type { Database } from '@/types/database';

type Design = Database['public']['Tables']['designs']['Row'];
type Job = Database['public']['Tables']['jobs']['Row'];

type WishlistTab = 'gallery' | 'skills' | 'jobs';

export default function DashboardWishlistPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<WishlistTab>('gallery');

  // Gallery (liked designs)
  const [likedDesigns, setLikedDesigns] = useState<Design[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);

  // Jobs (saved jobs)
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Fetch liked designs
  useEffect(() => {
    if (!user) return;
    const fetchLiked = async () => {
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('design_id')
        .eq('user_id', user.id);

      if (likesError) {
        console.error('[Wishlist] Fetch likes error:', likesError.message);
        setLoadingDesigns(false);
        return;
      }

      if (!likes || likes.length === 0) {
        setLikedDesigns([]);
        setLoadingDesigns(false);
        return;
      }

      const designIds = (likes as unknown as { design_id: string }[]).map((l) => l.design_id);

      const { data: designs, error: designsError } = await supabase
        .from('designs')
        .select('*')
        .in('id', designIds)
        .order('created_at', { ascending: false });

      if (designsError) {
        console.error('[Wishlist] Fetch designs error:', designsError.message);
      }

      setLikedDesigns((designs ?? []) as Design[]);
      setLoadingDesigns(false);
    };
    fetchLiked();
  }, [user]);

  // Fetch saved jobs
  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      const { data: saved, error: savedError } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);

      if (savedError) {
        console.error('[Wishlist] Fetch saved jobs error:', savedError.message);
        setLoadingJobs(false);
        return;
      }

      if (!saved || saved.length === 0) {
        setSavedJobs([]);
        setLoadingJobs(false);
        return;
      }

      const jobIds = (saved as unknown as { job_id: string }[]).map((s) => s.job_id);

      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .in('id', jobIds)
        .order('created_at', { ascending: false });

      if (jobsError) {
        console.error('[Wishlist] Fetch jobs error:', jobsError.message);
      }

      setSavedJobs((jobs ?? []) as Job[]);
      setLoadingJobs(false);
    };
    fetchSaved();
  }, [user]);

  // Unlike design
  const unlikeDesign = async (designId: string) => {
    if (!user) return;
    await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('design_id', designId);
    setLikedDesigns((prev) => prev.filter((d) => d.id !== designId));
  };

  // Unsave job
  const unsaveJob = async (jobId: string) => {
    if (!user) return;
    await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', user.id)
      .eq('job_id', jobId);
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const JOB_TYPE_LABELS: Record<string, string> = {
    'full-time': 'Full-Time',
    'part-time': 'Part-Time',
    contract: 'Contract',
    freelance: 'Freelance',
    gig: 'Gig',
  };

  const TABS: { id: WishlistTab; label: string; count: number }[] = [
    { id: 'gallery', label: 'Gallery', count: likedDesigns.length },
    { id: 'skills', label: 'Skills', count: 0 },
    { id: 'jobs', label: 'Jobs', count: savedJobs.length },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Wishlist
      </h1>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#e8e8e8] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-2.5 font-[family-name:var(--font-syne)] text-[12px] font-bold transition-all border-b-2 -mb-[1px] cursor-pointer bg-transparent flex items-center gap-2',
              activeTab === tab.id
                ? 'border-[#0a0a0a] text-[#0a0a0a]'
                : 'border-transparent text-[#999] hover:text-[#666]'
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                activeTab === tab.id
                  ? 'bg-[#0a0a0a] text-white'
                  : 'bg-[#f0f0f0] text-[#999]'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ Gallery Tab — Liked Designs ═══ */}
      {activeTab === 'gallery' && (
        <>
          {loadingDesigns ? (
            <div className="py-12 text-center text-[13px] text-[#999]">Loading...</div>
          ) : likedDesigns.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-[40px] mb-3 opacity-30">{'\u2661'}</div>
              <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
                No liked designs yet
              </div>
              <p className="text-[12px] text-[#ccc] mb-4">
                Like designs in the gallery and they&apos;ll appear here.
              </p>
              <Link href="/gallery">
                <Button size="sm">Browse Gallery</Button>
              </Link>
            </div>
          ) : (
            <div className="border border-[#e8e8e8] rounded-[12px] overflow-hidden">
              {likedDesigns.map((design) => {
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
                      <Link
                        href={`/design/${design.id}`}
                        className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#0a0a0a] mb-0.5 truncate block no-underline hover:underline"
                      >
                        {design.title}
                      </Link>
                      <div className="text-[11px] text-[#999]">
                        {catMeta?.label ?? design.category} &middot;{' '}
                        {new Date(design.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a] w-16 text-right">
                      {design.price > 0 ? formatPrice(design.price) : 'Free'}
                    </div>

                    {/* Unlike */}
                    <button
                      onClick={() => unlikeDesign(design.id)}
                      className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#ff4625] hover:bg-[#fef2f2] transition-colors"
                      title="Remove from wishlist"
                    >
                      <Heart size={13} className="text-[#ff4625] fill-[#ff4625]" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ Skills Tab — Saved Skills ═══ */}
      {activeTab === 'skills' && (
        <div className="py-12 text-center">
          <div className="text-[40px] mb-3 opacity-30">{'\uD83E\uDDE0'}</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
            No saved skills yet
          </div>
          <p className="text-[12px] text-[#ccc] mb-4">
            Browse and save AI skills from the Skill Vault.
          </p>
          <Link href="/skills">
            <Button size="sm">Browse Skills</Button>
          </Link>
        </div>
      )}

      {/* ═══ Jobs Tab — Saved Jobs ═══ */}
      {activeTab === 'jobs' && (
        <>
          {loadingJobs ? (
            <div className="py-12 text-center text-[13px] text-[#999]">Loading...</div>
          ) : savedJobs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-[40px] mb-3 opacity-30">{'\uD83D\uDCBC'}</div>
              <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
                No saved jobs yet
              </div>
              <p className="text-[12px] text-[#ccc] mb-4">
                Save jobs you&apos;re interested in and they&apos;ll appear here.
              </p>
              <Link href="/jobs">
                <Button size="sm">Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="border border-[#e8e8e8] rounded-[12px] overflow-hidden">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
                >
                  {/* Company logo */}
                  <div className="w-10 h-10 rounded-lg bg-[#f0f0f0] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {job.company_logo_url ? (
                      <img src={job.company_logo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-[family-name:var(--font-syne)] text-[14px] font-extrabold text-[#ccc]">
                        {job.company_name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#0a0a0a] mb-0.5 truncate block no-underline hover:underline"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-[#999]">
                      <span>{job.company_name}</span>
                      {job.location && (
                        <>
                          <span>&middot;</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin size={9} />
                            {job.location}
                          </span>
                        </>
                      )}
                      <span>&middot;</span>
                      <span className="flex items-center gap-0.5">
                        <Clock size={9} />
                        {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
                      </span>
                    </div>
                  </div>

                  {/* Salary */}
                  {(job.salary_min || job.salary_max) && (
                    <div className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#0a0a0a] hidden sm:block">
                      {job.salary_min && job.salary_max
                        ? `$${(job.salary_min / 1000).toFixed(0)}k\u2013$${(job.salary_max / 1000).toFixed(0)}k`
                        : job.salary_min
                        ? `From $${(job.salary_min / 1000).toFixed(0)}k`
                        : `Up to $${((job.salary_max ?? 0) / 1000).toFixed(0)}k`}
                    </div>
                  )}

                  {/* Status */}
                  <Badge
                    color={job.status === 'active' ? '#f0fdf4' : '#fef2f2'}
                    textColor={job.status === 'active' ? '#16a34a' : '#dc2626'}
                  >
                    {job.status}
                  </Badge>

                  {/* Unsave */}
                  <button
                    onClick={() => unsaveJob(job.id)}
                    className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#ff4625] hover:bg-[#fef2f2] transition-colors"
                    title="Remove from wishlist"
                  >
                    <Bookmark size={13} className="text-[#999] fill-[#999]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
