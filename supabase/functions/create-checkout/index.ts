import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.7.0";
import { corsHeaders } from "../_shared/cors.ts";
import {
  individualAmountCents,
  individualProductName,
  teamAmountCents,
  teamProductName,
  type PurchaseTier,
  type TeamPlanId,
} from "../_shared/pricing.ts";

type Body = {
  type: "individual" | "team";
  trackSlug?: string;
  tier?: PurchaseTier;
  teamPlanId?: TeamPlanId;
  trackSlugForTeam?: string;
  orgName?: string;
  successPath?: string;
  cancelPath?: string;
};

function normalizeSecret(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function stripeErrorMessage(error: unknown): string {
  if (error instanceof Stripe.errors.StripeError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Checkout failed.";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = normalizeSecret(Deno.env.get("STRIPE_SECRET_KEY"));
    const siteUrl = (normalizeSecret(Deno.env.get("SITE_URL")) ?? "http://localhost:5173").replace(/\/$/, "");

    if (!stripeKey) {
      return json({ error: "Stripe is not configured on the server (STRIPE_SECRET_KEY missing)." }, 500);
    }
    if (stripeKey.startsWith("pk_")) {
      return json(
        {
          error:
            "STRIPE_SECRET_KEY is a publishable key (pk_). Use the secret key (sk_test_ or sk_live_) from Stripe → API keys.",
        },
        500,
      );
    }
    if (!stripeKey.startsWith("sk_")) {
      return json(
        { error: "STRIPE_SECRET_KEY must start with sk_test_ or sk_live_ (Stripe secret key)." },
        500,
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Sign in required." }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return json({ error: "Invalid session. Sign out and sign in again." }, 401);
    }

    const body = (await req.json()) as Body;
    const successPath = body.successPath ?? "/courses";
    const cancelPath = body.cancelPath ?? "/pricing";

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });

    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;
    let metadata: Record<string, string>;

    if (body.type === "team") {
      const planId = body.teamPlanId;
      if (!planId || !["starter", "growth", "department"].includes(planId)) {
        return json({ error: "Invalid team plan." }, 400);
      }
      lineItem = {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: teamAmountCents(planId),
          product_data: { name: teamProductName(planId) },
        },
      };
      metadata = {
        user_id: user.id,
        purchase_type: "team",
        team_plan_id: planId,
        org_name: body.orgName?.trim() ?? "",
        track_slug_for_team: body.trackSlugForTeam ?? "",
      };
    } else {
      const tier = body.tier;
      const trackSlug = body.trackSlug;
      if (!tier || !trackSlug || !["graduate", "masters", "certificate"].includes(tier)) {
        return json({ error: "Invalid course or tier." }, 400);
      }
      lineItem = {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: individualAmountCents(tier),
          product_data: { name: individualProductName(trackSlug, tier) },
        },
      };
      metadata = {
        user_id: user.id,
        purchase_type: "individual",
        track_slug: trackSlug,
        tier,
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      success_url: `${siteUrl}${successPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${cancelPath}?checkout=cancelled`,
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      metadata,
    });

    if (!session.url) {
      return json({ error: "Stripe did not return a checkout URL." }, 500);
    }

    return json({ url: session.url });
  } catch (e) {
    console.error("create-checkout error:", e);
    return json({ error: stripeErrorMessage(e) }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
