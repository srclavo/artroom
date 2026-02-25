'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';

type MarqueeItem =
  | { type: 'link'; text: string; bg: string; tc: string; href: string }
  | { type: 'wallet' };

const BASE_ITEMS: MarqueeItem[] = [
  { type: 'link', text: 'Gallery', bg: '#e0eb3a', tc: '#0a0a0a', href: '/gallery' },
  { type: 'link', text: 'Skill Vault', bg: '#6e87f2', tc: '#fff', href: '/skills' },
  { type: 'link', text: 'Messages', bg: '#ff4625', tc: '#fff', href: '/dashboard/messages' },
  { type: 'link', text: 'Create', bg: '#2ec66d', tc: '#fff', href: '/dashboard/uploads' },
  { type: 'wallet' },
  { type: 'link', text: 'Gallery', bg: '#d5d1ff', tc: '#0a0a0a', href: '/gallery' },
  { type: 'link', text: 'Skill Vault', bg: '#f07e41', tc: '#fff', href: '/skills' },
  { type: 'link', text: 'Messages', bg: '#ffafd9', tc: '#0a0a0a', href: '/dashboard/messages' },
  { type: 'link', text: 'Create', bg: '#98c7f3', tc: '#0a0a0a', href: '/dashboard/uploads' },
];

function WalletMarqueeButton() {
  const wallet = useSolanaWallet();
  const isConn = wallet.isConnected;

  const handleClick = () => {
    if (!wallet.isPhantomInstalled) {
      window.open('https://phantom.app/', '_blank');
    } else if (isConn) {
      wallet.disconnect();
    } else {
      wallet.connect();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="font-[family-name:var(--font-syne)] text-[12px] font-extrabold uppercase tracking-[0.04em] px-[22px] py-2 rounded-full border-none cursor-pointer flex-shrink-0 hover:opacity-80 hover:scale-[0.96] active:scale-[0.93] transition-all whitespace-nowrap"
      style={{
        backgroundColor: isConn ? '#14F195' : '#9945FF',
        color: isConn ? '#0a0a0a' : '#fff',
      }}
    >
      {isConn ? wallet.displayAddress : '\u25CE Connect Wallet'}
    </button>
  );
}

export function Footer() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;
    let isPaused = false;

    const animate = () => {
      if (!isPaused) {
        position -= speed;
        if (Math.abs(position) >= track.scrollWidth / 2) {
          position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    const onEnter = () => { isPaused = true; };
    const onLeave = () => { isPaused = false; };

    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const items = [...BASE_ITEMS, ...BASE_ITEMS];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[50px] bg-white border-t border-[#e8e8e8] z-[200] flex items-center overflow-hidden">
      <div ref={trackRef} className="flex items-center gap-0 will-change-transform whitespace-nowrap">
        {items.map((item, i) => (
          <div key={i} className="inline-flex items-center gap-[22px] px-[22px]">
            {item.type === 'wallet' ? (
              <WalletMarqueeButton />
            ) : (
              <Link
                href={item.href}
                className="font-[family-name:var(--font-syne)] text-[12px] font-extrabold uppercase tracking-[0.04em] px-[22px] py-2 rounded-full border-none no-underline flex-shrink-0 hover:opacity-80 hover:scale-[0.96] active:scale-[0.93] transition-all"
                style={{ backgroundColor: item.bg, color: item.tc }}
              >
                {item.text}
              </Link>
            )}
            <span className="text-[#ddd] text-[20px] select-none">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
