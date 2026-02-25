'use client';

import { useEffect, useState } from 'react';
import { X, Check, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: 'bg-[#f0fdf4]', border: 'border-[#bbf7d0]', icon: 'text-[#2ec66d]' },
  error: { bg: 'bg-[#fef2f2]', border: 'border-[#fecaca]', icon: 'text-[#ff4625]' },
  info: { bg: 'bg-[#eff6ff]', border: 'border-[#bfdbfe]', icon: 'text-[#6e87f2]' },
  warning: { bg: 'bg-[#fffbeb]', border: 'border-[#fde68a]', icon: 'text-[#92400e]' },
};

const TOAST_ICONS: Record<ToastType, typeof Check> = {
  success: Check,
  error: X,
  info: Info,
  warning: AlertTriangle,
};

let listeners: ((toast: Toast) => void)[] = [];
let idCounter = 0;

function emit(type: ToastType, message: string) {
  const t: Toast = { id: String(++idCounter), type, message };
  listeners.forEach((fn) => fn(t));
}

export const toast = {
  success: (msg: string) => emit('success', msg),
  error: (msg: string) => emit('error', msg),
  info: (msg: string) => emit('info', msg),
  warning: (msg: string) => emit('warning', msg),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev.slice(-4), t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 5000);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9000] flex flex-col gap-2 max-sm:left-4 max-sm:right-4 max-sm:bottom-20" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => {
        const style = TOAST_COLORS[t.type];
        const Icon = TOAST_ICONS[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-[10px] border ${style.bg} ${style.border} shadow-[0_4px_16px_rgba(0,0,0,0.08)] animate-slide-up min-w-[260px] max-w-[380px]`}
            role="alert"
          >
            <Icon size={14} className={`${style.icon} flex-shrink-0`} />
            <span className="text-[12px] text-[#333] flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-[#999] hover:text-[#333] transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
