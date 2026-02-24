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
  { id: 'gig', label: 'Gig', color: '#FF5F1F', tc: '#fff' },
  { id: 'remote', label: 'Remote', color: '#FFE500', tc: '#0a0a0a' },
];

const TALENT_CARDS = [
  { name: 'Maya Chen', role: 'Brand Designer', av: 'M', bg: '#FFB3C6', tc: '#0a0a0a', match: '96%' },
  { name: 'James Park', role: 'UI/UX Designer', av: 'J', bg: '#1B4FE8', tc: '#fff', match: '92%' },
  { name: 'Kai Dubois', role: 'Illustrator', av: 'K', bg: '#FF5F1F', tc: '#fff', match: '88%' },
  { name: 'Seb Laurent', role: 'Type Designer', av: 'S', bg: '#7B3FA0', tc: '#fff', match: '94%' },
];

const MOCK_JOBS: Job[] = [
  { id: 'j1', company_id: 'c1', title: 'Senior Brand Designer', description: 'Lead brand design for a fast-growing fintech startup. You will define the visual language, create guidelines, and work closely with marketing and product teams.', company_name: 'Stripe', company_logo_url: null, location: 'San Francisco · Remote', job_type: 'full-time', experience_level: 'senior', salary_min: 140000, salary_max: 180000, salary_currency: 'USD', skills_required: ['branding', 'illustration', 'typography'], application_url: '#', is_remote: true, is_featured: true, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j2', company_id: 'c2', title: 'UI/UX Designer', description: 'Design beautiful user interfaces for our SaaS platform. Experience with design systems and component libraries required.', company_name: 'Figma', company_logo_url: null, location: 'Remote', job_type: 'full-time', experience_level: 'mid', salary_min: 100000, salary_max: 140000, salary_currency: 'USD', skills_required: ['ui-ux', 'typography'], application_url: '#', is_remote: true, is_featured: false, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j3', company_id: 'c3', title: 'Freelance Motion Designer', description: 'Create engaging motion graphics and animations for product launches and marketing campaigns.', company_name: 'Vercel', company_logo_url: null, location: 'Remote', job_type: 'freelance', experience_level: 'mid', salary_min: 80, salary_max: 120, salary_currency: 'USD', skills_required: ['motion', '3d'], application_url: '#', is_remote: true, is_featured: false, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j4', company_id: 'c4', title: '3D Artist', description: 'Create 3D product visualizations and brand assets for a leading e-commerce platform.', company_name: 'Shopify', company_logo_url: null, location: 'Toronto', job_type: 'full-time', experience_level: 'mid', salary_min: 90000, salary_max: 120000, salary_currency: 'USD', skills_required: ['3d', 'illustration'], application_url: '#', is_remote: false, is_featured: false, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j5', company_id: 'c5', title: 'Illustration Lead', description: 'Lead our illustration team to create a unique visual style for our product and marketing materials.', company_name: 'Notion', company_logo_url: null, location: 'New York · Hybrid', job_type: 'full-time', experience_level: 'lead', salary_min: 150000, salary_max: 200000, salary_currency: 'USD', skills_required: ['illustration', 'branding'], application_url: '#', is_remote: true, is_featured: true, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j6', company_id: 'c6', title: 'Brand Identity Gig', description: 'Design a complete brand identity for a health-tech startup. Logo, color palette, guidelines, and social templates.', company_name: 'MedFlow', company_logo_url: null, location: 'Remote', job_type: 'gig', experience_level: 'mid', salary_min: 3000, salary_max: 5000, salary_currency: 'USD', skills_required: ['branding', 'typography'], application_url: '#', is_remote: true, is_featured: false, status: 'active', expires_at: null, created_at: '', updated_at: '' },
  { id: 'j7', company_id: 'c7', title: 'Product Designer', description: 'Join our growing design team to shape the future of creative tools. Full-stack design from research to shipping.', company_name: 'Linear', company_logo_url: null, location: 'Remote', job_type: 'full-time', experience_level: 'senior', salary_min: 160000, salary_max: 200000, salary_currency: 'USD', skills_required: ['ui-ux', 'branding'], application_url: '#', is_remote: true, is_featured: true, status: 'active', expires_at: null, created_at: '', updated_at: '' },
];

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJobId, setActiveJobId] = useState<string>(MOCK_JOBS[0].id);
  const [showPostModal, setShowPostModal] = useState(false);

  const filteredJobs = useMemo(() => {
    let jobs = MOCK_JOBS;
    if (activeFilter !== 'all') {
      if (activeFilter === 'remote') {
        jobs = jobs.filter((j) => j.is_remote);
      } else {
        jobs = jobs.filter((j) => j.job_type === activeFilter);
      }
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
          {/* Left */}
          <div>
            <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8001A] mb-3.5 flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#E8001A]" />
              Jobs &amp; Gigs
            </div>
            <h1 className="font-[family-name:var(--font-syne)] text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.03em] leading-[1.05] mb-3.5">
              Your portfolio<br />gets you hired.
            </h1>
            <p className="text-[14px] font-light text-[#999] leading-[1.75] max-w-[460px] mb-7">
              Companies post roles, you apply with your ArtRoom portfolio. Your Studio, skills, and work speak for you.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <Button>Open My Studio →</Button>
              <Button variant="outline" onClick={() => setShowPostModal(true)}>Post a Job</Button>
            </div>
          </div>

          {/* Right - Floating talent cards */}
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#e8e8e8]">
          {[
            { n: '680', l: 'Open Roles' },
            { n: '240+', l: 'Companies' },
            { n: '$40–$200k', l: 'Pay Range' },
            { n: '72%', l: 'Remote / Hybrid' },
          ].map((s) => (
            <div key={s.l} className="p-6 text-center border-r border-[#e8e8e8] last:border-r-0">
              <div className="font-[family-name:var(--font-syne)] text-[26px] font-extrabold tracking-[-0.02em]">{s.n}</div>
              <div className="text-[11px] text-[#999] uppercase tracking-[0.1em]">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="px-7 py-4 border-b border-[#e8e8e8] flex flex-wrap items-center gap-2.5">
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

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* Job list */}
          <div className="border-r border-[#e8e8e8]">
            <div className="px-7 py-4 border-b border-[#e8e8e8] flex justify-between items-center">
              <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#999] tracking-[0.04em]">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
              </span>
              <select className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-3.5 py-1.5 rounded-full border border-[#e8e8e8] bg-white appearance-none cursor-pointer outline-none">
                <option>Most Relevant</option>
                <option>Newest</option>
                <option>Highest Pay</option>
              </select>
            </div>
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} isActive={job.id === activeJobId} onClick={() => setActiveJobId(job.id)} />
            ))}
          </div>

          {/* Job detail */}
          <div className="hidden lg:block p-7 sticky top-14 max-h-[calc(100vh-56px-50px)] overflow-y-auto thin-scrollbar">
            <div className="w-[52px] h-[52px] rounded-[13px] border border-[#e8e8e8] flex items-center justify-center text-[24px] mb-3.5">
              🏢
            </div>
            <h2 className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold tracking-[-0.02em] mb-1.5">
              {activeJob.title}
            </h2>
            <div className="text-[12px] text-[#999] mb-3.5 flex flex-wrap gap-x-2.5 gap-y-1">
              <span>🏢 {activeJob.company_name}</span>
              <span>📍 {activeJob.location ?? 'Remote'}</span>
              {activeJob.salary_max && <span>💰 {formatPay(activeJob)}</span>}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeJob.skills_required.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>

            <Button className="w-full mb-2.5">Apply with Portfolio →</Button>
            <p className="text-[11px] text-[#999] text-center leading-[1.6] mb-5">
              Your ArtRoom Studio, AI Skills, and portfolio are automatically attached when you apply.
            </p>

            {/* About the role */}
            <div className="mb-5">
              <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbb] mb-3 flex items-center gap-2.5">
                About the Role
                <span className="flex-1 h-px bg-[#f0f0f0]" />
              </div>
              <p className="text-[13px] font-light leading-[1.8] text-[#444]">
                {activeJob.description}
              </p>
            </div>

            {/* Skill Match */}
            <div className="mb-5">
              <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbb] mb-3 flex items-center gap-2.5">
                Skill Match
                <span className="flex-1 h-px bg-[#f0f0f0]" />
              </div>
              {[
                { name: 'Brand Identity AI', icon: '◎', bg: '#FFB3C6', have: true },
                { name: 'Color System AI', icon: '◈', bg: '#1B4FE8', have: true },
                { name: 'Typography Critique', icon: 'T', bg: '#FFE500', have: false },
              ].map((skill) => (
                <div key={skill.name} className="flex items-center gap-2.5 p-2.5 px-3 rounded-lg border border-[#e8e8e8] mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] flex-shrink-0"
                    style={{ backgroundColor: skill.bg }}
                  >
                    {skill.icon}
                  </div>
                  <div className="text-[12px] font-medium text-[#111] flex-1">{skill.name}</div>
                  {skill.have ? (
                    <span className="font-[family-name:var(--font-dm-mono)] text-[9px] px-2 py-0.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a]">
                      ✓ Installed
                    </span>
                  ) : (
                    <span className="font-[family-name:var(--font-dm-mono)] text-[9px] px-2 py-0.5 rounded-full bg-[#fef9c3] border border-[#fde68a] text-[#92400e] cursor-pointer hover:bg-[#fef08a] transition-colors">
                      Get it →
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Portfolio Matches */}
            <div>
              <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbb] mb-3 flex items-center gap-2.5">
                Portfolio Matches
                <span className="flex-1 h-px bg-[#f0f0f0]" />
              </div>
              {[
                { name: 'Maya Chen', av: 'M', bg: '#FFB3C6', tc: '#0a0a0a', works: '42 works' },
                { name: 'Kai Dubois', av: 'K', bg: '#FF5F1F', tc: '#fff', works: '28 works' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2.5 p-2.5 px-3 rounded-lg border border-[#e8e8e8] mb-2 cursor-pointer hover:border-[#0a0a0a] transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-[family-name:var(--font-syne)] text-[13px] font-bold flex-shrink-0"
                    style={{ backgroundColor: p.bg, color: p.tc }}
                  >
                    {p.av}
                  </div>
                  <div className="text-[12px] font-medium text-[#111] flex-1">{p.name}</div>
                  <span className="text-[10px] text-[#999]">{p.works}</span>
                </div>
              ))}
            </div>
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
          <button
            onClick={() => setShowPostModal(true)}
            className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.08em] px-[26px] py-[13px] rounded-full border-[1.5px] border-white/30 bg-transparent text-white cursor-pointer whitespace-nowrap hover:bg-white hover:text-[#0a0a0a] transition-all"
          >
            Post a Role →
          </button>
        </div>
      </main>

      <Footer />

      {/* Post Job Modal */}
      {showPostModal && (
        <div
          className="fixed inset-0 z-[800] bg-white/92 backdrop-blur-[12px] flex items-center justify-center"
          onClick={() => setShowPostModal(false)}
        >
          <div
            className="bg-white border border-[#e5e5e5] rounded-[10px] w-[560px] max-w-[92vw] max-h-[88vh] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[#e5e5e5] flex justify-between items-center flex-shrink-0">
              <span className="font-[family-name:var(--font-syne)] text-[17px] font-bold">Post a Job</span>
              <button
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-full border border-[#e5e5e5] bg-transparent flex items-center justify-center cursor-pointer text-[14px] hover:bg-[#f0f0f0] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-3.5">
              <div>
                <label className="block mb-1 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb]">Job Title</label>
                <input className="w-full border border-[#e5e5e5] rounded-[6px] px-3.5 py-2.5 font-[family-name:var(--font-dm-sans)] text-[12px] outline-none focus:border-[#0a0a0a] transition-colors" placeholder="e.g. Senior Brand Designer" />
              </div>
              <div>
                <label className="block mb-1 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb]">Company Name</label>
                <input className="w-full border border-[#e5e5e5] rounded-[6px] px-3.5 py-2.5 font-[family-name:var(--font-dm-sans)] text-[12px] outline-none focus:border-[#0a0a0a] transition-colors" placeholder="Your company" />
              </div>
              <div>
                <label className="block mb-1 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb]">Job Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['Full-time', 'Freelance', 'Gig', 'Remote'].map((t) => (
                    <button key={t} className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-4 py-[7px] rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#999] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb]">Description</label>
                <textarea className="w-full border border-[#e5e5e5] rounded-[6px] px-3.5 py-2.5 font-[family-name:var(--font-dm-sans)] text-[12px] outline-none focus:border-[#0a0a0a] transition-colors resize-y min-h-[80px]" placeholder="Describe the role..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb]">Location</label>
                  <input className="w-full border border-[#e5e5e5] rounded-[6px] px-3.5 py-2.5 font-[family-name:var(--font-dm-sans)] text-[12px] outline-none focus:border-[#0a0a0a] transition-colors" placeholder="City or Remote" />
                </div>
                <div>
                  <label className="block mb-1 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb]">Pay Range</label>
                  <input className="w-full border border-[#e5e5e5] rounded-[6px] px-3.5 py-2.5 font-[family-name:var(--font-dm-sans)] text-[12px] outline-none focus:border-[#0a0a0a] transition-colors" placeholder="e.g. $120–180k" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#e5e5e5] flex justify-end gap-2.5 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => setShowPostModal(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setShowPostModal(false)}>Submit →</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
