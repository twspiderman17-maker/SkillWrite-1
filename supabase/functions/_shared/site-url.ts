const ALLOWED_SITE_ORIGINS = new Set([
  "https://skillwrite.org",
  "https://www.skillwrite.org",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export function isAllowedSiteOrigin(origin: string): boolean {
  const normalized = origin.replace(/\/$/, "");
  if (ALLOWED_SITE_ORIGINS.has(normalized)) return true;
  try {
    const url = new URL(normalized);
    return url.protocol === "https:" && url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

/** Prefer the browser origin the user started checkout from; fall back to SITE_URL secret. */
export function resolveSiteUrl(opts: {
  envSiteUrl?: string;
  returnOrigin?: string;
  requestOrigin?: string | null;
}): string {
  const candidates = [opts.returnOrigin, opts.requestOrigin ?? undefined, opts.envSiteUrl];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const normalized = candidate.trim().replace(/\/$/, "");
    if (isAllowedSiteOrigin(normalized)) return normalized;
  }
  const env = opts.envSiteUrl?.trim().replace(/\/$/, "");
  if (env) return env;
  return "http://localhost:5173";
}
