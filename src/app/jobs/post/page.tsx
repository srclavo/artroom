'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'gig'] as const;
const EXP_LEVELS = ['junior', 'mid', 'senior', 'lead'] as const;
const SKILL_OPTIONS = ['branding', 'illustration', 'typography', 'ui-ux', '3d', 'motion', 'photography', 'packaging', 'editorial', 'web-design'];

export default function PostJobPage() {
  const { user } = useAuth();
  const { createJob } = useJobs();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    company_name: '',
    location: '',
    job_type: 'full-time' as typeof JOB_TYPES[number],
    experience_level: 'mid' as typeof EXP_LEVELS[number],
    salary_min: '',
    salary_max: '',
    application_url: '',
    is_remote: false,
    skills_required: [] as string[],
    status: 'active' as 'active' | 'draft',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills_required: prev.skills_required.includes(skill)
        ? prev.skills_required.filter((s) => s !== skill)
        : [...prev.skills_required, skill],
    }));
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!user) return;
    if (!form.title.trim() || !form.description.trim() || !form.company_name.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createJob({
        title: form.title,
        description: form.description,
        company_name: form.company_name,
        location: form.location || null,
        job_type: form.job_type,
        experience_level: form.experience_level,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        application_url: form.application_url || null,
        is_remote: form.is_remote,
        skills_required: form.skills_required,
        status: asDraft ? 'draft' : 'active',
      });
      router.push(ROUTES.dashboardJobs);
    } catch {
      setError('Failed to create job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="page-content max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="text-[32px] mb-3">🔒</div>
          <div className="font-[family-name:var(--font-syne)] text-[16px] font-bold mb-2">Sign in to post a job</div>
          <Link href={ROUTES.login} className="text-[13px] text-[#0a0a0a] underline">Log in</Link>
        </main>
        <Footer />
      </>
    );
  }

  const inputClass = 'w-full border border-[#e5e5e5] rounded-[8px] px-3.5 py-2.5 font-[family-name:var(--font-dm-sans)] text-[13px] outline-none focus:border-[#0a0a0a] transition-colors';
  const labelClass = 'block mb-1.5 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb]';

  return (
    <>
      <Navbar />
      <main className="page-content max-w-2xl mx-auto px-6 py-8">
        <Link
          href={ROUTES.jobs}
          className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
        >
          <ArrowLeft size={16} /> Back to Jobs
        </Link>

        <h1 className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold tracking-[-0.02em] mb-2">
          Post a Job
        </h1>
        <p className="text-[14px] text-[#999] mb-8">Find the best creative talent on ArtRoom.</p>

        {!preview ? (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Job Title *</label>
              <input className={inputClass} placeholder="e.g. Senior Brand Designer" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Company Name *</label>
              <input className={inputClass} placeholder="Your company name" value={form.company_name} onChange={(e) => updateField('company_name', e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Job Type</label>
              <div className="flex gap-1.5 flex-wrap">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => updateField('job_type', t)}
                    className={cn(
                      'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer transition-all',
                      form.job_type === t
                        ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                        : 'border-[#e8e8e8] bg-white text-[#999] hover:border-[#0a0a0a]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Experience Level</label>
              <div className="flex gap-1.5 flex-wrap">
                {EXP_LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => updateField('experience_level', l)}
                    className={cn(
                      'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer transition-all',
                      form.experience_level === l
                        ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                        : 'border-[#e8e8e8] bg-white text-[#999] hover:border-[#0a0a0a]'
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea className={cn(inputClass, 'min-h-[160px] resize-y')} placeholder="Describe the role, responsibilities, requirements..." value={form.description} onChange={(e) => updateField('description', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Location</label>
                <input className={inputClass} placeholder="City or Remote" value={form.location} onChange={(e) => updateField('location', e.target.value)} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_remote} onChange={(e) => updateField('is_remote', e.target.checked)} className="w-4 h-4 accent-[#0a0a0a]" />
                  <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold">Remote friendly</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Salary Min</label>
                <input type="number" className={inputClass} placeholder="e.g. 80000" value={form.salary_min} onChange={(e) => updateField('salary_min', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Salary Max</label>
                <input type="number" className={inputClass} placeholder="e.g. 120000" value={form.salary_max} onChange={(e) => updateField('salary_max', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Skills Required</label>
              <div className="flex gap-1.5 flex-wrap">
                {SKILL_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className={cn(
                      'font-[family-name:var(--font-syne)] text-[10px] font-bold px-3.5 py-[6px] rounded-full border cursor-pointer transition-all',
                      form.skills_required.includes(s)
                        ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                        : 'border-[#e8e8e8] bg-white text-[#999] hover:border-[#0a0a0a]'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Application URL</label>
              <input type="url" className={inputClass} placeholder="https://your-company.com/careers/apply" value={form.application_url} onChange={(e) => updateField('application_url', e.target.value)} />
            </div>

            {error && (
              <div className="text-[12px] text-[#E8001A] font-[family-name:var(--font-syne)] font-bold">{error}</div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={() => setPreview(true)} variant="outline" className="flex-1">Preview</Button>
              <Button onClick={() => handleSubmit(true)} variant="outline" disabled={submitting}>Save as Draft</Button>
              <Button onClick={() => handleSubmit(false)} disabled={submitting} className="flex-1">
                {submitting ? 'Publishing...' : 'Publish Job →'}
              </Button>
            </div>
          </div>
        ) : (
          /* Preview */
          <div>
            <div className="bg-white border border-[#e8e8e8] rounded-[12px] p-8 mb-6">
              <div className="text-[28px] mb-2">🏢</div>
              <h2 className="font-[family-name:var(--font-syne)] text-[24px] font-extrabold mb-1">{form.title || 'Job Title'}</h2>
              <div className="text-[14px] text-[#888] mb-4">{form.company_name} &middot; {form.location || 'Remote'}</div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#f5f5f5] text-[11px] text-[#666]">{form.job_type}</span>
                <span className="px-3 py-1 rounded-full bg-[#f5f5f5] text-[11px] text-[#666]">{form.experience_level}</span>
                {form.is_remote && <span className="px-3 py-1 rounded-full bg-[#f0fdf4] text-[11px] text-[#16a34a]">Remote</span>}
                {form.salary_max && <span className="px-3 py-1 rounded-full bg-[#f5f5f5] text-[11px] text-[#666]">${form.salary_min}–${form.salary_max}</span>}
              </div>
              {form.skills_required.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {form.skills_required.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white text-[10px] font-[family-name:var(--font-syne)] font-bold">{s}</span>
                  ))}
                </div>
              )}
              <div className="border-t border-[#f0f0f0] pt-4 text-[14px] leading-[1.8] text-[#555] whitespace-pre-wrap">
                {form.description || 'Job description...'}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setPreview(false)} variant="outline" className="flex-1">Edit</Button>
              <Button onClick={() => handleSubmit(false)} disabled={submitting} className="flex-1">
                {submitting ? 'Publishing...' : 'Publish Job →'}
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
