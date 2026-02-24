'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { MobileNav } from './MobileNav';

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white z-[500] border-b border-[#f2f2f2]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full px-7">
          {/* Left */}
          <div className="flex items-center gap-5">
            <Link
              href={ROUTES.jobs}
              className="font-[family-name:var(--font-syne)] text-[13px] font-bold tracking-[0.01em] text-[#0a0a0a] no-underline hover:opacity-45 transition-opacity hidden sm:block"
            >
              Job Fair
            </Link>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center bg-transparent cursor-pointer hover:border-[#ccc] hover:bg-[#fafafa] transition-all"
            >
              <Search size={13} />
            </button>

            {/* Search overlay */}
            {searchOpen && (
              <div className="absolute top-14 left-0 right-0 bg-white border-b border-[#e8e8e8] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="max-w-xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search designs, studios, portfolios..."
                    autoFocus
                    className="w-full px-4 py-3 rounded-full border border-[#e8e8e8] font-[family-name:var(--font-dm-sans)] text-sm outline-none focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.05)] transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Center - Logo */}
          <Link href={ROUTES.home} className="no-underline">
            <span className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold tracking-[-0.02em] text-[#0a0a0a]">
              ArtRoom
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center justify-end gap-3">
            {/* Open Studio Sign */}
            <Link
              href={ROUTES.dashboard}
              className="hidden md:flex flex-col items-center no-underline group"
            >
              <div className="animate-sign-rock origin-top">
                <div className="border-[1.5px] border-black rounded-[7px] px-3 py-1.5 text-center bg-white group-hover:bg-[#fafafa] transition-colors">
                  <div className="font-[family-name:var(--font-syne)] text-[11px] font-extrabold tracking-[0.06em] uppercase text-[#0a0a0a]">
                    Open Studio
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-[8px] font-light text-[#999] uppercase tracking-[0.15em]">
                    Enter your space
                  </div>
                  <div className="flex justify-center gap-1 mt-0.5">
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

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
