import type { PurchaseTier } from "../types";
import { AUTH_EVENT, getCurrentUser } from "./auth";
import { isSupabaseConfigured, supabase } from "./supabase";

export type EntitlementRow = {
  track_slug: string;
  tier: PurchaseTier;
  org_name: string | null;
  team_plan_id: string | null;
  created_at?: string;
};

const ENTITLEMENTS_EVENT = "skillwrite-entitlements-change";

let rows: EntitlementRow[] = [];
let loaded = false;
let loading: Promise<void> | null = null;

function notify() {
  window.dispatchEvent(new Event(ENTITLEMENTS_EVENT));
}

export function getEntitlementsEventName(): string {
  return ENTITLEMENTS_EVENT;
}

export function hasEntitlementsLoaded(): boolean {
  if (!isSupabaseConfigured) return true;
  return loaded;
}

export function getEntitlementRows(): EntitlementRow[] {
  return rows;
}

export function isEntitled(trackSlug: string, tier: PurchaseTier): boolean {
  if (tier === "graduate" && rows.some((r) => r.track_slug === trackSlug && r.tier === "masters")) {
    return true;
  }
  return rows.some((r) => r.track_slug === trackSlug && r.tier === tier);
}

export async function refreshEntitlements(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    loaded = true;
    return;
  }

  if (!getCurrentUser()) {
    rows = [];
    loaded = true;
    notify();
    return;
  }

  if (loading) {
    await loading;
    return;
  }

  loading = (async () => {
    const { data, error } = await supabase.functions.invoke("get-entitlements");
    if (error) {
      console.error("get-entitlements failed", error);
      rows = [];
    } else {
      const payload = data as { entitlements?: EntitlementRow[] };
      rows = payload?.entitlements ?? [];
    }
    loaded = true;
    notify();
  })();

  try {
    await loading;
  } finally {
    loading = null;
  }
}

export function clearEntitlementsCache(): void {
  rows = [];
  loaded = false;
  notify();
}

if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EVENT, () => {
    void refreshEntitlements();
  });
}
