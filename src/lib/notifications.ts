import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Json } from '@/types/database';

export async function createNotification(
  userId: string,
  type: 'sale' | 'purchase' | 'follow' | 'like' | 'system',
  title: string,
  message?: string,
  data?: Record<string, unknown>
) {
  await supabaseAdmin.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message: message ?? null,
    data: (data ?? {}) as Json,
  } as never);
}
