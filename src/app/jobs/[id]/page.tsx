'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/marketplace/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { Job } from '@/types/job';

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const { toggleSaveJob, isJobSaved } = useJobs();
  const supabase = createClient();
  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setJob(data as unknown as Job);

        // Fetch similar jobs by skills
        const skills = (data as unknown as Job).skills_required;
        if (skills.length > 0) {
          const { data: similar } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'active')
            .neq('id', id)
            .overlaps('skills_required', skills)
            .limit(3);
          setSimilarJobs((similar ?? []) as unknown as Job[]);
        }
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPay = (j: Job) => {
    if (!j.salary_max) return null;
    if (j.salary_max > 1000) {
      return `$${Math.round((j.salary_min ?? 0) / 1000)}k – $${Math.round(j.salary_max / 1000)}k / year`;
    }
    return `$${j.salary_min} – $${j.salary_max} / hour`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-content max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <main className="page-content max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="text-[32px] mb-3">🔍</div>
            <div className="font-[family-name:var(--font-syne)] text-[16px] font-bold text-[#999] mb-2">Job not found</div>
            <Link href={ROUTES.jobs} className="text-[13px] text-[#0a0a0a] underline">Browse all jobs</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-content max-w-4xl mx-auto px-6 py-8">
        <Link
          href={ROUTES.jobs}
          className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
        >
          <ArrowLeft size={16} /> All Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main content */}
          <div className="bg-white border border-[#e8e8e8] rounded-[12px] p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-[14px] border border-[#e8e8e8] flex items-center justify-center text-[28px] flex-shrink-0">
                {job.company_logo_url ? (
                  <img src={job.company_logo_url} alt={job.company_name} className="w-full h-full object-contain rounded-[14px]" />
                ) : '🏢'}
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-syne)] text-[26px] font-extrabold tracking-[-0.02em] mb-1">
                  {job.title}
                </h1>
                <div className="text-[14px] text-[#888]">{job.company_name}</div>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-1.5 text-[12px] text-[#666] bg-[#f5f5f5] px-3 py-1.5 rounded-full">
                <Briefcase size={12} /> {job.job_type}
              </div>
              {job.experience_level && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#666] bg-[#f5f5f5] px-3 py-1.5 rounded-full">
                  <Clock size={12} /> {job.experience_level}
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#666] bg-[#f5f5f5] px-3 py-1.5 rounded-full">
                  <MapPin size={12} /> {job.location}
                </div>
              )}
              {job.is_remote && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-full">
                  Remote
                </div>
              )}
              {formatPay(job) && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#666] bg-[#f5f5f5] px-3 py-1.5 rounded-full">
                  <DollarSign size={12} /> {formatPay(job)}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbb] mb-2.5">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_required.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#f0f0f0] pt-6">
              <h3 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-3">
                About the Role
              </h3>
              <div className="text-[14px] leading-[1.85] text-[#555] whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#e8e8e8] rounded-[12px] p-5">
              {job.application_url ? (
                <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <Button className="w-full mb-3" size="lg">Apply Now &rarr;</Button>
                </a>
              ) : (
                <Button className="w-full mb-3" size="lg">Apply with Portfolio &rarr;</Button>
              )}

              <div className="flex gap-2">
                {user && (
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] border text-[11px] font-[family-name:var(--font-syne)] font-bold cursor-pointer transition-all',
                      isJobSaved(job.id)
                        ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                        : 'border-[#e8e8e8] bg-white text-[#666] hover:border-[#0a0a0a]'
                    )}
                  >
                    <Bookmark size={12} fill={isJobSaved(job.id) ? 'white' : 'none'} />
                    {isJobSaved(job.id) ? 'Saved' : 'Save'}
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] border border-[#e8e8e8] bg-white text-[#666] text-[11px] font-[family-name:var(--font-syne)] font-bold cursor-pointer hover:border-[#0a0a0a] transition-all"
                >
                  <Share2 size={12} />
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#999]">Posted</span>
                  <span className="text-[#444]">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {job.expires_at && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#999]">Expires</span>
                    <span className="text-[#444]">{new Date(job.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-syne)] text-[16px] font-bold mb-4">Similar Jobs</h2>
            <div className="border border-[#e8e8e8] rounded-[12px] overflow-hidden">
              {similarJobs.map((sj) => (
                <Link key={sj.id} href={ROUTES.job(sj.id)} className="no-underline">
                  <JobCard job={sj} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
