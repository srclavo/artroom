export default function DesignLoading() {
  return (
    <div className="max-w-[1060px] mx-auto px-6 py-8">
      <div className="w-32 h-4 bg-[#f0f0f0] rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 border border-[#e5e5e5] rounded-[10px] overflow-hidden bg-white">
        <div className="min-h-[400px] bg-[#f5f5f5] animate-pulse" />
        <div className="p-7 space-y-4">
          <div className="h-6 bg-[#f0f0f0] rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-[#f0f0f0] rounded w-1/2 animate-pulse" />
          <div className="flex items-center gap-3 py-4 border-b border-[#f0f0f0]">
            <div className="w-10 h-10 rounded-full bg-[#f0f0f0] animate-pulse" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-[#f0f0f0] rounded w-24 animate-pulse" />
              <div className="h-2.5 bg-[#f5f5f5] rounded w-20 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-[#f5f5f5] rounded w-full animate-pulse" />
            <div className="h-3 bg-[#f5f5f5] rounded w-5/6 animate-pulse" />
            <div className="h-3 bg-[#f5f5f5] rounded w-4/6 animate-pulse" />
          </div>
          <div className="flex gap-2 mt-auto pt-4">
            <div className="h-3 bg-[#f0f0f0] rounded w-16 animate-pulse" />
            <div className="h-3 bg-[#f0f0f0] rounded w-16 animate-pulse" />
            <div className="h-3 bg-[#f0f0f0] rounded w-16 animate-pulse" />
          </div>
          <div className="h-12 bg-[#f0f0f0] rounded-lg animate-pulse mt-4" />
        </div>
      </div>
    </div>
  );
}
