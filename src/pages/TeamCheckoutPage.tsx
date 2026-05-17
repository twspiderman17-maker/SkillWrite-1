import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTeamPlan } from "../data/pricing";
import { TRACKS } from "../data/tracks";
import { getCurrentUser } from "../lib/auth";
import { startStripeCheckout } from "../lib/checkout";
import { activateTeamPlan } from "../lib/teamSubscription";
import { isSupabaseConfigured } from "../lib/supabase";

export function TeamCheckoutPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = planId ? getTeamPlan(planId) : undefined;

  const [orgName, setOrgName] = useState("");
  const [trackSlug, setTrackSlug] = useState(TRACKS[0]?.slug ?? "");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!plan) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Team plan not found</h1>
        <Link to="/teams" className="mt-4 inline-block font-semibold text-blue-600">
          View team plans
        </Link>
      </div>
    );
  }

  const teamPlan = plan;
  const needsTrackPick = teamPlan.id === "starter";
  const production = isSupabaseConfigured;
  const user = getCurrentUser();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!agreed) return;

    if (!production) {
      activateTeamPlan(teamPlan, orgName, needsTrackPick ? trackSlug : undefined);
      navigate("/teams", { replace: true });
      return;
    }

    if (!user) {
      navigate(`/login?redirect=/teams/checkout/${teamPlan.id}`);
      return;
    }

    setBusy(true);
    setError("");
    try {
      await startStripeCheckout({
        type: "team",
        teamPlanId: teamPlan.id,
        orgName,
        trackSlugForTeam: needsTrackPick ? trackSlug : undefined,
        successPath: "/teams",
        cancelPath: `/teams/checkout/${teamPlan.id}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <Link to="/teams" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
        &larr; Team plans
      </Link>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-8 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            {production ? "Team checkout" : "Demo team checkout"}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{teamPlan.name}</h1>
          <p className="mt-2 text-slate-600">
            ${teamPlan.priceUsd} {teamPlan.billingLabel} · {teamPlan.seatLabel}
          </p>
        </div>

        <form onSubmit={(e) => void onSubmit(e)} className="space-y-6 p-8">
          <div
            className={`rounded-2xl border p-4 text-sm ${
              production ? "border-blue-200 bg-blue-50 text-blue-900" : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {production ? (
              <>
                One-time Stripe payment. Seats and track access are stored on your organization account after
                payment completes.
              </>
            ) : (
              <>
                <strong>Demo:</strong> no card is charged. Activating unlocks tiers in this browser only.
              </>
            )}
          </div>

          {!user && production && (
            <p className="text-sm text-slate-600">
              <Link to={`/login?redirect=/teams/checkout/${teamPlan.id}`} className="font-semibold text-blue-600">
                Sign in
              </Link>{" "}
              to continue.
            </p>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Organization name</span>
            <input
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Claims Ltd"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {needsTrackPick && (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Industry track (Starter)</span>
              <select
                value={trackSlug}
                onChange={(e) => setTrackSlug(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {TRACKS.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.shortTitle} — {t.title}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 rounded border-slate-300"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="font-semibold text-blue-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-semibold text-blue-600">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

          <button
            type="submit"
            disabled={!agreed || busy}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Redirecting…"
              : production
                ? `Pay $${teamPlan.priceUsd} with Stripe`
                : `Activate ${teamPlan.name} — $${teamPlan.priceUsd} demo`}
          </button>
        </form>
      </div>
    </div>
  );
}
