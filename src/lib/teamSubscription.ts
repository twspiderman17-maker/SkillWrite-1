import { TRACKS } from "../data/tracks";
import type { TeamPlan } from "../data/pricing";
import { getTeamPlan } from "../data/pricing";
import { unlockPurchase } from "./progress";
import type { Program } from "../types";
import { getEntitlementRows } from "./entitlements";
import { isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "awa_v1_team";

export type TeamSubscription = {
  planId: TeamPlan["id"];
  planName: string;
  orgName: string;
  seats: number;
  tier: Program;
  trackSlugs: string[];
  activatedAt: string;
};

export function getTeamSubscription(): TeamSubscription | null {
  if (isSupabaseConfigured) {
    const rows = getEntitlementRows().filter((r) => r.team_plan_id);
    if (rows.length === 0) return null;
    const planId = rows[0].team_plan_id as TeamPlan["id"];
    const plan = getTeamPlan(planId);
    if (!plan) return null;
    const trackSlugs = [...new Set(rows.map((r) => r.track_slug))];
    return {
      planId,
      planName: plan.name,
      orgName: rows[0].org_name?.trim() || "My organization",
      seats: plan.seats,
      tier: plan.tier,
      trackSlugs: trackSlugs.length ? trackSlugs : TRACKS.map((t) => t.slug),
      activatedAt: rows[0].created_at ?? new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TeamSubscription;
  } catch {
    return null;
  }
}

export function activateTeamPlan(
  plan: TeamPlan,
  orgName: string,
  trackSlug?: string,
): TeamSubscription {
  if (isSupabaseConfigured) {
    throw new Error("Use Stripe checkout for team plans in production.");
  }

  const trackSlugs =
    plan.id === "starter" && trackSlug ? [trackSlug] : TRACKS.map((t) => t.slug);

  const tier = plan.tier;
  for (const slug of trackSlugs) {
    unlockPurchase(slug, tier);
    if (plan.includesCertificates) {
      unlockPurchase(slug, "certificate");
    }
  }

  const sub: TeamSubscription = {
    planId: plan.id,
    planName: plan.name,
    orgName: orgName.trim() || "My organization",
    seats: plan.seats,
    tier: plan.tier,
    trackSlugs,
    activatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
  window.dispatchEvent(new Event("awa-team-updated"));
  return sub;
}

export function clearTeamSubscription(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("awa-team-updated"));
}

export function exportTeamRosterDemo(): string {
  const sub = getTeamSubscription();
  if (!sub) return "";
  const header = "seat,track_access,tier,org\n";
  const rows = Array.from({ length: Math.min(sub.seats, 5) }, (_, i) =>
    `${i + 1},${sub.trackSlugs.join("|")},${sub.tier},${sub.orgName}`,
  ).join("\n");
  return header + rows + (sub.seats > 5 ? `\n...and ${sub.seats - 5} more seats` : "");
}
