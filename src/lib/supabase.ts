import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEnv } from './env';

function initSupabase(): { client: SupabaseClient | null; configured: boolean } {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const configured = Boolean(url && key);
  return {
    client: configured ? createClient(url!, key!) : null,
    configured,
  };
}

// Lazy initialization — on the client, window.__ENV__ is available immediately
// after the script tag in layout.tsx runs (before React hydrates).
let _instance: ReturnType<typeof initSupabase> | null = null;
function getInstance() {
  if (!_instance) _instance = initSupabase();
  return _instance;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const { client } = getInstance();
    if (!client) throw new Error('Supabase not configured');
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function isSupabaseConfigured(): boolean {
  return getInstance().configured;
}
