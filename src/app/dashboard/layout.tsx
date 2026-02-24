'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

const NAV_SECTIONS = [
  {
    label: 'Studio',
    items: [
      { label: '▦ Sections', href: ROUTES.dashboard },
      { label: '↗ Analytics', href: ROUTES.dashboard + '?view=analytics', badge: 'New' },
      { label: '$ Earnings', href: ROUTES.dashboardEarnings },
    ],
  },
  {
    label: 'Gallery',
    items: [
      { label: '🖼 My Listings', href: ROUTES.dashboardUploads },
      { label: '+ New Listing', href: ROUTES.dashboardUploads },
      { label: '♡ Wishlist', href: ROUTES.dashboard + '?view=wishlist' },
      { label: '💼 My Jobs', href: ROUTES.dashboardJobs },
      { label: '🔍 Browse Jobs', href: '/jobs' },
    ],
  },
  {
    label: 'Messages',
    items: [
      { label: '💬 Messages', href: ROUTES.dashboard + '?view=messages' },
    ],
  },
  {
    label: 'AI Skills',
    items: [
      { label: '🎨 My Skills', href: '/skills' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: '⚙ Settings', href: ROUTES.dashboardSettings },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push(ROUTES.login);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-content flex items-center justify-center min-h-[60vh]">
          <div className="font-[family-name:var(--font-syne)] text-[13px] text-[#999]">Loading...</div>
        </div>
      </>
    );
  }

  if (!user) return null;

  const displayName = profile?.display_name || profile?.username || 'Creator';
  const username = profile?.username || 'user';

  return (
    <>
      <Navbar />
      <div className="page-content grid grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block border-r border-[#e8e8e8] sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          {/* Profile */}
          <div className="p-5 pb-4 border-b border-[#e8e8e8]">
            <Avatar
              name={displayName}
              size="lg"
              color="#FFB3C6"
              className="mb-3"
            />
            <div className="font-[family-name:var(--font-syne)] text-[15px] font-bold">
              {displayName}
            </div>
            <div className="text-[11px] text-[#999] mb-2">@{username}.artroom</div>

            <button
              onClick={() => router.push(ROUTES.dashboardSettings)}
              className="mt-3 w-full font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1.5 rounded-full border-[1.5px] border-[#e0e0e0] bg-white text-[#888] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all"
            >
              Edit Profile
            </button>
          </div>

          {/* Navigation */}
          <nav className="py-3 px-2.5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} className="mb-2">
                <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.2em] text-[#ccc] px-3 mb-1">
                  {section.label}
                </div>
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium no-underline transition-all',
                      pathname === item.href
                        ? 'bg-[#f7f7f7] text-[#0a0a0a]'
                        : 'text-[#999] hover:bg-[#f7f7f7] hover:text-[#0a0a0a]'
                    )}
                  >
                    {item.label}
                    {'badge' in item && item.badge && (
                      <span className="ml-auto text-[8px] bg-[#E8001A] text-white px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-5 py-4 mt-auto border-t border-[#e8e8e8]">
            <button
              onClick={async () => {
                await signOut();
                router.push(ROUTES.home);
              }}
              className="w-full font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.06em] px-3 py-1.5 rounded-full border-[1.5px] border-[#e0e0e0] bg-white text-[#999] cursor-pointer hover:border-[#E8001A] hover:text-[#E8001A] transition-all"
            >
              Log Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="p-8 pb-16 max-w-4xl">{children}</div>
      </div>
    </>
  );
}
