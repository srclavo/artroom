'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JobCard } from '@/components/marketplace/JobCard';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Job } from '@/types/job';

const FILTER_TYPES = [
  { id: 'all', label: 'All', color: '#0a0a0a', tc: '#fff' },
  { id: 'full-time', label: 'Full-time', color: '#1B4FE8', tc: '#fff' },
  { id: 'freelance', label: 'Freelance', color: '#1A7A3C', tc: '#fff' },
  { id: 'contract', label: 'Contract', color: '#FF5F1F', tc: '#fff' },
  { id: 'part-time', label: 'Part-time', color: '#FFE500', tc: '#0a0a0a' },
];

// Mock jobs data
const MOCK_JOBS: Job[] = [
  { id: 'j1', company_id: 'c1', title: 'Senior Brand Designer', description: 'Lead brand design for a fast-growing fintech startup. You will define the visual language, create guidelines, and work closely with marketing and product teams.', company_name: 'Stripe', company_logo_url: null, location: 'San Francisco', job_type: 'full-time', experience_level: 'senior', salary_min: 140000, salary_max: 180000, salary_currency: 'USD', skills_required: ['branding', 'illustration', 'typography'], application_url: '#', is_remote: true, is_featured: true, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j2', company_id: 'c2', title: 'UI/UX Designer', description: 'Design beautiful user interfaces for our SaaS platform. Experience with design systems and component libraries required.', company_name: 'Figma', company_logo_url: null, location: 'Remote', job_type: 'full-time', experience_level: 'mid', salary_min: 100000, salary_max: 140000, salary_currency: 'USD', skills_required: ['ui-ux', 'typography'], application_url: '#', is_remote: true, is_featured: false, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j3', company_id: 'c3', title: 'Freelance Motion Designer', description: 'Create engaging motion graphics and animations for product launches and marketing campaigns.', company_name: 'Vercel', company_logo_url: null, location: 'Remote', job_type: 'freelance', experience_level: 'mid', salary_min: 80, salary_max: 120, salary_currency: 'USD', skills_required: ['motion', '3d'], application_url: '#', is_remote: true, is_featured: false, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j4', company_id: 'c4', title: '3D Artist', description: 'Create 3D product visualizations and brand assets for a leading e-commerce platform.', company_name: 'Shopify', company_logo_url: null, location: 'Toronto', job_type: 'contract', experience_level: 'mid', salary_min: 90000, salary_max: 120000, salary_currency: 'USD', skills_required: ['3d', 'illustration'], application_url: '#', is_remote: false, is_featured: false, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j5', company_id: 'c5', title: 'Illustration Lead', description: 'Lead our illustration team to create a unique visual style for our product and marketing materials.', company_name: 'Notion', company_logo_url: null, location: 'New York', job_type: 'full-time', experience_level: 'lead', salary_min: 150000, salary_max: 200000, salary_currency: 'USD', skills_required: ['illustration', 'branding'], application_url: '#', is_remote: true, is_featured: true, status: 'active', expires_at: null, created_at: '', updated_at: '' },
];

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJobId, setActiveJobId] = useState<string>(MOCK_JOBS[0].id);

  const filteredJobs = useMemo(() => {
    let jobs = MOCK_JOBS;
    if (activeFilter !== 'all') {
      jobs = jobs.filter((j) => j.job_type === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company_name.toLowerCase().includes(q) ||
          j.skills_required.some((s) => s.toLowerCase().includes(q))
      );
    }
    return jobs;
  }, [activeFilter, searchQuery]);

  const activeJob = MOCK_JOBS.find((j) => j.id === activeJobId) ?? MOCK_JOBS[0];

  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Hero */}
        <div className="px-7 py-10 max-w-4xl">
          <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#E8001A] mb-2 flex items-center gap-2">
            <span className="w-4 h-[1.5px] bg-[#E8001A]" />
            Jobs & Gigs
          </div>
          <h1 className="font-[family-name:var(--font-syne)] text-[clamp(30px,5vw,52px)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-3">
            Your portfolio gets you hired.
          </h1>
          <p className="text-[14px] text-[#888] leading-[1.75] max-w-[460px] mb-5">
            Companies post roles, you apply with your ArtRoom portfolio. Your Studio, skills, and work speak for you.
          </p>
          <div className="flex gap-2">
            <Button>Open My Studio →</Button>
            <Button variant="outline">Post a Job</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-[#e8e8e8]">
          {[
            { n: '680', l: 'Open Roles' },
            { n: '240+', l: 'Companies' },
            { n: '$40–$200k', l: 'Pay Range' },
            { n: '72%', l: 'Remote / Hybrid' },
          ].map((s) => (
            <div key={s.l} className="p-5 text-center border-r border-[#e8e8e8] last:border-r-0">
              <div className="font-[family-name:var(--font-syne)] text-[26px] font-extrabold">
                {s.n}
              </div>
              <div className="text-[11px] text-[#999] uppercase tracking-[0.08em]">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="px-7 py-4 border-b border-[#e8e8e8] flex flex-wrap items-center gap-3">
          <SearchBar
            placeholder="Search roles, companies, skills..."
            onSearch={setSearchQuery}
            className="flex-1 min-w-[200px] max-w-md"
          />
          <div className="flex gap-1.5">
            {FILTER_TYPES.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em]',
                  'px-4 py-[7px] rounded-full border-none cursor-pointer whitespace-nowrap',
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

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* Job list */}
          <div>
            <div className="px-7 py-3 text-[11px] text-[#999]">
              {filteredJobs.length} positions
            </div>
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isActive={job.id === activeJobId}
                onClick={() => setActiveJobId(job.id)}
              />
            ))}
          </div>

          {/* Job detail */}
          <div className="hidden lg:block border-l border-[#e8e8e8] p-7 sticky top-14 max-h-[calc(100vh-56px-50px)] overflow-y-auto">
            <div className="text-[24px] mb-3">
              {activeJob.company_logo_url ?? '🏢'}
            </div>
            <h2 className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold mb-2">
              {activeJob.title}
            </h2>
            <div className="text-[12px] text-[#999] mb-4 flex flex-wrap gap-x-3">
              <span>🏢 {activeJob.company_name}</span>
              <span>📍 {activeJob.location ?? 'Remote'}</span>
              {activeJob.salary_max && (
                <span>
                  💰 ${Math.round((activeJob.salary_min ?? 0) / 1000)}k–${Math.round(activeJob.salary_max / 1000)}k
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {activeJob.skills_required.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>

            <Button className="w-full mb-2">
              Apply with Portfolio →
            </Button>
            <p className="text-[10px] text-[#bbb] mb-6">
              Your ArtRoom Studio, AI Skills, and portfolio are automatically attached when you apply.
            </p>

            <div className="border-t border-[#f0f0f0] pt-4">
              <h3 className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.1em] text-[#999] mb-3">
                About the Role
              </h3>
              <p className="text-[13px] leading-[1.8] text-[#555]">
                {activeJob.description}
              </p>
            </div>
          </div>
        </div>

        {/* Post job banner */}
        <div className="mx-7 mb-8 mt-8 bg-[#0a0a0a] rounded-[12px] p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.1em] text-white/50 mb-2">
              For Companies
            </div>
            <div className="font-[family-name:var(--font-syne)] text-[24px] font-extrabold text-white mb-1">
              Find talent with verified skills
            </div>
            <p className="text-[13px] text-white/55 leading-[1.65]">
              Post roles and connect with creators who have verified portfolios and AI skills.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white hover:text-[#0a0a0a]"
          >
            Post a Role →
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
