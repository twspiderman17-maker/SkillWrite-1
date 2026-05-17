import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
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

function addFormValue(form: URLSearchParams, key: string, value: string | number | undefined) {
  if (value === undefined || value === "") return;
  form.append(key, String(value));
}

async function createStripeCheckoutSession(
  stripeKey: string,
  params: {
    productName: string;
    amountCents: number;
    successUrl: string;
    cancelUrl: string;
    userId: string;
    customerEmail?: string;
    metadata: Record<string, string>;
  },
): Promise<string> {
  const form = new URLSearchParams();
  addFormValue(form, "mode", "payment");
  addFormValue(form, "line_items[0][quantity]", 1);
  addFormValue(form, "line_items[0][price_data][currency]", "usd");
  addFormValue(form, "line_items[0][price_data][unit_amount]", params.amountCents);
  addFormValue(form, "line_items[0][price_data][product_data][name]", params.productName);
  addFormValue(form, "success_url", params.successUrl);
  addFormValue(form, "cancel_url", params.cancelUrl);
  addFormValue(form, "client_reference_id", params.userId);
  addFormValue(form, "customer_email", params.customerEmail);

  for (const [key, value] of Object.entries(params.metadata)) {
    addFormValue(form, `metadata[${key}]`, value);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2026-04-22.dahlia",
    },
    body: form,
  });

  const payload = await response.json().catch(() => null) as { url?: string; error?: { message?: string } } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "Stripe checkout failed.");
  }
  if (!payload?.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return payload.url;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
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
            "STRIPE_SECRET_KEY is a publishable key (pk_). Use a Stripe secret key (sk_) or restricted key (rk_) with Checkout Sessions write access.",
        },
        500,
      );
    }
    if (!stripeKey.startsWith("sk_") && !stripeKey.startsWith("rk_")) {
      return json(
        { error: "STRIPE_SECRET_KEY must start with sk_ or rk_ (Stripe server-side key)." },
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

    let productName: string;
    let amountCents: number;
    let metadata: Record<string, string>;

    if (body.type === "team") {
      const planId = body.teamPlanId;
      if (!planId || !["starter", "growth", "department"].includes(planId)) {
        return json({ error: "Invalid team plan." }, 400);
      }
      productName = teamProductName(planId);
      amountCents = teamAmountCents(planId);
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
      productName = individualProductName(trackSlug, tier);
      amountCents = individualAmountCents(tier);
      metadata = {
        user_id: user.id,
        purchase_type: "individual",
        track_slug: trackSlug,
        tier,
      };
    }

    const url = await createStripeCheckoutSession(stripeKey, {
      productName,
      amountCents,
      successUrl: `${siteUrl}${successPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}${cancelPath}?checkout=cancelled`,
      userId: user.id,
      customerEmail: user.email ?? undefined,
      metadata,
    });

    return json({ url });
  } catch (e) {
    console.error("create-checkout error:", e);
    return json({ error: e instanceof Error ? e.message : "Checkout failed." }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
