import { Link } from "react-router-dom";
import type { PurchaseTier } from "../types";

type Props = {
  trackSlug: string;
  tier: PurchaseTier;
  title: string;
  priceUsd: number;
  description: string;
  includes: string[];
  unlocked?: boolean;
  ctaLabel?: string;
};

export function PaywallCard({
  trackSlug,
  tier,
  title,
  priceUsd,
  description,
  includes,
  unlocked = false,
  ctaLabel,
}: Props) {
  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${unlocked ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">${priceUsd}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Demo price</p>
        </div>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {includes.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {unlocked ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700">
          Unlocked in this browser
        </div>
      ) : (
        <Link
          to={`/checkout/${trackSlug}/${tier}`}
          className="mt-6 flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          {ctaLabel ?? `Unlock for $${priceUsd}`}
        </Link>
      )}
    </div>
  );
}
