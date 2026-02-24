'use client';

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Job } from '@/types/job';
import { CATEGORY_MAP } from '@/constants/categories';

interface JobCardProps {
  job: Job;
  isActive?: boolean;
  onClick?: () => void;
}

const JOB_TYPE_COLORS: Record<string, { bg: string; tc: string }> = {
  'full-time': { bg: '#1B4FE8', tc: '#fff' },
  freelance: { bg: '#1A7A3C', tc: '#fff' },
  contract: { bg: '#FF5F1F', tc: '#fff' },
  'part-time': { bg: '#FFE500', tc: '#0a0a0a' },
};

export function JobCard({ job, isActive, onClick }: JobCardProps) {
  const typeColor = JOB_TYPE_COLORS[job.job_type] ?? { bg: '#f5f5f5', tc: '#0a0a0a' };

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_auto] gap-3 p-4 cursor-pointer transition-all duration-200 border-b border-[#f0f0f0]',
        'hover:bg-[#fafafa]',
        isActive && 'border-l-[3px] border-l-[#0a0a0a] pl-[13px] bg-[#fafafa]'
      )}
      onClick={onClick}
    >
      {/* Logo */}
      <div className="w-11 h-11 rounded-[11px] border border-[#e8e8e8] bg-white flex items-center justify-center text-[20px] flex-shrink-0">
        {job.company_logo_url ? (
          <img
            src={job.company_logo_url}
            alt={job.company_name}
            className="w-full h-full object-contain rounded-[11px]"
          />
        ) : (
          '🏢'
        )}
      </div>

      {/* Content */}
      <div className="min-w-0">
        <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#0a0a0a] mb-0.5 line-clamp-1">
          {job.title}
        </div>
        <div className="text-[12px] text-[#999] mb-2">
          {job.company_name} · {job.location ?? 'Remote'} · {job.is_remote ? 'Remote' : 'On-site'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {job.skills_required.slice(0, 4).map((skill) => {
            const cat = CATEGORY_MAP[skill];
            return (
              <Badge
                key={skill}
                color={cat?.color ?? '#f5f5f5'}
                textColor={cat?.textColor ?? '#666'}
              >
                {cat?.label ?? skill}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5">
        {job.salary_max && (
          <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a]">
            ${Math.round(job.salary_min ?? 0 / 1000)}k–${Math.round(job.salary_max / 1000)}k
          </span>
        )}
        <Badge color={typeColor.bg} textColor={typeColor.tc}>
          {job.job_type}
        </Badge>
      </div>
    </div>
  );
}
