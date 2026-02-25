import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if this is a brand-new user (profile has no display_name yet)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', data.user.id)
          .single();

        const profileData = profile as { display_name: string | null } | null;

        // New user — redirect to settings to customize their profile
        if (profileData && !profileData.display_name) {
          return NextResponse.redirect(
            `${origin}/dashboard/settings?welcome=true`
          );
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If no code or exchange failed, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
