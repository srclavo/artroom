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
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const supabase = getSupabase();

  const { data } = await supabase
    .from('profiles')
    .select('username, display_name, bio, avatar_url')
    .eq('username', handle)
    .single();

  if (!data) {
    return { title: 'Creator not found' };
  }

  const profile = data as { username: string; display_name: string | null; bio: string | null; avatar_url: string | null };
  const name = profile.display_name || profile.username;
  const desc = profile.bio?.slice(0, 160) || `Check out ${name}'s creative portfolio on ArtRoom`;

  return {
    title: `${name} (@${profile.username})`,
    description: desc,
    openGraph: {
      title: `${name} (@${profile.username}) | ArtRoom`,
      description: desc,
      type: 'profile',
      url: `${APP_URL}/artist/${handle}`,
      images: profile.avatar_url ? [{ url: profile.avatar_url, alt: name }] : [],
    },
  };
}

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
