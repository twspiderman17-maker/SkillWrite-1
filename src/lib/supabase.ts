import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_SUPABASE_ANON_KEY, DEFAULT_SUPABASE_URL } from "../config/supabase-public";

const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const envAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const url = envUrl || DEFAULT_SUPABASE_URL;
const anonKey = envAnonKey || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** True when Vercel/Vite env vars were missing and baked-in publishable defaults were used. */
export const usesDefaultSupabaseConfig = !envUrl || !envAnonKey;

/** Helps the login page explain missing Vercel env vars (Vite bakes these in at build time). */
export function getSupabaseConfigStatus() {
  return {
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(anonKey),
    fromEnv: Boolean(envUrl && envAnonKey),
    usesDefaults: usesDefaultSupabaseConfig,
    urlPreview: url ? `${url.slice(0, 28)}…` : null,
  };
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        flowType: "pkce",
      },
    })
  : null;
