import { Link } from "react-router-dom";
import { TEAM_PLANS, teamSavingsPercent } from "../data/pricing";
import {
  clearTeamSubscription,
  exportTeamRosterDemo,
  getTeamSubscription,
} from "../lib/teamSubscription";
import { useEffect, useState } from "react";
import { TRACKS } from "../data/tracks";
import { getEntitlementsEventName } from "../lib/entitlements";

export function TeamsPage() {
  const [sub, setSub] = useState(getTeamSubscription());

  useEffect(() => {
    const refresh = () => setSub(getTeamSubscription());
    window.addEventListener("awa-team-updated", refresh);
    window.addEventListener(getEntitlementsEventName(), refresh);
    return () => {
      window.removeEventListener("awa-team-updated", refresh);
      window.removeEventListener(getEntitlementsEventName(), refresh);
    };
  }, []);

  return (
    <div className="pb-24">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">For organizations</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Team plans
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Roll out the same safe AI workflows to every seat. Demo activation unlocks tracks in this browser for your
          whole organization preview.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          <Link to="/pricing?tab=how" className="font-semibold text-blue-600 hover:text-blue-700">
            How we calculate team pricing
          </Link>
        </p>
      </header>

      {sub && (
        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Active team (demo)</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{sub.orgName}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {sub.planName} · {sub.seats} seats · {sub.tier} tier · {sub.trackSlugs.length} track
                {sub.trackSlugs.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const csv = exportTeamRosterDemo();
                  if (!csv) return;
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "team-roster-demo.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                Export roster CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  clearTeamSubscription();
                  setSub(null);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear team demo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {TEAM_PLANS.map((plan, index) => (
          <article
            key={plan.id}
            className={`relative flex flex-col overflow-hidden rounded-3xl border p-8 shadow-sm ${
              index === 1
                ? "border-blue-200 bg-blue-50/40 ring-1 ring-blue-100"
                : "border-slate-200 bg-white"
            }`}
          >
            {index === 1 && (
              <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                Popular
              </span>
            )}
            <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
            <p className="mt-2 text-4xl font-extrabold text-slate-900">
              ${plan.priceUsd}
              <span className="text-base font-semibold text-slate-500"> {plan.billingLabel}</span>
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-700">
              ~{teamSavingsPercent(plan)}% below individual pricing
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{plan.description}</p>
            <ul className="mt-6 flex-grow space-y-2 text-sm text-slate-700">
              <li>
                <strong className="text-slate-900">{plan.seatLabel}</strong>
              </li>
              <li>{plan.tracksLabel}</li>
              <li>{plan.tier === "masters" ? "Masters + Graduate lessons" : "Graduate lessons"}</li>
              {plan.includesCertificates && <li>Certificate add-ons included</li>}
              {plan.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-blue-600">✓</span> {h}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Effective ~${plan.perSeatUsd}/seat vs ${plan.id === "starter" ? 15 : 45} individual
            </p>
            <Link
              to={`/teams/checkout/${plan.id}`}
              className="mt-6 flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Activate demo plan
            </Link>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        <h2 className="text-xl font-bold text-slate-900">Starter plan: pick your track</h2>
        <p className="mt-2 text-sm text-slate-600">
          On checkout you will choose one of four industries for a 5-seat Graduate rollout.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {TRACKS.map((t) => (
            <li key={t.slug} className="text-sm font-medium text-slate-700">
              · {t.shortTitle} — {t.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
