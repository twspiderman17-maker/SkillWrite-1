import type { Track } from "../types";
import { PaywallCard } from "./PaywallCard";

type DemoLessonBannerProps = {
  track: Track;
  program: "graduate" | "masters";
};

export function DemoLessonBanner({ track, program }: DemoLessonBannerProps) {
  const course = track.course;
  if (!course) return null;
  const plan = course.plans[program];

  return (
    <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">Free preview</p>
      <p className="mt-2 text-sm leading-6 text-emerald-900">
        You are viewing the first Graduate lesson at no charge. Unlock {plan.name} to access every lesson, revision
        tools, and the full study path.
      </p>
      <div className="mt-5 max-w-md">
        <PaywallCard
          trackSlug={track.slug}
          tier={program}
          title={`${plan.name} / ${plan.durationLabel}`}
          priceUsd={plan.priceUsd}
          description={plan.description}
          includes={plan.includes}
          ctaLabel={`Unlock ${plan.name}`}
        />
      </div>
    </div>
  );
}
