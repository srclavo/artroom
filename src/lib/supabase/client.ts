import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Simple no-op lock that bypasses Navigator.locks to prevent
// "lock timed out" errors when multiple components mount simultaneously.
// Safe because we use a singleton client (only one instance ever exists).
async function noOpLock<R>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> {
  return await fn();
}

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          lock: noOpLock,
        },
      }
    );
  }
  return client;
}
