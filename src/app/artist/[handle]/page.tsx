'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { useProfile } from '@/hooks/useProfile';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/utils';
import { CATEGORY_MAP } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import { X } from 'lucide-react';

const TAG_COLORS: Record<string, { bg: string; tc: string }> = {
  branding: { bg: '#ffafd9', tc: '#0a0a0a' },
  'ui-ux': { bg: '#6e87f2', tc: '#fff' },
  typography: { bg: '#e0eb3a', tc: '#0a0a0a' },
  illustration: { bg: '#f07e41', tc: '#fff' },
  motion: { bg: '#2ec66d', tc: '#fff' },
  '3d': { bg: '#d5d1ff', tc: '#0a0a0a' },
  template: { bg: '#98c7f3', tc: '#0a0a0a' },
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
  const { user } = useAuth();
  const { profile, designs, followerCount: profileFollowerCount, designCount, loading } = useProfile(handle);
  const { following, followerCount, toggleFollow } = useFollow(profile?.id ?? '', user?.id);

  const [msgOpen, setMsgOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'me' | 'them'; text: string }[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [toast, setToast] = useState('');
  const [pricingTip, setPricingTip] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const msgBodyRef = useRef<HTMLDivElement>(null);
  const tipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  const displayFollowerCount = profile?.id ? followerCount : profileFollowerCount;

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
  }, [designs.length]);

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

  const handleFollow = () => {
    toggleFollow();
    const name = profile?.display_name || handle;
    showToast(following ? `Unfollowed ${name}` : `Following ${name}`);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-content flex items-center justify-center min-h-[60vh]">
          <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
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

  const skills = (profile.skills as string[]) || [];
  const primaryColor = skills[0] ? (TAG_COLORS[skills[0]]?.bg ?? '#f0f0f0') : '#f0f0f0';
  const primaryTc = skills[0] ? (TAG_COLORS[skills[0]]?.tc ?? '#0a0a0a') : '#0a0a0a';
  const avatarInitial = (profile.display_name || handle).charAt(0).toUpperCase();

  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Banner / Cover Image */}
        {profile.cover_image_url ? (
          <div className="h-[160px] md:h-[200px] w-full overflow-hidden">
            <img src={profile.cover_image_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex h-1.5">
            {[primaryColor, '#6e87f2', '#e0eb3a', '#0a0a0a'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
        )}

        {/* Profile Hero */}
        <div className="flex items-start gap-7 flex-wrap px-7 py-12 pb-10 border-b border-[#e8e8e8]">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-syne)] text-[30px] font-extrabold overflow-hidden"
            style={{ background: primaryColor, color: primaryTc }}
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name || handle} className="w-full h-full object-cover" />
            ) : (
              avatarInitial
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-[family-name:var(--font-syne)] text-[clamp(24px,4vw,36px)] font-extrabold tracking-[-0.03em] mb-1">
              {profile.display_name || handle}
            </h1>
            <p className="text-[13px] text-[#999] mb-3">@{profile.username}.artroom</p>

            <div className="flex gap-1.5 flex-wrap mb-4">
              {skills.map((t) => (
                <span key={t} className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.08em] uppercase px-3.5 py-[5px] rounded-full border border-[#e8e8e8] text-[#999]">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-7 mb-[18px]">
              <div>
                <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{designCount}</span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Works</span>
              </div>
              <div>
                <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold block">{formatCompactNumber(displayFollowerCount)}</span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#999]">Followers</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-center">
              <button
                onClick={handleFollow}
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
                Hire {(profile.display_name || handle).split(' ')[0]}
              </button>
            </div>

            {/* Social Links */}
            {(() => {
              const links = profile.social_links as Record<string, string> | null;
              if (!links || Object.values(links).every((v) => !v)) return null;
              const SOCIAL_LABELS: Record<string, string> = {
                twitter: '𝕏',
                instagram: 'IG',
                behance: 'Bē',
                dribbble: 'Dr',
                linkedin: 'in',
              };
              return (
                <div className="flex gap-2 mt-3">
                  {Object.entries(links).map(([key, value]) => {
                    if (!value) return null;
                    const href = value.startsWith('http') ? value : key === 'twitter' ? `https://x.com/${value.replace('@', '')}` : key === 'instagram' ? `https://instagram.com/${value.replace('@', '')}` : `https://${value}`;
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-[5px] rounded-full border border-[#e8e8e8] text-[#999] no-underline hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all"
                      >
                        {SOCIAL_LABELS[key] || key}
                      </a>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Works label */}
        <div className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb] px-7 pt-7 pb-4 flex items-center gap-3.5">
          Works ({designs.length})
          <span className="flex-1 h-px bg-[#f0f0f0]" />
        </div>

        {/* Works Grid */}
        <div className="px-7 pb-16">
          {designs.length === 0 ? (
            <div className="text-center py-20 text-[#999]">
              <p className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#0a0a0a] mb-2">No public works yet</p>
              <p className="text-[13px]">This artist hasn&apos;t published any works.</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {designs.map((d) => {
                const cat = CATEGORY_MAP[d.category];
                const tagColor = TAG_COLORS[d.category];
                return (
                  <Link key={d.id} href={ROUTES.design(d.id)} className="no-underline">
                    <div
                      className="wc rounded-[10px] overflow-hidden border border-[#e8e8e8] cursor-pointer bg-white opacity-0 translate-y-3.5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:border-[#ccc] group relative"
                    >
                      <div
                        className="w-full flex items-center justify-center relative overflow-hidden h-[250px]"
                        style={{ background: cat?.color ?? '#f0f0f0' }}
                      >
                        {d.thumbnail_url ? (
                          <img src={d.thumbnail_url} alt={d.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-[family-name:var(--font-syne)] text-[42px] font-extrabold opacity-20" style={{ color: cat?.textColor ?? '#0a0a0a' }}>
                            {d.title.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPayment({ itemName: d.title, itemPrice: d.price, creatorUsername: d.creator.username, designId: d.id }); }}
                          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 translate-y-2 bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.08em] px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap border-none cursor-pointer"
                        >
                          Buy →
                        </button>
                      </div>
                      <div className="px-3.5 py-3.5">
                        <div className="text-[13px] text-[#111] mb-1.5 leading-[1.3]">{d.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="font-[family-name:var(--font-syne)] text-[14px] font-bold">${d.price}</span>
                        </div>
                        {tagColor && (
                          <span
                            className="font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.1em] uppercase px-2.5 py-[3px] rounded-full inline-block mt-2"
                            style={{ background: tagColor.bg, color: tagColor.tc }}
                          >
                            {d.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
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
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-syne)] text-[15px] font-extrabold overflow-hidden"
                style={{ background: primaryColor, color: primaryTc }}
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  avatarInitial
                )}
              </div>
              <div>
                <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold">{profile.display_name || handle}</div>
                <div className="text-[10px] text-[#999]">@{profile.username}.artroom</div>
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
            ArtRoom Tip
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
