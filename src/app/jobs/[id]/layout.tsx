import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://artroom.vercel.app';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = getSupabase();

  const { data } = await supabase
    .from('jobs')
    .select('title, description, company_name, location, job_type')
    .eq('id', id)
    .single();

  if (!data) {
    return { title: 'Job not found' };
  }

  const job = data as { title: string; description: string; company_name: string; location: string | null; job_type: string };
  const desc = job.description?.slice(0, 160) || `${job.title} at ${job.company_name}`;

  return {
    title: `${job.title} at ${job.company_name}`,
    description: desc,
    openGraph: {
      title: `${job.title} at ${job.company_name} | ArtRoom Jobs`,
      description: desc,
      type: 'website',
      url: `${APP_URL}/jobs/${id}`,
    },
  };
}

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
