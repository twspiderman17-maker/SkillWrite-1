import { FunctionsHttpError } from "@supabase/supabase-js";
import type { PurchaseTier } from "../types";
import type { TeamPlanId } from "../data/pricing";
import { getCurrentUser } from "./auth";
import { isSupabaseConfigured, supabase } from "./supabase";

type IndividualCheckout = {
  type: "individual";
  trackSlug: string;
  tier: PurchaseTier;
  successPath: string;
  cancelPath: string;
};

type TeamCheckout = {
  type: "team";
  teamPlanId: TeamPlanId;
  orgName: string;
  trackSlugForTeam?: string;
  successPath: string;
  cancelPath: string;
};

async function readFunctionError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = (await error.context.json()) as { error?: string };
      if (body?.error) return body.error;
    } catch {
      // fall through
    }
  }
  if (error instanceof Error) return error.message;
  return "Could not start checkout.";
}

export async function startStripeCheckout(args: IndividualCheckout | TeamCheckout): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Payments are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  if (!getCurrentUser()) {
    throw new Error("Sign in required.");
  }

  const { data, error } = await supabase.functions.invoke("create-checkout", { body: args });
  if (error) {
    throw new Error(await readFunctionError(error));
  }

  const payload = data as { url?: string; error?: string };
  if (payload?.error) {
    throw new Error(payload.error);
  }
  if (!payload?.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  window.location.href = payload.url;
}
