import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getEnvValue(key: string): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    return String(import.meta.env[key]);
  }
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return String(process.env[key]);
  }
  if (typeof window !== 'undefined') {
    if ((window as any).__ENV__?.[key]) return String((window as any).__ENV__[key]);
    try {
      const stored = localStorage.getItem(key.toLowerCase());
      if (stored) return stored;
    } catch {}
  }
  return '';
}

const supabaseUrl = getEnvValue('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvValue('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = (): boolean => {
  const url = getEnvValue('VITE_SUPABASE_URL');
  const key = getEnvValue('VITE_SUPABASE_ANON_KEY');
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('placeholder')
  );
};

export function setSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vite_supabase_url', url.trim());
    localStorage.setItem('vite_supabase_anon_key', anonKey.trim());
    window.location.reload();
  }
}

// Cliente Singleton do Supabase
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
      detectSessionInUrl: typeof window !== 'undefined',
    },
  }
);
