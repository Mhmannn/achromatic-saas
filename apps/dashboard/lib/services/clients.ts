// apps/dashboard/lib/services/clients.ts

'use server';

import { cookies as _cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { Database } from '@/types/supabase'; // adjust if needed
type Client = Database['public']['Tables']['clients']['Row'];

const supabase = createSupabaseServerClient();

/**
 * Fetch all clients belonging to the currently logged-in user
 */
export async function getClients(): Promise<Client[]> {
  const { data: { session }, error: sessionError } = await supabase().auth.getSession();
  if (sessionError || !session?.user?.id) return [];

  const { data, error } = await supabase()
    .from('clients')
    .select('*')
    .eq('owner_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data as Client[];
}

/**
 * Create a new client for the currently logged-in user
 */
export async function createClient(client: {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}): Promise<Client | null> {
  const { data: { session }, error: sessionError } = await supabase().auth.getSession();
  if (sessionError || !session?.user?.id) return null;

  const { data, error } = await supabase()
    .from('clients')
    .insert([
      {
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes
        // owner_id is set automatically by Supabase via auth.uid()
      }
    ])
    .select()
    .single();

  if (error || !data) return null;

  return data as Client;
}
