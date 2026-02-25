'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Job, JobInsert, JobUpdate } from '@/types/job';

export interface JobFilters {
  search?: string;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  salaryMin?: number;
  skills?: string[];
  sort?: 'newest' | 'salary' | 'relevant';
}

export function useJobs(filters?: JobFilters) {
  const supabase = createClient();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

      if (filters?.jobType && filters.jobType !== 'all') {
        query = query.eq('job_type', filters.jobType);
      }
      if (filters?.experienceLevel && filters.experienceLevel !== 'all') {
        query = query.eq('experience_level', filters.experienceLevel);
      }
      if (filters?.isRemote) {
        query = query.eq('is_remote', true);
      }
      if (filters?.salaryMin) {
        query = query.gte('salary_min', filters.salaryMin);
      }
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters?.sort === 'salary') {
        query = query.order('salary_max', { ascending: false, nullsFirst: false });
      } else {
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      }

      const { data } = await query.limit(50);
      setJobs((data ?? []) as unknown as Job[]);
    } catch (err) {
      console.error('[useJobs] Unexpected error:', err);
      setJobs([]);
    }
    setLoading(false);
  }, [filters?.search, filters?.jobType, filters?.experienceLevel, filters?.isRemote, filters?.salaryMin, filters?.sort]);

  // Fetch saved job IDs
  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      try {
        const { data } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);
        if (data) {
          setSavedJobIds(new Set((data as unknown as { job_id: string }[]).map((r) => r.job_id)));
        }
      } catch (err) {
        console.error('[useJobs] fetchSaved error:', err);
      }
    };
    fetchSaved();
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const getJob = useCallback(async (id: string) => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    return data as unknown as Job | null;
  }, []);

  const createJob = useCallback(async (jobData: Omit<JobInsert, 'company_id'>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('jobs')
      .insert({ ...jobData, company_id: user.id } as never)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Job;
  }, [user]);

  const updateJob = useCallback(async (id: string, updates: JobUpdate) => {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Job;
  }, []);

  const toggleSaveJob = useCallback(async (jobId: string) => {
    if (!user) return;
    const isSaved = savedJobIds.has(jobId);
    if (isSaved) {
      await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    } else {
      await supabase
        .from('saved_jobs')
        .insert({ user_id: user.id, job_id: jobId } as never);
      setSavedJobIds((prev) => new Set(prev).add(jobId));
    }
  }, [user, savedJobIds]);

  const isJobSaved = useCallback((jobId: string) => savedJobIds.has(jobId), [savedJobIds]);

  return {
    jobs,
    loading,
    fetchJobs,
    getJob,
    createJob,
    updateJob,
    toggleSaveJob,
    isJobSaved,
    savedJobIds,
  };
}
