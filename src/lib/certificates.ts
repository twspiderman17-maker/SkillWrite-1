import { isSupabaseConfigured, supabase } from "./supabase";

const STORAGE_KEY = "awa_v1_certificate_awards";

export type CertificateAward = {
  trackSlug: string;
  learnerName: string;
  certificateTitle: string;
  trackTitle: string;
  issuedAt: string;
  certificateId: string;
};

let cache: Record<string, CertificateAward> = {};
let loaded = false;

const CERTIFICATES_EVENT = "skillwrite-certificates-change";

function notify() {
  window.dispatchEvent(new Event(CERTIFICATES_EVENT));
}

export function getCertificatesEventName(): string {
  return CERTIFICATES_EVENT;
}

function loadLocal(): Record<string, CertificateAward> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, CertificateAward>;
  } catch {
    return {};
  }
}

function saveLocal(awards: Record<string, CertificateAward>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(awards));
}

export function buildCertificateId(trackSlug: string, issuedAt: string): string {
  const date = issuedAt.slice(0, 10).replace(/-/g, "");
  const slugPart = trackSlug
    .split("-")
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4)
    .padEnd(4, "X");
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SW-${slugPart}-${date}-${tail}`;
}

export function hasCertificateEarned(trackSlug: string): boolean {
  return Boolean(cache[trackSlug]);
}

export function getCertificateAward(trackSlug: string): CertificateAward | undefined {
  return cache[trackSlug];
}

export async function refreshCertificateAwards(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    cache = loadLocal();
    loaded = true;
    notify();
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    cache = {};
    loaded = true;
    notify();
    return;
  }

  const { data, error } = await supabase
    .from("certificate_awards")
    .select("track_slug, learner_name, certificate_title, track_title, certificate_id, issued_at")
    .eq("user_id", user.id);

  if (error) {
    console.error("certificate_awards fetch failed", error);
    cache = loadLocal();
  } else {
    cache = {};
    for (const row of data ?? []) {
      cache[row.track_slug] = {
        trackSlug: row.track_slug,
        learnerName: row.learner_name,
        certificateTitle: row.certificate_title,
        trackTitle: row.track_title,
        certificateId: row.certificate_id,
        issuedAt: row.issued_at,
      };
    }
  }

  loaded = true;
  notify();
}

export function areCertificatesLoaded(): boolean {
  if (!isSupabaseConfigured) return true;
  return loaded;
}

export async function recordCertificatePass(args: {
  trackSlug: string;
  certificateTitle: string;
  trackTitle: string;
  learnerName: string;
  userId?: string;
}): Promise<CertificateAward> {
  const learnerName = args.learnerName.trim() || "SkillWrite Learner";
  const issuedAt = new Date().toISOString();
  const award: CertificateAward = {
    trackSlug: args.trackSlug,
    learnerName,
    certificateTitle: args.certificateTitle,
    trackTitle: args.trackTitle,
    issuedAt,
    certificateId: buildCertificateId(args.trackSlug, issuedAt),
  };

  cache[args.trackSlug] = award;
  const local = loadLocal();
  local[args.trackSlug] = award;
  saveLocal(local);
  notify();

  if (isSupabaseConfigured && supabase && args.userId && !args.userId.startsWith("demo_")) {
    const { error } = await supabase.from("certificate_awards").upsert(
      {
        user_id: args.userId,
        track_slug: args.trackSlug,
        learner_name: learnerName,
        certificate_title: args.certificateTitle,
        track_title: args.trackTitle,
        certificate_id: award.certificateId,
        issued_at: issuedAt,
      },
      { onConflict: "user_id,track_slug" },
    );
    if (error) {
      console.error("certificate_awards upsert failed", error);
    }
  }

  return award;
}

export function formatCertificateDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function clearCertificateCache(): void {
  cache = {};
  loaded = false;
  notify();
}
