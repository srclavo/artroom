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
    .from('designs')
    .select('title, description, price, thumbnail_url, creator:profiles!designs_creator_id_fkey(username, display_name)')
    .eq('id', id)
    .single();

  if (!data) {
    return { title: 'Design not found' };
  }

  const design = data as unknown as {
    title: string;
    description: string;
    price: number;
    thumbnail_url: string | null;
    creator: { username: string; display_name: string | null };
  };

  const creatorName = design.creator?.display_name || design.creator?.username || 'Creator';
  const desc = design.description?.slice(0, 160) || `${design.title} by ${creatorName} on ArtRoom`;

  return {
    title: `${design.title} by ${creatorName}`,
    description: desc,
    openGraph: {
      title: `${design.title} by ${creatorName} | ArtRoom`,
      description: desc,
      type: 'website',
      url: `${APP_URL}/design/${id}`,
      images: design.thumbnail_url ? [{ url: design.thumbnail_url, alt: design.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${design.title} by ${creatorName}`,
      description: desc,
      images: design.thumbnail_url ? [design.thumbnail_url] : [],
    },
    other: {
      'product:price:amount': String(design.price),
      'product:price:currency': 'USD',
    },
  };
}

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
