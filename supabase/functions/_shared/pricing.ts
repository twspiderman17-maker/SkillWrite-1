export type PurchaseTier = "graduate" | "masters" | "certificate";
export type TeamPlanId = "starter" | "growth" | "department";

const INDIVIDUAL_USD: Record<PurchaseTier, number> = {
  graduate: 15,
  masters: 45,
  certificate: 5,
};

const TEAM_USD: Record<TeamPlanId, number> = {
  starter: 60,
  growth: 365,
  department: 1000,
};

export function individualAmountCents(tier: PurchaseTier): number {
  return INDIVIDUAL_USD[tier] * 100;
}

export function teamAmountCents(planId: TeamPlanId): number {
  return TEAM_USD[planId] * 100;
}

export function individualProductName(trackSlug: string, tier: PurchaseTier): string {
  const label = tier === "certificate" ? "Certificate add-on" : tier === "masters" ? "Masters" : "Graduate";
  return `SkillWrite ${label} — ${trackSlug}`;
}

export function teamProductName(planId: TeamPlanId): string {
  const names: Record<TeamPlanId, string> = {
    starter: "Starter Team",
    growth: "Growth Team",
    department: "Department",
  };
  return `SkillWrite ${names[planId]} (one-time)`;
}
