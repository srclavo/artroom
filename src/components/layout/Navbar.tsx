'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ShoppingBag, Bell } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { MobileNav } from './MobileNav';
import { WalletButton } from './WalletButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/hooks/useNotifications';

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    document.body.style.overflow = '';
  }, []);

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
              placeholder="Search designs, studios, portfolios..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {searchQuery && (
            <div className="w-[min(560px,90vw)] mt-4 max-h-[50vh] overflow-y-auto flex flex-col gap-1.5">
              <div className="text-center text-[13px] text-[#999] py-8">
                Search results will appear here
              </div>
            </div>
          )}
        </div>
      )}

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
