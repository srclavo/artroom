'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface HireTarget {
  creatorId: string;
  creatorUsername: string;
  creatorDisplayName: string | null;
  portfolioTitle: string;
}

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: HireTarget | null;
}

export function HireModal({ isOpen, onClose, target }: HireModalProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen || !target) return null;

  const handleSend = async () => {
    if (!user || !message.trim()) return;
    setSending(true);

    // Send notification to creator
    await supabase.from('notifications').insert({
      user_id: target.creatorId,
      type: 'system' as const,
      title: `New hire inquiry from ${user.user_metadata?.username || 'a buyer'}`,
      message: message.trim(),
      data: {
        type: 'hire_request',
        sender_id: user.id,
        sender_username: user.user_metadata?.username || '',
        portfolio_title: target.portfolioTitle,
        budget: budget || null,
      },
    } as never);

    setSending(false);
    setSent(true);
  };

  const handleClose = () => {
    setMessage('');
    setBudget('');
    setSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] w-[90vw] max-w-[440px] mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-[18px] font-bold">
              Hire {target.creatorDisplayName || target.creatorUsername}
            </h2>
            <p className="text-[12px] text-[#999] mt-0.5">
              Re: {target.portfolioTitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e8e8e8] bg-transparent cursor-pointer hover:bg-[#f5f5f5] transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {!user ? (
          /* Not logged in */
          <div className="px-6 pb-6 pt-3 text-center">
            <div className="text-[32px] mb-3">🔒</div>
            <p className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#999] mb-4">
              Log in to send a hire request
            </p>
            <Link
              href="/login"
              className="inline-block font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.04em] bg-[#0a0a0a] text-white px-6 py-2.5 rounded-full no-underline hover:bg-[#333] transition-colors"
            >
              Log In
            </Link>
          </div>
        ) : sent ? (
          /* Success state */
          <div className="px-6 pb-6 pt-3 text-center">
            <div className="text-[40px] mb-3">✅</div>
            <h3 className="font-[family-name:var(--font-syne)] text-[16px] font-bold mb-1">
              Request Sent!
            </h3>
            <p className="text-[13px] text-[#888] mb-5">
              {target.creatorDisplayName || target.creatorUsername} will receive your message and get back to you.
            </p>
            <Button onClick={handleClose} size="sm">
              Done
            </Button>
          </div>
        ) : (
          /* Message form */
          <div className="px-6 pb-6 pt-2">
            <Input
              label="Budget (optional)"
              placeholder="e.g. $500 or Negotiable"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <div className="mb-3.5">
              <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]">
                Message
              </label>
              <textarea
                className="w-full px-3.5 py-3 border-[1.5px] border-[#e8e8e8] rounded-[10px] font-[family-name:var(--font-dm-sans)] text-sm text-[#111] outline-none placeholder:text-[#ccc] focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)] transition-all resize-y min-h-[100px]"
                placeholder={`Hi ${target.creatorDisplayName || target.creatorUsername}, I'd love to work with you on...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="w-full"
            >
              {sending ? 'Sending...' : 'Send Hire Request'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
