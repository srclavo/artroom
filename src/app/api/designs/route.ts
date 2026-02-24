import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { DesignInsert } from '@/types/design';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const offset = parseInt(searchParams.get('offset') ?? '0');

  const supabase = await createClient();

  let query = supabase
    .from('designs')
    .select(`
      *,
      creator:profiles!designs_creator_id_fkey (
        id, username, display_name, avatar_url, is_verified
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const insertData: DesignInsert = {
    creator_id: user.id,
    title: body.title,
    description: body.description,
    price: body.price,
    category: body.category,
    tags: body.tags ?? [],
    thumbnail_url: body.thumbnail_url,
    license_type: body.license_type ?? 'personal',
    status: body.status ?? 'draft',
  };

  const { data, error } = await supabase
    .from('designs')
    .insert(insertData as never)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
