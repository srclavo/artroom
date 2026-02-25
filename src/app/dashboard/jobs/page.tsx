'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { Job } from '@/types/job';

const STATUS_STYLES: Record<string, { bg: string; tc: string }> = {
  active: { bg: '#f0fdf4', tc: '#16a34a' },
  draft: { bg: '#fef9c3', tc: '#92400e' },
  closed: { bg: '#fef2f2', tc: '#dc2626' },
};

export default function DashboardJobsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'applied' | 'hiring'>('applied');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyJobs = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', user.id)
        .order('created_at', { ascending: false });
      setJobs((data ?? []) as unknown as Job[]);
      setLoading(false);
    };
    fetchMyJobs();
  }, [user]);

  const updateStatus = async (jobId: string, status: 'active' | 'closed' | 'draft') => {
    await supabase.from('jobs').update({ status } as never).eq('id', jobId);
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status } : j));
  };

  const deleteJob = async (jobId: string) => {
    await supabase.from('jobs').delete().eq('id', jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold">My Jobs</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#e8e8e8] mb-6">
        <button
          onClick={() => setActiveTab('applied')}
          className={cn(
            'px-5 py-2.5 font-[family-name:var(--font-syne)] text-[12px] font-bold transition-all border-b-2 -mb-[1px] cursor-pointer bg-transparent',
            activeTab === 'applied'
              ? 'border-[#0a0a0a] text-[#0a0a0a]'
              : 'border-transparent text-[#999] hover:text-[#666]'
          )}
        >
          Applied
        </button>
        <button
          onClick={() => setActiveTab('hiring')}
          className={cn(
            'px-5 py-2.5 font-[family-name:var(--font-syne)] text-[12px] font-bold transition-all border-b-2 -mb-[1px] cursor-pointer bg-transparent',
            activeTab === 'hiring'
              ? 'border-[#0a0a0a] text-[#0a0a0a]'
              : 'border-transparent text-[#999] hover:text-[#666]'
          )}
        >
          Hiring
        </button>
      </div>

      {/* Applied Tab */}
      {activeTab === 'applied' && (
        <div className="py-12 text-center">
          <div className="text-[32px] mb-3 opacity-30">📋</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
            No applications yet
          </div>
          <p className="text-[12px] text-[#ccc] mb-4">
            Find opportunities and apply to jobs posted by studios and brands.
          </p>
          <Link href="/jobs">
            <Button size="sm">Browse Jobs</Button>
          </Link>
        </div>
      )}

      {/* Hiring Tab */}
      {activeTab === 'hiring' && (
        <>
          <div className="flex justify-end mb-4">
            <Link href={ROUTES.jobPost}>
              <Button size="sm">Post New Job</Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[13px] text-[#999]">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-[32px] mb-3 opacity-30">💼</div>
              <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
                No jobs posted yet
              </div>
              <p className="text-[12px] text-[#ccc] mb-4">
                Post a job listing to find talented creators for your projects.
              </p>
              <Link href={ROUTES.jobPost}>
                <Button size="sm">Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="border border-[#e8e8e8] rounded-[12px] overflow-hidden">
              {jobs.map((job) => {
                const style = STATUS_STYLES[job.status] ?? STATUS_STYLES.draft;
                return (
                  <div key={job.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#0a0a0a] mb-0.5 truncate">
                        {job.title}
                      </div>
                      <div className="text-[11px] text-[#999]">
                        {job.company_name} &middot; {job.location ?? 'Remote'} &middot; {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <Badge color={style.bg} textColor={style.tc}>{job.status}</Badge>
                    <div className="flex gap-1.5">
                      <Link href={ROUTES.job(job.id)}>
                        <button className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#0a0a0a] transition-colors">
                          <Eye size={13} className="text-[#999]" />
                        </button>
                      </Link>
                      {job.status === 'active' ? (
                        <button
                          onClick={() => updateStatus(job.id, 'closed')}
                          className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#ff4625] transition-colors"
                          title="Close job"
                        >
                          <Pencil size={13} className="text-[#999]" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(job.id, 'active')}
                          className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#16a34a] transition-colors"
                          title="Reactivate"
                        >
                          <RotateCcw size={13} className="text-[#999]" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="w-8 h-8 rounded-lg border border-[#e8e8e8] bg-white flex items-center justify-center cursor-pointer hover:border-[#ff4625] hover:bg-[#fef2f2] transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-[#999]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
