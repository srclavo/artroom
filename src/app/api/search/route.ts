import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q')?.trim();
  const type = searchParams.get('type') || 'all';
  const limit = Math.min(Number(searchParams.get('limit') || 20), 50);

  if (!q || q.length < 2) {
    return NextResponse.json({ designs: [], profiles: [], jobs: [] });
  }

  const supabase = await createClient();
  const pattern = `%${q}%`;

  const results: {
    designs: unknown[];
    profiles: unknown[];
    jobs: unknown[];
  } = { designs: [], profiles: [], jobs: [] };

  // Search designs
  if (type === 'all' || type === 'designs') {
    const { data } = await supabase
      .from('designs')
      .select(`
        id, title, price, category, thumbnail_url, like_count, view_count,
        creator:profiles!designs_creator_id_fkey (
          id, username, display_name, avatar_url
        )
      `)
      .eq('status', 'published')
      .or(`title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`)
      .order('like_count', { ascending: false })
      .limit(limit);
    results.designs = data ?? [];
  }

  // Search profiles (creators / studios)
  if (type === 'all' || type === 'studios') {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, role, skills, is_verified')
      .or(`username.ilike.${pattern},display_name.ilike.${pattern},bio.ilike.${pattern}`)
      .limit(limit);
    results.profiles = data ?? [];
  }

  // Search jobs
  if (type === 'all' || type === 'jobs') {
    const { data } = await supabase
      .from('jobs')
      .select('id, title, company_name, company_logo_url, location, job_type, salary_min, salary_max, is_remote, skills_required, status')
      .eq('status', 'active')
      .or(`title.ilike.${pattern},company_name.ilike.${pattern},description.ilike.${pattern}`)
      .order('created_at', { ascending: false })
      .limit(limit);
    results.jobs = data ?? [];
  }

  return NextResponse.json(results);
}
