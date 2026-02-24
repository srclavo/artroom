'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const SIDEBAR_ITEMS = [
  { label: '▦ Sections', href: ROUTES.dashboard },
  { label: '↗ Analytics', href: ROUTES.dashboard, badge: 'New' },
  { label: '$ Earnings', href: ROUTES.dashboardEarnings },
  { label: '🖼 My Listings', href: ROUTES.dashboardUploads },
  { label: '+ New Listing', href: ROUTES.dashboardUploads },
  { label: '⚙ Settings', href: ROUTES.dashboardSettings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <div className="page-content grid grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block border-r border-[#f2f2f2] sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          {/* Profile */}
          <div className="p-5 border-b border-[#f2f2f2]">
            <Avatar
              name="Your Studio"
              size="lg"
              color="#E8001A"
              className="mb-3"
            />
            <div className="font-[family-name:var(--font-syne)] text-[15px] font-bold">
              Your Studio
            </div>
            <div className="text-[11px] text-[#999]">@you.artroom</div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { n: '0', l: 'Works' },
                { n: '0', l: 'Followers' },
                { n: '$0', l: 'Earned' },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold">
                    {s.n}
                  </div>
                  <div className="text-[8px] text-[#bbb] uppercase tracking-wider">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav className="p-3">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] no-underline transition-all',
                  pathname === item.href
                    ? 'bg-[#f5f5f5] text-[#0a0a0a] font-bold'
                    : 'text-[#888] hover:bg-[#f7f7f7] hover:text-[#0a0a0a]'
                )}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-auto text-[8px] bg-[#E8001A] text-white px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="p-8 max-w-4xl">{children}</div>
      </div>
    </>
  );
}
