import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://artroom.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const entries: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${APP_URL}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${APP_URL}/skills`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Published designs
  const { data: designs } = await supabase
    .from('designs')
    .select('id, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(1000);

  if (designs) {
    for (const d of designs) {
      entries.push({
        url: `${APP_URL}/design/${d.id}`,
        lastModified: new Date(d.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Creator profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .eq('role', 'creator')
    .limit(500);

  if (profiles) {
    for (const p of profiles) {
      entries.push({
        url: `${APP_URL}/artist/${p.username}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Active jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at')
    .eq('status', 'active')
    .limit(500);

  if (jobs) {
    for (const j of jobs) {
      entries.push({
        url: `${APP_URL}/jobs/${j.id}`,
        lastModified: new Date(j.updated_at),
        changeFrequency: 'daily',
        priority: 0.6,
      });
    }
  }

  return entries;
}
