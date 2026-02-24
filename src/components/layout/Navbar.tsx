'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ShoppingBag, Bell } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { MobileNav } from './MobileNav';
import { WalletButton } from './WalletButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/hooks/useNotifications';

interface SearchResult {
  designs: { id: string; title: string; category: string; thumbnail_url: string; creator: { username: string } }[];
  profiles: { id: string; username: string; display_name: string | null; avatar_url: string | null }[];
  jobs: { id: string; title: string; company_name: string }[];
}

export function Navbar() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults(null);
    document.body.style.overflow = '';
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=all&limit=5`);
        if (res.ok) setSearchResults(await res.json());
      } catch { /* ignore */ }
      setSearchLoading(false);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      closeSearch();
      router.push(`${ROUTES.search}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
      }
      if (e.key === 'Escape' && searchOpen) closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, openSearch, closeSearch]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white z-[500] border-b border-[#e8e8e8]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full px-7">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.jobs}
              className="font-[family-name:var(--font-syne)] text-[13px] font-bold tracking-[0.01em] text-[#0a0a0a] no-underline hover:opacity-45 transition-opacity hidden sm:block"
            >
              Job Fair
            </Link>

            <button
              onClick={openSearch}
              aria-label="Search (Cmd+K)"
              className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center bg-transparent cursor-pointer hover:border-[#0a0a0a] hover:bg-[#f5f5f5] transition-all"
            >
              <Search size={13} />
            </button>
          </div>

          {/* Center - Logo */}
          <Link href={ROUTES.home} className="no-underline">
            <span className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold tracking-[-0.02em] text-[#0a0a0a]">
              ArtRoom
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center justify-end gap-2.5">
            {/* Notifications */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setCartOpen(false); }}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center bg-transparent cursor-pointer hover:border-[#0a0a0a] hover:bg-[#f5f5f5] transition-all relative"
              >
                <Bell size={13} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] rounded-full bg-[#E8001A] text-white text-[7px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Cart */}
            <button
              onClick={() => { setCartOpen(true); setNotifOpen(false); }}
              aria-label={`Cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
              className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center bg-transparent cursor-pointer hover:border-[#0a0a0a] hover:bg-[#f5f5f5] transition-all relative hidden sm:flex"
            >
              <ShoppingBag size={13} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] rounded-full bg-[#0a0a0a] text-white text-[7px] font-bold flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <WalletButton />

            {/* Open Studio Sign */}
            <Link
              href={ROUTES.dashboard}
              className="hidden md:flex flex-col items-center no-underline group"
            >
              {/* Chain */}
              <div className="flex flex-col items-center gap-px pt-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-[7px] h-[4px] border-[1.5px] border-[#ccc] rounded-full"
                    style={{ transform: i % 2 === 1 ? 'rotate(90deg)' : undefined }}
                  />
                ))}
              </div>
              <div className="animate-sign-rock origin-top">
                <div className="relative border-[1.5px] border-black rounded-[7px] px-[18px] py-2 pb-2.5 text-center bg-white group-hover:bg-[#fafafa] transition-colors min-w-[118px]">
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-white" />
                  <div className="font-[family-name:var(--font-syne)] text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#0a0a0a] leading-none">
                    Open Studio
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-[8px] font-light text-[#bbb] uppercase tracking-[0.13em] mt-1 leading-none">
                    Enter your space
                  </div>
                  <div className="flex justify-center gap-1 mt-[7px]">
                    <span className="w-1 h-1 rounded-full bg-[#0a0a0a]" />
                    <span className="w-1 h-1 rounded-full bg-[#0a0a0a]" />
                    <span className="w-1 h-1 rounded-full bg-[#0a0a0a]" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-8 h-8 flex items-center justify-center cursor-pointer bg-transparent border-none"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[999] bg-white/96 backdrop-blur-[12px] flex flex-col items-center pt-[min(18vh,140px)]">
          <div className="w-[min(560px,90vw)] relative">
            <input
              type="text"
              placeholder="Search designs, studios, jobs..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              className="w-full font-[family-name:var(--font-syne)] text-[clamp(22px,4vw,36px)] font-bold tracking-[-0.02em] border-none border-b-2 border-b-[#0a0a0a] bg-transparent py-3 outline-none placeholder:text-[#ccc]"
              style={{ borderBottom: '2px solid #0a0a0a' }}
            />
            <button
              onClick={closeSearch}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full border border-[#e8e8e8] bg-transparent flex items-center justify-center cursor-pointer text-[#999] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all"
            >
              <X size={14} />
            </button>
          </div>
          {searchQuery && searchQuery.length >= 2 && (
            <div className="w-[min(560px,90vw)] mt-4 max-h-[50vh] overflow-y-auto">
              {searchLoading ? (
                <div className="text-center text-[13px] text-[#999] py-6">Searching...</div>
              ) : searchResults && (searchResults.designs.length > 0 || searchResults.profiles.length > 0 || searchResults.jobs.length > 0) ? (
                <div className="flex flex-col gap-1">
                  {searchResults.designs.length > 0 && (
                    <>
                      <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.14em] text-[#bbb] px-2 pt-2">Designs</div>
                      {searchResults.designs.map((d) => (
                        <Link key={d.id} href={ROUTES.design(d.id)} onClick={closeSearch} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f5f5f5] transition-colors no-underline">
                          <div className="w-9 h-9 rounded-[6px] bg-[#f0f0f0] flex-shrink-0 overflow-hidden">
                            {d.thumbnail_url && <img src={d.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] text-[#111] truncate">{d.title}</div>
                            <div className="text-[10px] text-[#999]">{d.creator?.username}.artroom</div>
                          </div>
                          <span className="text-[9px] font-[family-name:var(--font-syne)] font-bold text-[#bbb] uppercase">Design</span>
                        </Link>
                      ))}
                    </>
                  )}
                  {searchResults.profiles.length > 0 && (
                    <>
                      <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.14em] text-[#bbb] px-2 pt-2">Creators</div>
                      {searchResults.profiles.map((p) => (
                        <Link key={p.id} href={ROUTES.studio(p.username)} onClick={closeSearch} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f5f5f5] transition-colors no-underline">
                          <div className="w-9 h-9 rounded-full bg-[#f0f0f0] flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">{(p.display_name || p.username).charAt(0).toUpperCase()}</span>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] text-[#111]">{p.display_name || p.username}</div>
                            <div className="text-[10px] text-[#999]">@{p.username}</div>
                          </div>
                          <span className="text-[9px] font-[family-name:var(--font-syne)] font-bold text-[#bbb] uppercase">Studio</span>
                        </Link>
                      ))}
                    </>
                  )}
                  {searchResults.jobs.length > 0 && (
                    <>
                      <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.14em] text-[#bbb] px-2 pt-2">Jobs</div>
                      {searchResults.jobs.map((j) => (
                        <Link key={j.id} href={ROUTES.job(j.id)} onClick={closeSearch} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f5f5f5] transition-colors no-underline">
                          <div className="w-9 h-9 rounded-[6px] bg-[#f5f5f5] flex-shrink-0 flex items-center justify-center text-[16px]">💼</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] text-[#111] truncate">{j.title}</div>
                            <div className="text-[10px] text-[#999]">{j.company_name}</div>
                          </div>
                          <span className="text-[9px] font-[family-name:var(--font-syne)] font-bold text-[#bbb] uppercase">Job</span>
                        </Link>
                      ))}
                    </>
                  )}
                  <button
                    onClick={handleSearchSubmit}
                    className="mt-2 w-full py-2.5 text-center font-[family-name:var(--font-syne)] text-[11px] font-bold text-[#0a0a0a] bg-[#f5f5f5] rounded-lg border-none cursor-pointer hover:bg-[#e8e8e8] transition-colors"
                  >
                    View all results &rarr;
                  </button>
                </div>
              ) : (
                <div className="text-center text-[13px] text-[#999] py-6">No results found</div>
              )}
            </div>
          )}
        </div>
      )}

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
