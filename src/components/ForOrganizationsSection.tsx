import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    ),
    title: "5–500 seats",
    caption: "Volume pricing available",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Compliance ready",
    caption: "HIPAA-aware curriculum",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" />
      </svg>
    ),
    title: "Custom tracks",
    caption: "Tailored to your workflows",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Team certificates",
    caption: "Bulk certificate issuance",
  },
] as const;

export function ForOrganizationsSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-14">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden>
        <defs>
          <pattern id="org-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#org-grid)" />
      </svg>

      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400">For organizations</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Train your team with consistent AI standards
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400">
            Equip your entire department with the same safe, structured AI workflows. Volume pricing, progress
            dashboards, and a dedicated account manager for teams of 5 or more.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:teams@skillwrite.example?subject=Team%20training%20inquiry"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
            >
              Contact Sales
              <span aria-hidden>→</span>
            </a>
            <Link
              to="/teams"
              className="inline-flex items-center rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
            >
              View Team Plans
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm transition-colors hover:border-slate-700"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                {f.icon}
              </span>
              <h3 className="mt-4 font-bold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{f.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
