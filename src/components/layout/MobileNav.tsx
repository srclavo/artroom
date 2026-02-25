'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: 'Gallery', href: ROUTES.home },
  { label: 'Explore Gallery', href: ROUTES.gallery },
  { label: 'Skill Vault', href: ROUTES.skills },
  { label: 'Job Fair', href: ROUTES.jobs },
  { label: 'My Studio', href: ROUTES.dashboard, authOnly: true },
  { label: 'My Uploads', href: ROUTES.dashboardUploads, authOnly: true },
  { label: 'Earnings', href: ROUTES.dashboardEarnings, authOnly: true },
  { label: 'Settings', href: ROUTES.dashboardSettings, authOnly: true },
];

const GUEST_LINKS = [
  { label: 'Login', href: ROUTES.login },
  { label: 'Register', href: ROUTES.register },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, signOut } = useAuth();
  const wallet = useSolanaWallet();
  const { itemCount } = useCart();

  const isLoggedIn = !!user;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 top-14 z-[399] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={cn(
          'fixed inset-0 top-14 z-[400] bg-white transition-transform duration-300 md:hidden overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col p-7 gap-1">
          {/* Upload CTA */}
          {isLoggedIn && (
            <Link
              href={ROUTES.dashboardUploads}
              onClick={onClose}
              className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] px-5 py-3 rounded-full bg-[#0a0a0a] text-white no-underline text-center mb-4 hover:bg-[#333] transition-colors"
            >
              + Upload Design
            </Link>
          )}

          {NAV_LINKS.filter((link) => !link.authOnly || isLoggedIn).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-[0.01em] text-[#0a0a0a] no-underline py-3 border-b border-[#f2f2f2] hover:opacity-60 transition-opacity flex items-center justify-between"
            >
              {link.label}
              {link.label === 'My Studio' && itemCount > 0 && (
                <span className="text-[9px] bg-[#0a0a0a] text-white px-2 py-0.5 rounded-full">
                  {itemCount} in cart
                </span>
              )}
            </Link>
          ))}

          {/* Guest links: Login / Register */}
          {!isLoggedIn &&
            GUEST_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-[0.01em] text-[#0a0a0a] no-underline py-3 border-b border-[#f2f2f2] hover:opacity-60 transition-opacity"
              >
                {link.label}
              </Link>
            ))}

          {/* Log Out */}
          {isLoggedIn && (
            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-[0.01em] text-[#ff4625] bg-transparent border-none text-left py-3 border-b border-[#f2f2f2] cursor-pointer hover:opacity-60 transition-opacity"
            >
              Log Out
            </button>
          )}

          {/* Wallet connect for mobile */}
          {wallet.isPhantomInstalled && (
            <button
              onClick={() => {
                if (wallet.isConnected) {
                  wallet.disconnect();
                } else {
                  wallet.connect();
                }
                onClose();
              }}
              className="font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-[0.01em] text-[#9945FF] bg-transparent border-none text-left py-3 border-b border-[#f2f2f2] cursor-pointer hover:opacity-60 transition-opacity"
            >
              {wallet.isConnected
                ? `Disconnect (${wallet.displayAddress})`
                : '\u25CE Connect Wallet'}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
