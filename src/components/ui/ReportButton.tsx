'use client';

import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ReportButtonProps {
  reportedType: 'design' | 'user' | 'review' | 'job';
  reportedId: string;
  className?: string;
}

const REASONS = [
  { id: 'spam', label: 'Spam' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'copyright', label: 'Copyright violation' },
  { id: 'other', label: 'Other' },
] as const;

export function ReportButton({ reportedType, reportedId, className }: ReportButtonProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_type: reportedType,
      reported_id: reportedId,
      reason,
      description: description || null,
    } as never);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => { setOpen(false); setSubmitted(false); setReason(''); setDescription(''); }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-1 text-[10px] text-[#ccc] bg-transparent border-none cursor-pointer hover:text-[#E8001A] transition-colors',
          className
        )}
      >
        <Flag size={10} /> Report
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[700] bg-black/30" onClick={() => setOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[701] w-[360px] max-w-[90vw] bg-white rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0]">
              <span className="font-[family-name:var(--font-syne)] text-[14px] font-bold">Report {reportedType}</span>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full border border-[#e8e8e8] bg-transparent flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5] transition-colors">
                <X size={12} />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="text-[24px] mb-2">✓</div>
                <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#1A7A3C]">Report submitted</div>
                <p className="text-[11px] text-[#999] mt-1">Thank you. We&apos;ll review this shortly.</p>
              </div>
            ) : (
              <div className="p-5">
                <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb] mb-2.5">Reason</div>
                <div className="flex flex-col gap-1.5 mb-4">
                  {REASONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      className={cn(
                        'text-left px-3.5 py-2.5 rounded-[8px] border text-[12px] cursor-pointer transition-all',
                        reason === r.id
                          ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                          : 'border-[#e8e8e8] bg-white text-[#555] hover:border-[#0a0a0a]'
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#bbb] mb-2">Details (optional)</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any additional details..."
                  className="w-full border border-[#e8e8e8] rounded-[8px] px-3.5 py-2.5 text-[12px] outline-none min-h-[60px] resize-y focus:border-[#0a0a0a] transition-colors font-[family-name:var(--font-dm-sans)]"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!reason || submitting}
                  className={cn(
                    'mt-3 w-full py-2.5 rounded-full font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] border-none cursor-pointer transition-all',
                    reason
                      ? 'bg-[#E8001A] text-white hover:bg-[#c5001a]'
                      : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                  )}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
