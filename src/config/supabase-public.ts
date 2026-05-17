/**
 * Publishable Supabase client settings (safe in browser bundles).
 * VITE_* env vars override these when present at build time.
 */
export const DEFAULT_SUPABASE_URL = "https://sntvbkvxniwmbwobbuwn.supabase.co";

/** Legacy anon JWT — same as Supabase Dashboard → API → anon public */
export const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNudHZia3Z4bml3bWJ3b2JidXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTc1NDQsImV4cCI6MjA5NDQ3MzU0NH0._pOk-_yjbPGoKZCNjGxLlIp47HohaKDZFZF5M0R-j64";
