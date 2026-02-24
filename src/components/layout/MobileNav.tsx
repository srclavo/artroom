'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: 'Gallery', href: ROUTES.home },
  { label: 'Job Fair', href: ROUTES.jobs },
  { label: 'My Studio', href: ROUTES.dashboard },
  { label: 'Login', href: ROUTES.login },
  { label: 'Register', href: ROUTES.register },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 top-14 z-[400] bg-white transition-transform duration-300 md:hidden',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex flex-col p-7 gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-[0.01em] text-[#0a0a0a] no-underline py-3 border-b border-[#f2f2f2] hover:opacity-60 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
