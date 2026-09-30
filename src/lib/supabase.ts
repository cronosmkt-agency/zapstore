import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
    return String(import.meta.env.VITE_SUPABASE_URL);
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) {
    return String(process.env.VITE_SUPABASE_URL);
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).VITE_SUPABASE_URL) {
    return String((globalThis as any).VITE_SUPABASE_URL);
  }
  if (typeof window !== 'undefined') {
    if ((window as any).__ENV__?.VITE_SUPABASE_URL) return String((window as any).__ENV__.VITE_SUPABASE_URL);
    try {
      const stored = localStorage.getItem('vite_supabase_url');
      if (stored) return stored;
    } catch {}
  }
  return '';
}

export function getSupabaseAnonKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return String(import.meta.env.VITE_SUPABASE_ANON_KEY);
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) {
    return String(process.env.VITE_SUPABASE_ANON_KEY);
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).VITE_SUPABASE_ANON_KEY) {
    return String((globalThis as any).VITE_SUPABASE_ANON_KEY);
  }
  if (typeof window !== 'undefined') {
    if ((window as any).__ENV__?.VITE_SUPABASE_ANON_KEY) return String((window as any).__ENV__.VITE_SUPABASE_ANON_KEY);
    try {
      const stored = localStorage.getItem('vite_supabase_anon_key');
      if (stored) return stored;
    } catch {}
  }
  return '';
}

export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
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

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient {
  const url = getSupabaseUrl() || 'https://placeholder.supabase.co';
  const key = getSupabaseAnonKey() || 'placeholder-anon-key';

  if (!cachedClient || lastUrl !== url || lastKey !== key) {
    lastUrl = url;
    lastKey = key;
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
        detectSessionInUrl: typeof window !== 'undefined',
      },
    });
  }

  return cachedClient;
}

// Proxy singleton para que todas as chamadas transparentemente usem o cliente ativo
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
