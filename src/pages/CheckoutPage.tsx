import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTrack } from "../data/tracks";
import { getCurrentUser } from "../lib/auth";
import { startStripeCheckout } from "../lib/checkout";
import { isUnlocked, unlockPurchase } from "../lib/progress";
import { isSupabaseConfigured } from "../lib/supabase";
import type { PurchaseTier } from "../types";

function isTier(value: string | undefined): value is PurchaseTier {
  return value === "graduate" || value === "masters" || value === "certificate";
}

export function CheckoutPage() {
  const { slug, tier } = useParams();
  const navigate = useNavigate();
  const track = slug ? getTrack(slug) : undefined;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!track || !track.course || !isTier(tier)) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Checkout not found</h1>
        <Link to="/courses" className="mt-4 inline-block font-semibold text-blue-600">
          Back to courses
        </Link>
      </div>
    );
  }

  const checkoutTrack = track;
  const checkoutCourse = track.course;
  const checkoutTier = tier;

  const item =
    checkoutTier === "certificate"
      ? {
          title: checkoutCourse.certificate.title,
          price: checkoutCourse.certificate.priceUsd,
          description: "Unlock the final test and certificate preview for this course.",
        }
      : {
          title: `${checkoutCourse.plans[checkoutTier].name} course`,
          price: checkoutCourse.plans[checkoutTier].priceUsd,
          description: checkoutCourse.plans[checkoutTier].description,
        };

  const alreadyUnlocked = isUnlocked(checkoutTrack.slug, checkoutTier);
  const user = getCurrentUser();
  const production = isSupabaseConfigured;

  function completeDemoCheckout() {
    unlockPurchase(checkoutTrack.slug, checkoutTier);
    if (checkoutTier === "certificate") {
      navigate(`/courses/${checkoutTrack.slug}/final-test`);
    } else {
      navigate(`/courses/${checkoutTrack.slug}`);
    }
  }

  async function handlePay() {
    if (alreadyUnlocked) {
      completeDemoCheckout();
      return;
    }

    if (!production) {
      completeDemoCheckout();
      return;
    }

    if (!user) {
      navigate(`/login?redirect=/checkout/${checkoutTrack.slug}/${checkoutTier}`);
      return;
    }

    setBusy(true);
    setError("");
    try {
      await startStripeCheckout({
        type: "individual",
        trackSlug: checkoutTrack.slug,
        tier: checkoutTier,
        successPath:
          checkoutTier === "certificate"
            ? `/courses/${checkoutTrack.slug}/final-test`
            : `/courses/${checkoutTrack.slug}`,
        cancelPath: `/checkout/${checkoutTrack.slug}/${checkoutTier}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-24 pt-10">
      <Link
        to={`/courses/${checkoutTrack.slug}`}
        className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
      >
        &larr; Back to course
      </Link>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-8 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            {production ? "Secure checkout" : "Demo checkout"}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{item.title}</h1>
          <p className="mt-2 text-slate-600">{item.description}</p>
        </div>

        <div className="grid gap-8 p-8 md:grid-cols-[1fr_16rem]">
          <div>
            <div
              className={`rounded-2xl border p-5 text-sm leading-6 ${
                production
                  ? "border-blue-200 bg-blue-50 text-blue-900"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {production ? (
                <>
                  <strong>One-time payment</strong> via Stripe. Access is saved to your SkillWrite account
                  (Supabase, us-east-1).
                </>
              ) : (
                <>
                  <strong className="text-amber-900">Demo mode:</strong> no real charge. Unlocks stay in this
                  browser only.
                </>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
              {user ? (
                <>
                  Signed in as <strong className="text-slate-900">{user.email}</strong>.
                </>
              ) : (
                <>
                  <Link
                    to={`/login?redirect=/checkout/${checkoutTrack.slug}/${checkoutTier}`}
                    className="font-semibold text-blue-600"
                  >
                    Sign in
                  </Link>{" "}
                  before checkout so your purchase is saved to your account.
                </>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Total</p>
            <p className="mt-2 text-4xl font-extrabold text-slate-900">${item.price}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">One-time purchase. No subscription.</p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handlePay()}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
            >
              {busy
                ? "Redirecting…"
                : alreadyUnlocked
                  ? "Continue"
                  : production
                    ? `Pay $${item.price} with Stripe`
                    : `Unlock for $${item.price}`}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
