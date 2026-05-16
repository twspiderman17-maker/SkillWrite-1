import { Link } from "react-router-dom";
import { TRACKS } from "../data/tracks";

const platformLinks = [
  { to: "/login", label: "Sign In" },
  { to: "/pricing", label: "Pricing" },
  { to: "/certification", label: "Certification" },
  { to: "/teams", label: "For Teams" },
] as const;

const trustLinks = [
  { to: "/ai-policy", label: "AI Use Policy" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/hipaa", label: "HIPAA Statement" },
] as const;

function courseLabel(shortTitle: string): string {
  switch (shortTitle) {
    case "Insurance":
      return "Insurance FNOL";
    case "Construction":
      return "Construction Estimating";
    case "Clinical":
      return "Clinical Operations Admin";
    default:
      return "Accounting Practices";
  }
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto w-full max-w-[90rem] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                S
              </span>
              <span className="text-lg font-bold text-white">SkillWrite</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Job-specific AI workflow training for professionals who need to get it right.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Courses</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TRACKS.map((t) => (
                <li key={t.slug}>
                  <Link to={`/courses/${t.slug}`} className="transition-colors hover:text-white">
                    {courseLabel(t.shortTitle)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Platform</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Trust &amp; Safety</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {trustLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 text-xs leading-relaxed text-slate-600 sm:flex-row sm:items-start sm:justify-between">
          <p>
            © {year} SkillWrite. All rights reserved. Demo learning site — courses teach safe AI use for work and do not
            replace professional advice, workplace rules, or expert review.
          </p>
          <p className="max-w-md sm:text-right">
            All AI workflows require human review before use in production, customer-facing, or regulated contexts.
          </p>
        </div>
      </div>
    </footer>
  );
}
