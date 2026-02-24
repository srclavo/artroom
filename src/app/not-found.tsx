import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        <div className="font-[family-name:var(--font-syne)] text-[100px] font-extrabold text-[#f0f0f0] leading-none mb-0">
          404
        </div>
        <h1 className="font-[family-name:var(--font-syne)] text-[20px] font-bold text-[#0a0a0a] mb-2">
          Lost in the gallery?
        </h1>
        <p className="text-[13px] text-[#999] mb-6 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-6 py-3 rounded-full bg-[#0a0a0a] text-white no-underline hover:bg-[#333] transition-colors"
        >
          Back to Gallery
        </Link>
      </div>
    </div>
  );
}
