import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.7.0";

const TRACKS_ALL = [
  "insurance-fnol",
  "construction-estimating",
  "clinical-operations",
  "accounting-practices",
];

Deno.serve(async (req: Request) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return new Response("Stripe webhook not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  if (!userId) {
    return new Response("Missing user", { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const purchaseType = session.metadata?.purchase_type ?? "individual";

  if (purchaseType === "team") {
    const planId = session.metadata?.team_plan_id ?? "";
    const orgName = session.metadata?.org_name ?? null;
    const trackForStarter = session.metadata?.track_slug_for_team ?? "";
    const trackSlugs =
      planId === "starter" && trackForStarter ? [trackForStarter] : TRACKS_ALL;
    const primaryTier = planId === "starter" ? "graduate" : "masters";
    const includesCertificate = true;

    for (const trackSlug of trackSlugs) {
      await upsertEntitlement(admin, {
        userId,
        trackSlug,
        tier: primaryTier,
        sessionId: `${session.id}-${primaryTier}-${trackSlug}`,
        orgName,
        teamPlanId: planId,
      });
      if (primaryTier === "masters") {
        await upsertEntitlement(admin, {
          userId,
          trackSlug,
          tier: "graduate",
          sessionId: `${session.id}-graduate-${trackSlug}`,
          orgName,
          teamPlanId: planId,
        });
      }
      if (includesCertificate) {
        await upsertEntitlement(admin, {
          userId,
          trackSlug,
          tier: "certificate",
          sessionId: `${session.id}-certificate-${trackSlug}`,
          orgName,
          teamPlanId: planId,
        });
      }
    }
  } else {
    const trackSlug = session.metadata?.track_slug;
    const tier = session.metadata?.tier as "graduate" | "masters" | "certificate" | undefined;
    if (!trackSlug || !tier) {
      return new Response("Missing metadata", { status: 400 });
    }
    await upsertEntitlement(admin, {
      userId,
      trackSlug,
      tier,
      sessionId: session.id,
    });
    if (tier === "masters") {
      await upsertEntitlement(admin, {
        userId,
        trackSlug,
        tier: "graduate",
        sessionId: `${session.id}-graduate`,
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

async function upsertEntitlement(
  admin: ReturnType<typeof createClient>,
  args: {
    userId: string;
    trackSlug: string;
    tier: string;
    sessionId: string;
    orgName?: string | null;
    teamPlanId?: string | null;
  },
) {
  const { error } = await admin.from("entitlements").upsert(
    {
      user_id: args.userId,
      track_slug: args.trackSlug,
      tier: args.tier,
      stripe_session_id: args.sessionId,
      org_name: args.orgName ?? null,
      team_plan_id: args.teamPlanId ?? null,
    },
    { onConflict: "user_id,track_slug,tier" },
  );
  if (error) {
    console.error("entitlement upsert failed", error);
    throw error;
  }
}
