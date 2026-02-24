'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        <div className="font-[family-name:var(--font-syne)] text-[64px] font-extrabold text-[#f0f0f0] leading-none mb-2">
          :(
        </div>
        <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold text-[#0a0a0a] mb-2">
          Something went wrong
        </h1>
        <p className="text-[13px] text-[#999] mb-6 leading-relaxed">
          We encountered an unexpected error. Don&apos;t worry — your work is safe.
        </p>
        <button
          onClick={reset}
          className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-6 py-3 rounded-full bg-[#0a0a0a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
