'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // TODO: Fetch from Supabase
  const job = {
    id,
    title: 'Senior Brand Designer',
    company_name: 'Stripe',
    location: 'San Francisco',
    is_remote: true,
    job_type: 'full-time' as const,
    salary_min: 140000,
    salary_max: 180000,
    description:
      'Lead brand design for a fast-growing fintech startup. You will define the visual language, create guidelines, and work closely with marketing and product teams to deliver cohesive brand experiences across all touchpoints.',
    skills_required: ['branding', 'illustration', 'typography'],
  };

  return (
    <>
      <Navbar />
      <main className="page-content max-w-3xl mx-auto px-6 py-8">
        <Link
          href={ROUTES.jobs}
          className="inline-flex items-center gap-2 text-[13px] font-[family-name:var(--font-syne)] font-bold text-[#0a0a0a] no-underline hover:opacity-60 transition-opacity mb-6"
        >
          <ArrowLeft size={16} /> All Jobs
        </Link>

        <div className="bg-white border border-[#e8e8e8] rounded-[12px] p-8">
          <div className="text-[32px] mb-3">🏢</div>
          <h1 className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold mb-2">
            {job.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-[13px] text-[#888] mb-4">
            <span>{job.company_name}</span>
            <span>· {job.location}</span>
            <span>· {job.is_remote ? 'Remote' : 'On-site'}</span>
            <span>· ${Math.round(job.salary_min / 1000)}k–${Math.round(job.salary_max / 1000)}k</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {job.skills_required.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>

          <Button className="w-full mb-6" size="lg">
            Apply with Portfolio →
          </Button>

          <div className="border-t border-[#f0f0f0] pt-6">
            <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-3">
              About the Role
            </h2>
            <p className="text-[14px] leading-[1.8] text-[#555]">
              {job.description}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
