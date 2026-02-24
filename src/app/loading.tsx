export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-pulse">
        <span className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold tracking-[-0.02em] text-[#0a0a0a]">
          ArtRoom
        </span>
      </div>
      <div className="mt-4 w-32 h-[2px] bg-[#f0f0f0] rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-[#0a0a0a] rounded-full animate-shimmer" />
      </div>
    </div>
  );
}
