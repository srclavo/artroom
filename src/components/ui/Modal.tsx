'use client';

import { useEffect, useCallback, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    first?.focus();
    modal.addEventListener('keydown', trapFocus);
    return () => modal.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[1000] flex items-center justify-center',
        'bg-[rgba(10,10,10,0.55)] backdrop-blur-[6px]',
        'transition-opacity duration-200',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-white w-[420px] max-w-[calc(100vw-32px)]',
          'shadow-[0_24px_80px_rgba(0,0,0,0.18)]',
          'animate-modal-in relative',
          'rounded-[20px]',
          'max-sm:w-full max-sm:max-w-full max-sm:h-full max-sm:max-h-full max-sm:rounded-none max-sm:overflow-y-auto',
          className
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-[#f5f5f5] text-[#888] flex items-center justify-center hover:bg-[#e8e8e8] transition-colors cursor-pointer z-10"
        >
          <X size={14} />
        </button>
        {children}
      </div>
    </div>
  );
}
