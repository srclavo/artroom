'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/* ── Artist Data ── */
const ARTISTS = [
  { av: 'M', avBg: '#FFB3C6', avTc: '#0a0a0a', name: 'Maya Chen', handle: 'maya', tags: ['Branding', 'Identity'], works: 42, followers: '12k', bannerColors: ['#FFB3C6', '#1B4FE8', '#FFE500', '#0a0a0a'] },
  { av: 'J', avBg: '#1B4FE8', avTc: '#fff', name: 'James Park', handle: 'james', tags: ['UI / UX', 'Systems'], works: 61, followers: '3.4k', bannerColors: ['#1B4FE8', '#00A896', '#0D1B4B', '#1B4FE8'] },
  { av: 'T', avBg: '#FFE500', avTc: '#0a0a0a', name: 'Theo Muller', handle: 'theo', tags: ['Typography', 'Print'], works: 34, followers: '1.8k', bannerColors: ['#FFE500', '#f5f0d0', '#E8001A', '#0a0a0a'] },
  { av: 'R', avBg: '#E8001A', avTc: '#fff', name: 'Rin Nakamura', handle: 'rin', tags: ['Motion', '3D'], works: 37, followers: '2.7k', bannerColors: ['#E8001A', '#A8E63D', '#FF5F1F', '#1A7A3C'] },
  { av: 'K', avBg: '#FF5F1F', avTc: '#fff', name: 'Kai Dubois', handle: 'kai', tags: ['Illustration', 'Editorial'], works: 55, followers: '4.2k', bannerColors: ['#FF5F1F', '#FFB3C6', '#FFE500', '#0a0a0a'] },
  { av: 'S', avBg: '#7B3FA0', avTc: '#fff', name: 'Seb Laurent', handle: 'seb', tags: ['3D', 'Render'], works: 29, followers: '1.6k', bannerColors: ['#7B3FA0', '#0D1B4B', '#C8375B', '#7B3FA0'] },
  { av: 'L', avBg: '#00A896', avTc: '#fff', name: 'Lara Voss', handle: 'lara', tags: ['UI', 'Product'], works: 28, followers: '1.1k', bannerColors: ['#00A896', '#A8E63D', '#FFCBA4', '#E8D5B0'] },
  { av: 'N', avBg: '#A8E63D', avTc: '#0a0a0a', name: 'Noa Becker', handle: 'noa', tags: ['Branding', 'Web'], works: 19, followers: '890', bannerColors: ['#A8E63D', '#1A7A3C', '#FFE500', '#0a0a0a'] },
  { av: 'L', avBg: '#1A7A3C', avTc: '#fff', name: 'Leo Grant', handle: 'leo', tags: ['Branding', 'Nature'], works: 23, followers: '1.3k', bannerColors: ['#1A7A3C', '#A8E63D', '#E8D5B0', '#0a0a0a'] },
  { av: 'M', avBg: '#7B3FA0', avTc: '#fff', name: 'Mia Torres', handle: 'mia', tags: ['3D', 'Space'], works: 31, followers: '2.2k', bannerColors: ['#7B3FA0', '#FFB3C6', '#0D1B4B', '#C8375B'] },
  { av: 'A', avBg: '#0D1B4B', avTc: '#fff', name: 'Arc Studio', handle: 'arc', tags: ['Motion', 'Night'], works: 45, followers: '3.1k', bannerColors: ['#0D1B4B', '#1B4FE8', '#A8E63D', '#0D1B4B'] },
  { av: 'R', avBg: '#C8375B', avTc: '#fff', name: 'Rosa Kim', handle: 'rosa', tags: ['Illustration', 'Paper'], works: 26, followers: '980', bannerColors: ['#C8375B', '#FFB3C6', '#FFE500', '#C8375B'] },
];

const DESIGNS = [
  { color: '#FFB3C6', tc: '#0a0a0a', label: 'a soft system', by: 'maya', tag: 'brand', price: 79, h: 270 },
  { color: '#E8001A', tc: '#fff', label: 'signal work', by: 'rin', tag: 'motion', price: 59, h: 220 },
  { color: '#1A7A3C', tc: '#fff', label: 'deep roots', by: 'maya', tag: 'brand', price: 89, h: 340 },
  { color: '#1B4FE8', tc: '#fff', label: 'dashboard v3', by: 'james', tag: 'ui', price: 129, h: 255 },
  { color: '#FFE500', tc: '#0a0a0a', label: 'forma type', by: 'theo', tag: 'type', price: 49, h: 300 },
  { color: '#7B3FA0', tc: '#fff', label: 'inner world', by: 'seb', tag: '3d', price: 149, h: 240 },
  { color: '#FF5F1F', tc: '#fff', label: 'heat index', by: 'kai', tag: 'illus', price: 39, h: 320 },
  { color: '#00A896', tc: '#fff', label: 'coastal drift', by: 'lara', tag: 'brand', price: 69, h: 200 },
  { color: '#A8E63D', tc: '#0a0a0a', label: 'growth data', by: 'noa', tag: 'ui', price: 99, h: 275 },
  { color: '#0D1B4B', tc: '#fff', label: 'night shift', by: 'arc', tag: 'motion', price: 109, h: 350 },
  { color: '#C8375B', tc: '#fff', label: 'cut & fold', by: 'rosa', tag: 'illus', price: 44, h: 230 },
  { color: '#E8D5B0', tc: '#0a0a0a', label: 'warm logic', by: 'theo', tag: 'type', price: 89, h: 285 },
  { color: '#2E2E2E', tc: '#fff', label: 'void state', by: 'seb', tag: '3d', price: 149, h: 260 },
  { color: '#FFCBA4', tc: '#0a0a0a', label: 'peach protocol', by: 'lara', tag: 'ui', price: 79, h: 310 },
  { color: '#5EEAD4', tc: '#0a0a0a', label: 'tidal system', by: 'maya', tag: 'brand', price: 99, h: 250 },
  { color: '#FDE68A', tc: '#0a0a0a', label: 'golden hour', by: 'kai', tag: 'illus', price: 29, h: 190 },
];

const TAG_COLORS: Record<string, { bg: string; tc: string }> = {
  brand: { bg: '#FFB3C6', tc: '#0a0a0a' },
  ui: { bg: '#1B4FE8', tc: '#fff' },
  type: { bg: '#FFE500', tc: '#0a0a0a' },
  illus: { bg: '#FF5F1F', tc: '#fff' },
  motion: { bg: '#1A7A3C', tc: '#fff' },
  '3d': { bg: '#7B3FA0', tc: '#fff' },
};

const MSG_TEMPLATES = [
  "I'd love to commission you for a project",
  'Are you available for freelance work?',
  'I have a collaboration idea I\'d like to discuss',
  'Quick question about your work',
];

const PRICING_WORDS = ['pay you', 'budget is', 'budget of', 'rate', 'quote', 'offer', 'charge', 'price', 'cost', 'compensation', 'paying', 'willing to pay'];

export default function ArtistPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const artist = ARTISTS.find((a) => a.handle === handle);
  const works = artist ? DESIGNS.filter((d) => d.by === artist.handle) : [];

  const [following, setFollowing] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'me' | 'them'; text: string }[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [toast, setToast] = useState('');
  const [pricingTip, setPricingTip] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const msgBodyRef = useRef<HTMLDivElement>(null);
  const tipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  /* Staggered card animation */
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.wc');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('wc-vis'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    cards.forEach((c, i) => {
      (c as HTMLElement).style.transitionDelay = `${(i % 4) * 0.06}s`;
      observer.observe(c);
    });
    return () => observer.disconnect();
  }, [works.length]);

  /* Auto-scroll messages */
  useEffect(() => {
    if (msgBodyRef.current) msgBodyRef.current.scrollTop = msgBodyRef.current.scrollHeight;
  }, [messages, msgOpen]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMsgOpen(false); setPricingTip(null); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Auto-dismiss pricing tip */
  useEffect(() => {
    if (!pricingTip) return;
    tipTimeout.current = setTimeout(() => setPricingTip(null), 8000);
    return () => { if (tipTimeout.current) clearTimeout(tipTimeout.current); };
  }, [pricingTip]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const toggleFollow = () => {
    setFollowing((f) => {
      showToast(!f ? `Following ${artist?.name}` : `Unfollowed ${artist?.name}`);
      return !f;
    });
  };

  const checkPricingTip = (text: string) => {
    const dollarMatch = text.match(/\$(\d[\d,]*)/);
    const hasPricing = PRICING_WORDS.some((w) => text.toLowerCase().includes(w));
    if (!dollarMatch && !hasPricing) return;
    if (dollarMatch) {
      const offered = parseInt(dollarMatch[1].replace(/,/g, ''));
      const low = Math.round((offered * 1.5) / 5) * 5;
      const high = Math.round((offered * 2.5) / 5) * 5;
      setPricingTip(`They're offering $${offered} for this work. Similar projects on ArtRoom typically go for $${low}–$${high}.`);
    } else {
      setPricingTip('This looks like a pricing discussion. Check ArtRoom market data before committing to a rate.');
    }
  };

  const sendMessage = (text?: string) => {
    const msg = text || msgInput.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { from: 'me', text: msg }]);
    setMsgInput('');
    checkPricingTip(msg);
  };

  const handleBuy = (label: string, price: number) => {
    openPayment({ itemName: label, itemPrice: price, creatorUsername: artist?.handle || '' });
  };

  if (!artist) {
    return (
      <>
        <Navbar />
        <main className="page-content flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-syne)] text-[18px] font-bold mb-2">Artist not found</h1>
            <p className="text-[13px] text-[#999]">This profile doesn&apos;t exist.</p>
            <Link href="/" className="inline-block mt-4 font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-5 py-2.5 rounded-full bg-[#0a0a0a] text-white no-underline hover:bg-[#333] transition-colors">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Banner strip */}
        <div className="flex h-1.5">
          {artist.bannerColors.map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>

        {/* Profile Hero */}
        <div className="flex items-start gap-7 flex-wrap px-7 py-12 pb-10 border-b border-[#e8e8e8]">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-syne)] text-[30px] font-extrabold"
            style={{ background: artist.avBg, color: artist.avTc }}
          >
            {artist.av}
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-[family-name:var(--font-syne)] text-[clamp(24px,4vw,36px)] font-extrabold tracking-[-0.03em] mb-1">
              {artist.name}
            </h1>
            <p className="text-[13px] text-[#999] mb-3">@{artist.handle}.artroom</p>

            <div className="flex gap-1.5 flex-wrap mb-4">
              {artist.tags.map((t) => (
                <span key={t} className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3.5 py-[5px] rounded-full border border-[#e8e8e8] text-[#999]">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-7 mb-[18px]">
              <div>
                <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{artist.works}</span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Works</span>
              </div>
              <div>
                <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{artist.followers}</span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Followers</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-center">
              <button
                onClick={toggleFollow}
                className={cn(
                  'font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.06em] uppercase px-7 py-[9px] rounded-full border-[1.5px] cursor-pointer transition-all',
                  following
                    ? 'bg-white text-[#0a0a0a] border-[#e8e8e8] hover:border-[#0a0a0a]'
                    : 'bg-[#0a0a0a] text-white border-[#0a0a0a] hover:opacity-85'
                )}
              >
                {following ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={() => setMsgOpen(true)}
                className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.06em] uppercase px-7 py-[9px] rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#0a0a0a] cursor-pointer transition-all hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
              >
                Hire {artist.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>

        {/* Works label */}
        <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] px-7 pt-7 pb-4 flex items-center gap-3.5">
          Works ({works.length})
          <span className="flex-1 h-px bg-[#f0f0f0]" />
        </div>

        {/* Works Grid */}
        <div className="px-7 pb-16">
          {works.length === 0 ? (
            <div className="text-center py-20 text-[#999]">
              <p className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] mb-2">No public works yet</p>
              <p className="text-[13px]">This artist hasn&apos;t published any works.</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {works.map((d, i) => (
                <div
                  key={i}
                  className="wc rounded-[10px] overflow-hidden border border-[#e8e8e8] cursor-pointer bg-white opacity-0 translate-y-3.5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:border-[#ccc] group relative"
                  onClick={() => handleBuy(d.label, d.price)}
                >
                  <div
                    className="w-full flex items-center justify-center relative overflow-hidden"
                    style={{ height: d.h, background: d.color }}
                  >
                    <span className="font-[family-name:var(--font-syne)] text-[42px] font-extrabold opacity-20" style={{ color: d.tc }}>
                      {d.label.charAt(0).toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBuy(d.label, d.price); }}
                      className="absolute bottom-2.5 left-1/2 -translate-x-1/2 translate-y-2 bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.08em] px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap border-none cursor-pointer"
                    >
                      Buy →
                    </button>
                  </div>
                  <div className="px-3.5 py-3.5">
                    <div className="text-[13px] text-[#111] mb-1.5 leading-[1.3]">{d.label}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-syne)] text-[14px] font-bold">${d.price}</span>
                    </div>
                    <span
                      className="font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.1em] uppercase px-2.5 py-[3px] rounded-full inline-block mt-2"
                      style={{ background: TAG_COLORS[d.tag]?.bg || '#eee', color: TAG_COLORS[d.tag]?.tc || '#000' }}
                    >
                      {d.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Toast */}
      <div className={cn(
        'fixed bottom-7 right-7 z-[600] bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[12px] font-bold px-6 py-3 rounded-full transition-all duration-300 pointer-events-none',
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
      )}>
        {toast}
      </div>

      {/* Message Panel */}
      {msgOpen && (
        <div
          className="fixed inset-0 z-[800] bg-white/[0.92] backdrop-blur-[12px] flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) { setMsgOpen(false); setPricingTip(null); } }}
        >
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] w-[480px] max-w-[92vw] max-h-[80vh] shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e5e5]">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-syne)] text-[15px] font-extrabold"
                style={{ background: artist.avBg, color: artist.avTc }}
              >
                {artist.av}
              </div>
              <div>
                <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold">{artist.name}</div>
                <div className="text-[10px] text-[#999]">@{artist.handle}.artroom</div>
              </div>
              <button
                onClick={() => { setMsgOpen(false); setPricingTip(null); }}
                className="ml-auto w-8 h-8 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center cursor-pointer text-[#999] hover:bg-[#f0f0f0] transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div ref={msgBodyRef} className="flex-1 p-5 overflow-y-auto flex flex-col gap-2.5 min-h-[200px] max-h-[360px]">
              <div className="text-[9px] text-[#ccc] text-center py-1">Today</div>
              {messages.length === 0 ? (
                <>
                  <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.12em] uppercase text-[#bbb] mb-1.5">
                    Choose a way to start the conversation
                  </div>
                  <div className="flex flex-col gap-2">
                    {MSG_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl}
                        onClick={() => sendMessage(tpl)}
                        className="bg-[#fafafa] border border-[#e8e8e8] rounded-[10px] px-3.5 py-2.5 font-[family-name:var(--font-dm-sans)] text-[12px] text-[#333] text-left cursor-pointer hover:border-[#0a0a0a] hover:bg-[#f0f0f0] transition-all leading-[1.5]"
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-[80%] px-3.5 py-2.5 rounded-[12px] text-[13px] leading-[1.6]',
                      m.from === 'me'
                        ? 'bg-[#0a0a0a] text-white self-end rounded-br-[4px]'
                        : 'bg-[#f5f5f5] text-[#333] self-start rounded-bl-[4px]'
                    )}
                  >
                    {m.text}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 px-5 py-3.5 border-t border-[#e5e5e5]">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border border-[#e5e5e5] rounded-full px-4 py-[9px] font-[family-name:var(--font-dm-sans)] text-[12px] outline-none focus:border-[#0a0a0a] transition-colors"
              />
              <button
                onClick={() => sendMessage()}
                className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.06em] uppercase px-5 py-[9px] rounded-full bg-[#0a0a0a] text-white border-none cursor-pointer hover:opacity-80 transition-opacity"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Pricing Tip */}
      {pricingTip && (
        <div className="fixed bottom-[120px] right-8 z-[810] bg-white border-[1.5px] border-[#fde68a] rounded-[10px] p-3.5 max-w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] animate-[tipSlideIn_0.3s_ease-out]">
          <button
            onClick={() => setPricingTip(null)}
            className="absolute top-2 right-2.5 bg-transparent border-none cursor-pointer text-[#bbb] hover:text-[#333] text-[12px] p-0.5"
          >
            <X size={12} />
          </button>
          <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.1em] uppercase text-[#92400e] mb-1.5 flex items-center gap-1.5">
            💡 ArtRoom Tip
          </div>
          <p className="text-[12px] leading-[1.6] text-[#333]">{pricingTip}</p>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal isOpen={isOpen} onClose={closePayment} paymentIntent={paymentIntent} />

      <style jsx>{`
        .wc-vis { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </>
  );
}
