import { cookies as _cookies } from 'next/headers';
import { createSupabaseServerClient } from '../supabase-server'
;

export async function getUserRole(): Promise<'admin' | 'recruiter' | 'viewer' | null> {
  const supabase = createSupabaseServerClient()
;

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user?.id) return null;

  const userId = session.user.id;

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data?.role) return null;

  return data.role as 'admin' | 'recruiter' | 'viewer';
}
