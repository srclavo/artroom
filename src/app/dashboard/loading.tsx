export default function DashboardLoading() {
  return (
    <div>
      <div className="w-40 h-7 bg-[#f0f0f0] rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 rounded-lg border border-[#e8e8e8] divide-y sm:divide-y-0 sm:divide-x divide-[#e8e8e8]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 flex flex-col items-center gap-2">
            <div className="h-2.5 bg-[#f5f5f5] rounded w-16 animate-pulse" />
            <div className="h-9 bg-[#f0f0f0] rounded w-20 animate-pulse" />
            <div className="h-2 bg-[#f5f5f5] rounded w-12 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="mt-6 border border-[#e8e8e8] rounded-lg h-[260px] animate-pulse bg-[#fafafa]" />
    </div>
  );
}
