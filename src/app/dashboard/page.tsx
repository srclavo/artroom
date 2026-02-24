'use client';

import { useState } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';

const STATS = [
  { label: 'Views Today', value: '1,247', change: '↑ +18% vs yesterday', isPositive: true },
  { label: 'New Followers', value: '+38', change: '↑ +12% this week', isPositive: true },
  { label: 'Earnings This Month', value: '$312', change: '↓ –4% vs last month', isPositive: false },
];

const WORK_SECTIONS = [
  {
    title: 'Brand Work ✦',
    items: [
      { label: 'a soft system', color: '#FFB3C6' },
      { label: 'night shift', color: '#0D1B4B' },
      { label: 'forma type', color: '#FFE500' },
      { label: 'deep roots', color: '#1A7A3C' },
      { label: 'signal work', color: '#E8001A' },
    ],
  },
  {
    title: 'Editorial ✳',
    items: [
      { label: 'void state', color: '#2E2E2E' },
      { label: 'warm logic', color: '#E8D5B0' },
      { label: 'heat index', color: '#FF5F1F' },
    ],
  },
];

export default function DashboardPage() {
  const [aiMessages, setAiMessages] = useState([
    { from: 'ai', text: 'Welcome to your studio! I can help you manage your portfolio, analyze trends, and optimize your listings. What would you like to work on?' },
  ]);
  const [aiInput, setAiInput] = useState('');

  const sendAI = () => {
    if (!aiInput.trim()) return;
    setAiMessages((prev) => [
      ...prev,
      { from: 'user', text: aiInput },
      { from: 'ai', text: 'Great question! Let me look into that for you. Based on your portfolio analytics, I recommend focusing on your branding work — it gets 3× more engagement than other categories.' },
    ]);
    setAiInput('');
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Studio Overview
      </h1>

      <StatsCards stats={STATS} />

      {/* AI Panel */}
      <div className="mt-6 border border-[#e8e8e8] rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 bg-[#fafafa] border-b border-[#e8e8e8]">
          <span className="w-[7px] h-[7px] rounded-full bg-[#1A7A3C] animate-ai-pulse" />
          <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold">
            Claude — Studio AI
          </span>
          <span className="ml-auto text-[10px] text-[#999]">
            Powered by Anthropic
          </span>
        </div>

        <div className="p-4 max-h-[180px] overflow-y-auto thin-scrollbar">
          {aiMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} mb-2 last:mb-0`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-[9px] text-[12px] leading-[1.65] ${
                  msg.from === 'user'
                    ? 'bg-[#0a0a0a] text-white rounded-br-[4px]'
                    : 'bg-[#f5f5f5] text-[#333] rounded-bl-[4px]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <input
            type="text"
            placeholder="Ask Claude anything..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendAI()}
            className="flex-1 px-3.5 py-2 rounded-full border border-[#e8e8e8] text-[12px] outline-none focus:border-[#0a0a0a] transition-all font-[family-name:var(--font-dm-sans)]"
          />
          <button
            onClick={sendAI}
            className="px-4 py-2 rounded-full bg-[#0a0a0a] text-white text-[10px] font-[family-name:var(--font-syne)] font-bold uppercase tracking-[0.06em] border-none cursor-pointer hover:bg-[#333] transition-colors"
          >
            Send →
          </button>
        </div>
      </div>

      {/* Work sections */}
      {WORK_SECTIONS.map((section) => (
        <div key={section.title} className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-[family-name:var(--font-syne)] text-[13px] font-bold tracking-[0.03em]">
              {section.title}
            </h2>
            <button className="ml-auto font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#888] cursor-pointer hover:border-[#0a0a0a] transition-all">
              Rename
            </button>
            <button className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-full border-none bg-[#E8001A] text-white cursor-pointer hover:bg-[#c5001a] transition-colors">
              + Upload
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex-shrink-0 w-[118px] rounded-[6px] border border-[#e8e8e8] overflow-hidden cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_8px_22px_rgba(0,0,0,0.1)] transition-all group relative"
              >
                <div
                  className="h-[88px] flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="text-white/40 font-[family-name:var(--font-syne)] text-[22px] font-extrabold transition-transform group-hover:scale-110">
                    {item.label.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="px-2.5 py-2 text-[10px] text-[#111] truncate bg-white whitespace-nowrap">
                  {item.label}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="font-[family-name:var(--font-syne)] text-[9px] font-bold text-white uppercase tracking-[0.08em]">
                    Open ↗
                  </span>
                </div>
              </div>
            ))}
            <button className="flex-shrink-0 w-[118px] h-[120px] rounded-[6px] border-[1.5px] border-dashed border-[#ddd] flex flex-col items-center justify-center text-[#ccc] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all bg-transparent">
              <span className="text-[20px]">+</span>
              <span className="text-[10px] font-bold">Add Work</span>
            </button>
          </div>
        </div>
      ))}

      {/* Add section button */}
      <button className="mt-6 w-full py-[18px] rounded-[6px] border-[1.5px] border-dashed border-[#ddd] text-[#ccc] font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all bg-transparent">
        + Add Section
      </button>
    </div>
  );
}
