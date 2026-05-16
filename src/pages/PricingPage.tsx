import { Link, useSearchParams } from "react-router-dom";
import {
  INDIVIDUAL_PRICING,
  TEAM_PLANS,
  TEAM_VOLUME_DISCOUNT,
  teamSavingsPercent,
} from "../data/pricing";

type PricingTab = "plans" | "why" | "how" | "fair";

const tabs: { id: PricingTab; label: string }[] = [
  { id: "plans", label: "Plans" },
  { id: "why", label: "Why we price this way" },
  { id: "how", label: "How we price" },
  { id: "fair", label: "Why it's fair" },
];

function isTab(value: string | null): value is PricingTab {
  return value === "plans" || value === "why" || value === "how" || value === "fair";
}

export function PricingPage() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab");
  const active: PricingTab = isTab(tabParam) ? tabParam : "plans";

  function setTab(id: PricingTab) {
    setParams({ tab: id }, { replace: true });
  }

  return (
    <div className="pb-24">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Pricing</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Pay for structured job training — not hype. Individual tracks stay low; teams save compared to buying seats
          one-by-one.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              active === t.id
                ? "border border-b-white border-slate-200 bg-white text-slate-900 -mb-px"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-b-3xl rounded-tr-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        {active === "plans" && <PlansTab />}
        {active === "why" && <WhyTab />}
        {active === "how" && <HowTab />}
        {active === "fair" && <FairTab />}
      </div>
    </div>
  );
}

function PlansTab() {
  const g = INDIVIDUAL_PRICING.graduate;
  const m = INDIVIDUAL_PRICING.masters;
  const c = INDIVIDUAL_PRICING.certificate;

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Individual (per industry track)</h2>
        <p className="mt-2 text-slate-600">Choose one job vertical. Prices apply to each track separately.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <PlanCard
            name={g.name}
            price={g.priceUsd}
            period={g.durationLabel}
            description={g.summary}
            features={["4 weeks of lessons", "Revision lab", "Prompt templates"]}
            cta={{ label: "Browse courses", to: "/courses" }}
          />
          <PlanCard
            name={m.name}
            price={m.priceUsd}
            period={m.durationLabel}
            description={m.summary}
            featured
            features={["12 weeks of lessons", "Includes Graduate", "Advanced projects"]}
            cta={{ label: "Browse courses", to: "/courses" }}
          />
          <PlanCard
            name={c.name}
            price={c.priceUsd}
            period="one-time per track"
            description={c.summary}
            features={["Practical final test", "Certificate preview", "Rubric-based marking"]}
            cta={{ label: "How certificates work", to: "/certification" }}
          />
        </div>
      </section>

      <section className="border-t border-slate-100 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
            <h2 className="text-2xl font-bold text-slate-900">Team plans</h2>
            <p className="mt-2 text-slate-600">Volume access for departments. Certificate add-ons included.</p>
          </div>
          <Link to="/teams" className="text-sm font-bold text-blue-600 hover:text-blue-700">
            Compare team plans &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {TEAM_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                ${plan.priceUsd}
                <span className="text-sm font-semibold text-slate-500"> {plan.billingLabel}</span>
              </p>
              <p className="mt-1 text-sm text-emerald-700 font-semibold">
                Save ~{teamSavingsPercent(plan)}% vs individual seats
              </p>
              <p className="mt-3 text-sm text-slate-600">
                {plan.seatLabel} · {plan.tracksLabel}
              </p>
              <Link
                to={`/teams/checkout/${plan.id}`}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Start team demo
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  featured,
}: {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: { label: string; to: string };
  featured?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 ${
        featured ? "border-blue-200 bg-blue-50/50 ring-1 ring-blue-100" : "border-slate-200 bg-white"
      }`}
    >
      <h3 className="text-xl font-bold text-slate-900">{name}</h3>
      <p className="mt-2 text-4xl font-extrabold text-slate-900">
        ${price}
        <span className="text-sm font-medium text-slate-500"> USD</span>
      </p>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{period}</p>
      <p className="mt-4 flex-grow text-sm leading-relaxed text-slate-600">{description}</p>
      <ul className="mt-6 space-y-2 text-sm text-slate-700">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-blue-600">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link
        to={cta.to}
        className={`mt-6 flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${
          featured
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}

function WhyTab() {
  return (
    <div className="space-y-6 text-slate-600 leading-relaxed">
      <p>
        SkillWrite prices for <strong className="text-slate-900">outcomes at work</strong>, not endless video hours. Most
        learners need a short, focused path: safe prompts, review habits, and job-shaped practice — not a 40-hour generic
        AI bootcamp.
      </p>
      <p>
        We keep Graduate affordable ({INDIVIDUAL_PRICING.graduate.priceUsd} USD) so individuals and small teams can try
        one vertical without a corporate procurement cycle. Masters ({INDIVIDUAL_PRICING.masters.priceUsd} USD) funds deeper
        content, more projects, and maintenance as tools change.
      </p>
      <p>
        The {INDIVIDUAL_PRICING.certificate.priceUsd} USD certificate add-on covers manual-style rubric design and
        assessment UX — it is optional because not every learner needs formal proof in month one.
      </p>
      <p>
        <Link to="/pricing?tab=how" className="font-semibold text-blue-600 hover:text-blue-700">
          See how we calculate team discounts &rarr;
        </Link>
      </p>
    </div>
  );
}

function HowTab() {
  return (
    <div className="space-y-8">
      <p className="text-slate-600 leading-relaxed">
        We start from the <strong className="text-slate-900">individual list price</strong>, then apply a team discount
        so organizations pay less per seat than buying separately.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-900">Plan</th>
              <th className="px-4 py-3 font-bold text-slate-900">Seats</th>
              <th className="px-4 py-3 font-bold text-slate-900">Individual equivalent</th>
              <th className="px-4 py-3 font-bold text-slate-900">Team price</th>
              <th className="px-4 py-3 font-bold text-slate-900">Per seat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {TEAM_PLANS.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                <td className="px-4 py-3">{p.seats}</td>
                <td className="px-4 py-3">${p.individualEquivalentUsd}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  ${p.priceUsd} {p.billingLabel}
                </td>
                <td className="px-4 py-3">~${p.perSeatUsd}/seat</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        Individual equivalent = seats × tier price ({INDIVIDUAL_PRICING.masters.priceUsd} Masters or{" "}
        {INDIVIDUAL_PRICING.graduate.priceUsd} Graduate) plus certificate add-ons where applicable. Team plans are a
        one-time purchase at {Math.round(TEAM_VOLUME_DISCOUNT * 100)}% below that total. Demo checkout does not charge
        real cards.
      </p>
    </div>
  );
}

function FairTab() {
  return (
    <div className="space-y-6 text-slate-600 leading-relaxed">
      <ul className="space-y-4">
        {[
          "You pay for a complete workflow library in your industry — not a subscription to a chatbot.",
          "Team pricing is published; discounts are calculated from the same public individual rates.",
          "No hidden seat fees in the demo — Starter, Growth, and Department tiers list max learners upfront.",
          "One-time team purchase — no recurring subscription in the demo; access unlocks stay in-browser until you clear storage.",
          "Content emphasizes review checkpoints, which reduces costly mistakes that cheap courses ignore.",
        ].map((text) => (
          <li key={text} className="flex gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
              ✓
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <p>
        Questions? Email{" "}
        <a href="mailto:billing@skillwrite.example" className="font-semibold text-blue-600">
          billing@skillwrite.example
        </a>{" "}
        or review our{" "}
        <Link to="/terms" className="font-semibold text-blue-600 hover:text-blue-700">
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
