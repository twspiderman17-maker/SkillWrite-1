import type { Program, PurchaseTier } from "../types";

/** Individual per-track pricing (matches course checkout). */
export const INDIVIDUAL_PRICING = {
  graduate: {
    priceUsd: 15,
    durationLabel: "1 month access",
    name: "Graduate",
    program: "graduate" as Program,
    summary: "Focused fundamentals and two job-shaped practice projects.",
  },
  masters: {
    priceUsd: 45,
    durationLabel: "3 months access",
    name: "Masters",
    program: "masters" as Program,
    summary: "Full depth, team workflows, and advanced certificate prep.",
  },
  certificate: {
    priceUsd: 5,
    name: "Certificate add-on",
    summary: "Practical final test and downloadable certificate preview.",
  },
} as const;

/** Team plans are priced at this discount vs buying the same seats individually. */
export const TEAM_VOLUME_DISCOUNT = 0.46;

export type TeamPlanId = "starter" | "growth" | "department";

export type TeamPlan = {
  id: TeamPlanId;
  name: string;
  priceUsd: number;
  billingLabel: string;
  seats: number;
  seatLabel: string;
  tracksLabel: string;
  tier: Program;
  includesCertificates: boolean;
  description: string;
  highlights: string[];
  /** Effective per-seat price for comparison display */
  perSeatUsd: number;
  /** Rough individual equivalent (no team discount) */
  individualEquivalentUsd: number;
};

function individualSeatUsd(tier: Program, withCertificate: boolean): number {
  const base = INDIVIDUAL_PRICING[tier].priceUsd;
  return withCertificate ? base + INDIVIDUAL_PRICING.certificate.priceUsd : base;
}

function teamPriceFromIndividual(individualTotal: number): number {
  return Math.round(individualTotal * (1 - TEAM_VOLUME_DISCOUNT));
}

function teamPriceFromPerSeat(seats: number, perSeatUsd: number): number {
  return seats * perSeatUsd;
}

export const TEAM_PLANS: TeamPlan[] = [
  {
    id: "starter",
    name: "Starter Team",
    priceUsd: teamPriceFromPerSeat(5, 12),
    billingLabel: "one-time",
    seats: 5,
    seatLabel: "Up to 5 learners",
    tracksLabel: "1 industry track (your choice)",
    tier: "graduate",
    includesCertificates: true,
    description: "Roll out safe AI basics to a small squad on one job vertical.",
    highlights: [
      "Graduate lessons for every seat",
      "Shared revision lab access",
      "Team progress export (demo CSV)",
      "Certificate add-on included",
    ],
    perSeatUsd: 12,
    individualEquivalentUsd: 5 * individualSeatUsd("graduate", true),
  },
  {
    id: "growth",
    name: "Growth Team",
    priceUsd: teamPriceFromIndividual(15 * individualSeatUsd("masters", false)),
    billingLabel: "one-time",
    seats: 15,
    seatLabel: "Up to 15 learners",
    tracksLabel: "Full Masters curriculum",
    tier: "masters",
    includesCertificates: true,
    description: "Standardize Masters-level habits across a mid-size department.",
    highlights: [
      "Masters lessons for every seat",
      "Graduate content included",
      "Manager completion summary",
      "Bulk certificate workflow",
    ],
    perSeatUsd: 0,
    individualEquivalentUsd: 15 * individualSeatUsd("masters", false),
  },
  {
    id: "department",
    name: "Department",
    priceUsd: teamPriceFromPerSeat(50, 20),
    billingLabel: "one-time",
    seats: 50,
    seatLabel: "Up to 50 learners",
    tracksLabel: "Organization-wide Masters access",
    tier: "masters",
    includesCertificates: true,
    description: "Large-team rollout with priority support placeholders.",
    highlights: [
      "Everything in Growth Team",
      "Dedicated onboarding call (demo)",
      "Custom workflow review session",
      "Annual content refresh alerts",
    ],
    perSeatUsd: 20,
    individualEquivalentUsd: 50 * individualSeatUsd("masters", false),
  },
].map((plan) => ({
  ...plan,
  perSeatUsd: plan.perSeatUsd || Math.round(plan.priceUsd / plan.seats),
}));

export function getTeamPlan(id: string): TeamPlan | undefined {
  return TEAM_PLANS.find((p) => p.id === id);
}

export function teamSavingsPercent(plan: TeamPlan): number {
  if (plan.individualEquivalentUsd <= 0) return 0;
  return Math.round((1 - plan.priceUsd / plan.individualEquivalentUsd) * 100);
}

export function tierLabel(tier: PurchaseTier): string {
  if (tier === "certificate") return INDIVIDUAL_PRICING.certificate.name;
  return INDIVIDUAL_PRICING[tier].name;
}
