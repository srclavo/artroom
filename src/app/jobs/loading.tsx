export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-14" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="w-48 h-8 bg-[#f0f0f0] rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-[#f5f5f5] rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="border border-[#e8e8e8] rounded-[12px] overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#f0f0f0] last:border-b-0">
                <div className="w-11 h-11 rounded-[10px] bg-[#f0f0f0] animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#f0f0f0] rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-[#f5f5f5] rounded w-1/3 animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-[#f0f0f0] rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
