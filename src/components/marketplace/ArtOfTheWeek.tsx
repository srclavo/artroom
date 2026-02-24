'use client';

const STRIP_ITEMS = [
  { label: 'Lumis', color: '#FFB3C6', tc: '#0a0a0a' },
  { label: 'Stellar', color: '#1B4FE8', tc: '#fff' },
  { label: 'Neue', color: '#FFE500', tc: '#0a0a0a' },
  { label: 'Coastal', color: '#1A7A3C', tc: '#fff' },
  { label: 'Geo', color: '#7B3FA0', tc: '#fff' },
  { label: 'Motion', color: '#FF5F1F', tc: '#fff' },
  { label: 'Forma', color: '#0D1B4B', tc: '#fff' },
  { label: 'Signal', color: '#E8001A', tc: '#fff' },
  { label: 'Heat', color: '#00A896', tc: '#fff' },
  { label: 'Logic', color: '#E8D5B0', tc: '#0a0a0a' },
];

export function ArtOfTheWeek() {
  const items = [...STRIP_ITEMS, ...STRIP_ITEMS];

  return (
    <div className="py-4 px-7">
      {/* Label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#bbb] whitespace-nowrap">
          Art of the Week
        </span>
        <span className="flex-1 h-px bg-[#f0f0f0]" />
      </div>

      {/* Scrolling strip */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-[70px] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[70px] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-strip">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] h-[90px] rounded-[6px] mx-1.5 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.12] hover:shadow-[0_14px_40px_rgba(0,0,0,0.15)]"
              style={{ backgroundColor: item.color }}
            >
              <span
                className="font-[family-name:var(--font-syne)] text-[16px] font-extrabold opacity-60"
                style={{ color: item.tc }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
