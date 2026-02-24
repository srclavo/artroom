'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function StripeReturnPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings with success param
    router.replace(`${ROUTES.dashboardSettings}?stripe=connected`);
  }, [router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999]">
          Verifying Stripe connection...
        </div>
      </div>
    </div>
  );
}
