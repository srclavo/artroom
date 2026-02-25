'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardSkillsPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        My Skills
      </h1>

      {/* Installed Skills Section */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
          Installed Skills
        </h2>
        <div className="border border-[#e8e8e8] rounded-[12px] p-8 text-center">
          <div className="text-[40px] mb-3 opacity-30">🧠</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
            No skills installed yet
          </div>
          <p className="text-[12px] text-[#ccc] mb-4">
            Browse the marketplace to find AI skills that enhance your creative workflow.
          </p>
          <Link href="/skills">
            <Button size="sm">Browse Skills Marketplace</Button>
          </Link>
        </div>
      </section>

      {/* Sell Your Skills Section */}
      <section>
        <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
          Sell Your Skills
        </h2>
        <div className="border border-[#e8e8e8] rounded-[12px] p-8 text-center">
          <div className="text-[40px] mb-3 opacity-30">✨</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
            List your AI skills
          </div>
          <p className="text-[12px] text-[#ccc] mb-4">
            Package and sell your custom AI skills to other creators on ArtRoom.
          </p>
          <Button size="sm" disabled className="opacity-50 cursor-not-allowed">
            Coming Soon
          </Button>
        </div>
      </section>
    </div>
  );
}
