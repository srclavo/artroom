'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

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
    >
      <div
        className={cn(
          'bg-white rounded-[20px] w-[420px] max-w-[calc(100vw-32px)]',
          'shadow-[0_24px_80px_rgba(0,0,0,0.18)]',
          'animate-modal-in relative',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-[#f5f5f5] text-[#888] flex items-center justify-center hover:bg-[#e8e8e8] transition-colors cursor-pointer z-10"
        >
          <X size={14} />
        </button>
        {children}
      </div>
    </div>
  );
}
