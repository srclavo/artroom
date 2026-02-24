import { StatsCards } from '@/components/dashboard/StatsCards';

const STATS = [
  { label: 'Views Today', value: '1,247', change: '+18% vs yesterday', isPositive: true },
  { label: 'New Followers', value: '+38', change: '+12% this week', isPositive: true },
  { label: 'Earnings This Month', value: '$312', change: '–4% vs last month', isPositive: false },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Studio Overview
      </h1>

      <StatsCards stats={STATS} />

      {/* AI Panel */}
      <div className="mt-6 border border-[#e8e8e8] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-[7px] h-[7px] rounded-full bg-[#1A7A3C] animate-ai-pulse" />
          <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
            Claude — Studio AI
          </span>
          <span className="ml-auto text-[10px] text-[#999]">
            Powered by Anthropic
          </span>
        </div>

        <div className="bg-[#f5f5f5] rounded-lg p-3 mb-3 max-w-[80%]">
          <p className="text-[12px] text-[#333] leading-[1.6]">
            Welcome to your studio! I can help you manage your portfolio, analyze trends, and optimize your listings. What would you like to work on?
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask Claude anything..."
            className="flex-1 px-4 py-2 rounded-full border border-[#e8e8e8] text-[12px] outline-none focus:border-[#0a0a0a] transition-all font-[family-name:var(--font-dm-sans)]"
          />
          <button className="px-4 py-2 rounded-full bg-[#0a0a0a] text-white text-[10px] font-[family-name:var(--font-syne)] font-bold border-none cursor-pointer hover:bg-[#333] transition-colors">
            Send →
          </button>
        </div>
      </div>

      {/* Work sections */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold">
            Brand Work ✦
          </h2>
          <button className="ml-auto font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#888] cursor-pointer hover:border-[#0a0a0a] transition-all">
            Rename
          </button>
          <button className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full border-none bg-[#E8001A] text-white cursor-pointer hover:bg-[#c5001a] transition-colors">
            + Upload
          </button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[118px] rounded-lg border border-[#e8e8e8] overflow-hidden cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_8px_22px_rgba(0,0,0,0.1)] transition-all"
            >
              <div className="h-[88px] bg-[#FFB3C6] flex items-center justify-center">
                <span className="text-white/50 font-[family-name:var(--font-syne)] text-[20px] font-extrabold">
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
              <div className="px-2.5 py-2 text-[10px] text-[#111] truncate bg-white">
                Work {i + 1}
              </div>
            </div>
          ))}
          <button className="flex-shrink-0 w-[118px] h-[120px] rounded-lg border-2 border-dashed border-[#d5d5d5] flex flex-col items-center justify-center text-[#ccc] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all bg-transparent">
            <span className="text-[20px]">+</span>
            <span className="text-[10px] font-bold">Add Work</span>
          </button>
        </div>
      </div>
    </div>
  );
}
