import { Link } from "react-router-dom";
import { LaptopHeroArt } from "./decor/LaptopHeroArt";
import { FullBleed } from "./SectionBackdrop";

const highlights = [
  "Job-shaped scenarios, not generic AI theory",
  "Human-review at every step",
  "Verified certificates included",
] as const;

export function HomeHero() {
  return (
    <FullBleed className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/55 sm:via-white/88 sm:to-white/30 lg:via-white/82 lg:to-white/15"
        aria-hidden
      />
      <LaptopHeroArt className="pointer-events-none absolute -right-[4%] top-[52%] hidden h-[min(82vw,480px)] w-auto -translate-y-1/2 text-slate-400 opacity-[0.62] drop-shadow-[0_16px_40px_rgba(100,116,139,0.12)] sm:block md:right-0 md:h-[min(68vw,520px)] lg:h-[540px] lg:max-w-[55%] lg:opacity-[0.68]" />

      <div className="relative mx-auto w-full max-w-[90rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Practical AI training for real jobs
          </div>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
            Master AI workflows for your{" "}
            <span className="text-blue-600">specific career.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            SkillWrite teaches you how to integrate AI safely and efficiently into your daily tasks. Study with a free AI
            assistant open beside the course and practise on real job-shaped scenarios — not generic prompt engineering
            alone.
          </p>
          <ul className="mt-8 space-y-3 text-left text-sm font-medium text-slate-700 sm:text-base">
            {highlights.map((text) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                  ✓
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              Explore Courses
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/certification"
              className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition-all"
            >
              How Certificates Work
            </Link>
          </div>
        </div>
      </div>
    </FullBleed>
  );
}
