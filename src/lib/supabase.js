import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'implicit',
    storageKey: 'smartwh-auth',
    storage: {
      getItem: (key) => {
        try { return globalThis.localStorage?.getItem(key) ?? null; }
        catch { return null; }
      },
      setItem: (key, value) => {
        try { globalThis.localStorage?.setItem(key, value); }
        catch {}
      },
      removeItem: (key) => {
        try { globalThis.localStorage?.removeItem(key); }
        catch {}
      },
    },
  },
});
