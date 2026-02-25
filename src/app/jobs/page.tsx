'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JobCard } from '@/components/marketplace/JobCard';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Bookmark } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import type { Job } from '@/types/job';

const FILTER_TYPES = [
  { id: 'all', label: 'All', color: '#0a0a0a', tc: '#fff' },
  { id: 'full-time', label: 'Full-time', color: '#6e87f2', tc: '#fff' },
  { id: 'freelance', label: 'Freelance', color: '#2ec66d', tc: '#fff' },
  { id: 'gig', label: 'Gig', color: '#f07e41', tc: '#fff' },
  { id: 'contract', label: 'Contract', color: '#d5d1ff', tc: '#0a0a0a' },
];

const EXP_LEVELS = [
  { id: 'all', label: 'All Levels' },
  { id: 'junior', label: 'Junior' },
  { id: 'mid', label: 'Mid' },
  { id: 'senior', label: 'Senior' },
  { id: 'lead', label: 'Lead' },
];

const TALENT_CARDS = [
  { name: 'Maya Chen', role: 'Brand Designer', av: 'M', bg: '#ffafd9', tc: '#0a0a0a', match: '96%' },
  { name: 'James Park', role: 'UI/UX Designer', av: 'J', bg: '#6e87f2', tc: '#fff', match: '92%' },
  { name: 'Kai Dubois', role: 'Illustrator', av: 'K', bg: '#f07e41', tc: '#fff', match: '88%' },
  { name: 'Seb Laurent', role: 'Type Designer', av: 'S', bg: '#d5d1ff', tc: '#0a0a0a', match: '94%' },
];

export default function JobsPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [expLevel, setExpLevel] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'salary' | 'relevant'>('relevant');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const { jobs, loading, toggleSaveJob, isJobSaved } = useJobs({
    search: searchQuery || undefined,
    jobType: activeFilter !== 'all' ? activeFilter : undefined,
    experienceLevel: expLevel !== 'all' ? expLevel : undefined,
    isRemote: remoteOnly || undefined,
    sort: sortBy,
  });

  const activeJob = useMemo(() => {
    if (activeJobId) return jobs.find((j) => j.id === activeJobId) ?? jobs[0];
    return jobs[0];
  }, [activeJobId, jobs]);

  const formatPay = (job: Job) => {
    if (!job.salary_max) return '';
    if (job.salary_max > 1000) {
      return `$${Math.round((job.salary_min ?? 0) / 1000)}–${Math.round(job.salary_max / 1000)}k/yr`;
    }
    return `$${job.salary_min}–${job.salary_max}/hr`;
  };

  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-7 pt-[52px] pb-11 border-b border-[#e8e8e8]">
          <div>
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff4625] mb-3.5 flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#ff4625]" />
              Jobs &amp; Gigs
            </div>
            <h1 className="font-[family-name:var(--font-syne)] text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.03em] leading-[1.05] mb-3.5">
              Find your next<br />creative role.
            </h1>
            <p className="text-[14px] font-light text-[#999] leading-[1.75] max-w-[460px] mb-7">
              Companies post roles, you apply with your ArtRoom portfolio. Your Studio, skills, and work speak for you.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <Link href={ROUTES.dashboard}><Button>Open My Studio &rarr;</Button></Link>
              {user && (
                <Link href={ROUTES.jobPost}><Button variant="outline">Post a Job</Button></Link>
              )}
            </div>
          </div>

          {/* Floating talent cards */}
          <div className="relative h-[280px] hidden md:block">
            {TALENT_CARDS.map((card, i) => {
              const positions = [
                { top: '0', left: '0' },
                { top: '65px', right: '0' },
                { bottom: '70px', left: '20px' },
                { bottom: '30px', right: '30px' },
              ];
              const anims = ['animate-float', 'animate-float-slow', 'animate-float-fast', 'animate-float-slower'];
              return (
                <div
                  key={card.name}
                  className={cn('absolute flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-[#e8e8e8] rounded-[10px] shadow-[0_4px_18px_rgba(0,0,0,0.07)]', anims[i])}
                  style={{ ...positions[i] as React.CSSProperties, animationDelay: `${i * 0.7}s` }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-[family-name:var(--font-syne)] text-[14px] font-bold flex-shrink-0"
                    style={{ backgroundColor: card.bg, color: card.tc }}
                  >
                    {card.av}
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#111]">{card.name}</div>
                    <div className="text-[10px] text-[#999]">{card.role}</div>
                  </div>
                  <div className="font-[family-name:var(--font-dm-mono)] text-[10px] px-2 py-0.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] ml-2 flex-shrink-0">
                    {card.match}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="px-7 py-4 border-b border-[#e8e8e8]">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <SearchBar placeholder="Search roles, companies, skills..." onSearch={setSearchQuery} className="flex-1 min-w-[200px] max-w-md" />
            <div className="flex gap-1.5">
              {FILTER_TYPES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em]',
                    'px-4 py-[7px] rounded-full border-none cursor-pointer whitespace-nowrap flex-shrink-0',
                    'transition-all hover:opacity-[0.78] active:scale-[0.95]',
                    activeFilter !== f.id && activeFilter !== 'all' && 'opacity-[0.28]'
                  )}
                  style={{ backgroundColor: f.color, color: f.tc }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              {EXP_LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setExpLevel(l.id)}
                  className={cn(
                    'font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.06em] px-3 py-1.5 rounded-full border cursor-pointer transition-all',
                    expLevel === l.id
                      ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                      : 'border-[#e8e8e8] bg-white text-[#999] hover:border-[#0a0a0a]'
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={cn(
                'font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.06em] px-3 py-1.5 rounded-full border cursor-pointer transition-all',
                remoteOnly
                  ? 'border-[#2ec66d] bg-[#f0fdf4] text-[#2ec66d]'
                  : 'border-[#e8e8e8] bg-white text-[#999] hover:border-[#0a0a0a]'
              )}
            >
              Remote Only
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* Job list */}
          <div className="border-r border-[#e8e8e8]">
            <div className="px-7 py-4 border-b border-[#e8e8e8] flex justify-between items-center">
              <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#999] tracking-[0.04em]">
                {loading ? '...' : `${jobs.length} position${jobs.length !== 1 ? 's' : ''}`}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-3.5 py-1.5 rounded-full border border-[#e8e8e8] bg-white appearance-none cursor-pointer outline-none"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest</option>
                <option value="salary">Highest Pay</option>
              </select>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading jobs...</div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-[32px] mb-3">🔍</div>
                <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-1">No jobs found</div>
                <div className="text-[12px] text-[#ccc]">Try adjusting your filters</div>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} isActive={job.id === (activeJob?.id)} onClick={() => setActiveJobId(job.id)} />
              ))
            )}
          </div>

          {/* Job detail sidebar */}
          <div className="hidden lg:block p-7 sticky top-14 max-h-[calc(100vh-56px-50px)] overflow-y-auto thin-scrollbar">
            {activeJob ? (
              <>
                <div className="w-[52px] h-[52px] rounded-[13px] border border-[#e8e8e8] flex items-center justify-center text-[24px] mb-3.5">
                  {activeJob.company_logo_url ? (
                    <img src={activeJob.company_logo_url} alt={activeJob.company_name} className="w-full h-full object-contain rounded-[13px]" />
                  ) : '🏢'}
                </div>
                <h2 className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold tracking-[-0.02em] mb-1.5">
                  {activeJob.title}
                </h2>
                <div className="text-[12px] text-[#999] mb-3.5 flex flex-wrap gap-x-2.5 gap-y-1">
                  <span>{activeJob.company_name}</span>
                  <span>&middot; {activeJob.location ?? 'Remote'}</span>
                  {activeJob.salary_max && <span>&middot; {formatPay(activeJob)}</span>}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {activeJob.skills_required.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                  {activeJob.is_remote && <Badge color="#f0fdf4" textColor="#16a34a">Remote</Badge>}
                  {activeJob.experience_level && (
                    <Badge color="#f5f5f5" textColor="#666">{activeJob.experience_level}</Badge>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  {activeJob.application_url ? (
                    <a href={activeJob.application_url} target="_blank" rel="noopener noreferrer" className="flex-1 no-underline">
                      <Button className="w-full">Apply Now &rarr;</Button>
                    </a>
                  ) : (
                    <Button className="flex-1">Apply with Portfolio &rarr;</Button>
                  )}
                  {user && (
                    <button
                      onClick={() => toggleSaveJob(activeJob.id)}
                      className={cn(
                        'w-10 h-10 rounded-[10px] border flex items-center justify-center cursor-pointer transition-all',
                        isJobSaved(activeJob.id)
                          ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                          : 'border-[#e8e8e8] bg-white text-[#999] hover:border-[#0a0a0a]'
                      )}
                    >
                      <Bookmark size={14} fill={isJobSaved(activeJob.id) ? 'white' : 'none'} />
                    </button>
                  )}
                </div>

                {/* About the role */}
                <div className="mb-5">
                  <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbb] mb-3 flex items-center gap-2.5">
                    About the Role
                    <span className="flex-1 h-px bg-[#f0f0f0]" />
                  </div>
                  <p className="text-[13px] font-light leading-[1.8] text-[#444] whitespace-pre-wrap">
                    {activeJob.description}
                  </p>
                </div>

                {activeJob.expires_at && (
                  <div className="text-[10px] text-[#bbb] mt-3">
                    Expires: {new Date(activeJob.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-[#ccc]">
                <div className="text-[24px] mb-2">👈</div>
                <div className="text-[12px]">Select a job to see details</div>
              </div>
            )}
          </div>
        </div>

        {/* Post job banner */}
        <div className="mx-7 mb-8 mt-8 bg-[#0a0a0a] rounded-[12px] p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.2em] text-[#bbb] mb-2.5">
              For Companies
            </div>
            <div className="font-[family-name:var(--font-syne)] text-[22px] font-extrabold tracking-[-0.02em] text-white mb-2">
              Find talent with verified skills
            </div>
            <p className="text-[13px] text-white/50 leading-[1.65] max-w-[400px]">
              Post roles and connect with creators who have verified portfolios and AI skills.
            </p>
          </div>
          <Link href={ROUTES.jobPost} className="no-underline">
            <button className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.08em] px-[26px] py-[13px] rounded-full border-[1.5px] border-white/30 bg-transparent text-white cursor-pointer whitespace-nowrap hover:bg-white hover:text-[#0a0a0a] transition-all">
              Post a Role &rarr;
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
